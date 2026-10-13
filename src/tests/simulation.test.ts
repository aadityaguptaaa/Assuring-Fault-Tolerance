import { describe, it, expect } from 'vitest';
import {
  createDefaultHosts,
  createDefaultVms,
  createInitialSimulationState,
  recalculateHostUsage,
  calculateLoadScore,
  canHostAccommodateVm,
  calculateSystemMetrics,
  DEFAULT_LB_CONFIG,
} from '../engine/calculations';
import {
  findDestinationFirstFit,
  findDestinationBestFit,
  findDestinationLeastLoaded,
  evaluateLoadBalancing,
} from '../engine/loadBalancer';
import { startMigration, progressMigrations } from '../engine/migrationEngine';
import { simulateHostFailure, restoreHost } from '../engine/faultTolerance';
import { createIsolatedState, runExp4AlgorithmComparison } from '../engine/experimentsEngine';
import { SimulatedHost, SimulatedVM, SimulationState } from '../types/simulation';

describe('Cloud Infrastructure Simulator Unit Tests', () => {
  // Test 1: Host utilization calculations
  it('1. correctly calculates host CPU, memory, and storage utilization', () => {
    const host: SimulatedHost = {
      id: 'test-host-1',
      name: 'Test Host 1',
      status: 'Healthy',
      totalCpuCores: 32,
      totalMemoryGB: 128,
      totalStorageGB: 1000,
      usedCpuPercent: 0,
      usedMemoryGB: 0,
      usedStorageGB: 0,
      networkUtilizationPercent: 0,
      assignedVmIds: ['test-vm-1'],
      healthStatus: 'Healthy',
      rackId: 'R1',
    };

    const vm: SimulatedVM = {
      id: 'test-vm-1',
      name: 'Test VM 1',
      vCpu: 16,
      memoryGB: 64,
      storageGB: 200,
      cpuDemandPercent: 50, // 16 * 0.5 = 8 cores used
      memoryUsageGB: 32,
      networkDemandMbps: 500,
      currentHostId: 'test-host-1',
      status: 'Running',
      workloadType: 'Web Server',
      migrationEligible: true,
      priority: 'High',
    };

    const updated = recalculateHostUsage(host, [vm], DEFAULT_LB_CONFIG);
    // 8 cores used out of 32 = 25% CPU
    expect(updated.usedCpuPercent).toBe(25);
    expect(updated.usedMemoryGB).toBe(32);
    expect(updated.usedStorageGB).toBe(200);
    expect(updated.status).toBe('Healthy');
  });

  // Test 2: Capacity validation
  it('2. validates destination host capacity limits and headroom thresholds', () => {
    const host: SimulatedHost = {
      id: 'small-host',
      name: 'Small Host',
      status: 'Healthy',
      totalCpuCores: 8,
      totalMemoryGB: 16,
      totalStorageGB: 100,
      usedCpuPercent: 50,
      usedMemoryGB: 12,
      usedStorageGB: 50,
      networkUtilizationPercent: 10,
      assignedVmIds: [],
      healthStatus: 'Healthy',
      rackId: 'R1',
    };

    const largeVm: SimulatedVM = {
      id: 'large-vm',
      name: 'Large VM',
      vCpu: 8,
      memoryGB: 32,
      storageGB: 50,
      cpuDemandPercent: 80,
      memoryUsageGB: 20, // exceeds available RAM (16 - 12 = 4 GB available)
      networkDemandMbps: 100,
      currentHostId: null,
      status: 'Running',
      workloadType: 'Database',
      migrationEligible: true,
      priority: 'High',
    };

    const check = canHostAccommodateVm(host, largeVm, DEFAULT_LB_CONFIG, false);
    expect(check.canAccommodate).toBe(false);
    expect(check.reason).toContain('Insufficient RAM');
  });

  // Test 3: First Fit selection
  it('3. First Fit chooses the first feasible healthy host', () => {
    const hosts = createDefaultHosts();
    const vms = createDefaultVms();
    const sourceHost = hosts[0];
    const candidateVm = vms[0];

    const result = findDestinationFirstFit(candidateVm, sourceHost, hosts, DEFAULT_LB_CONFIG);
    expect(result.destination).not.toBeNull();
    // First fit evaluates sequentially and picks the first host with spare capacity (host-2)
    expect(result.destination?.id).toBe('host-2');
  });

  // Test 4: Best Fit selection
  it('4. Best Fit chooses the host that minimizes residual slack without exceeding thresholds', () => {
    const hosts = createDefaultHosts();
    const vms = createDefaultVms();
    const sourceHost = hosts[0];
    const candidateVm = vms[0];

    const result = findDestinationBestFit(candidateVm, sourceHost, hosts, DEFAULT_LB_CONFIG);
    expect(result.destination).not.toBeNull();
    expect(result.evaluations.length).toBeGreaterThan(0);
  });

  // Test 5: Least Loaded selection
  it('5. Least Loaded chooses the host with lowest weighted load score', () => {
    const hosts = createDefaultHosts();
    const vms = createDefaultVms();
    const sourceHost = hosts[0];
    const candidateVm = vms[0];

    // host-6 has the lowest CPU and memory usage in default configuration
    const result = findDestinationLeastLoaded(candidateVm, sourceHost, hosts, DEFAULT_LB_CONFIG);
    expect(result.destination).not.toBeNull();
    expect(result.destination?.id).toBe('host-6');
  });

  // Test 6: Migration success
  it('6. successfully starts and completes a migration with atomic state updates', () => {
    const state = createInitialSimulationState();
    const vm = state.vms[0]; // on host-1
    const targetHost = state.hosts[5]; // host-6 has low load

    const startResult = startMigration(state, vm.id, targetHost.id, 'Live', 'Test rebalance');
    expect(startResult.success).toBe(true);
    expect(startResult.newState.activeMigrations.length).toBe(1);

    // Progress migration until complete
    let progressed = startResult.newState;
    while (progressed.activeMigrations.length > 0) {
      progressed = progressMigrations(progressed);
    }

    const migratedVm = progressed.vms.find((v) => v.id === vm.id);
    expect(migratedVm?.currentHostId).toBe(targetHost.id);
    expect(migratedVm?.status).toBe('Running');

    // Host 1 no longer has the VM
    const oldHost = progressed.hosts.find((h) => h.id === 'host-1');
    expect(oldHost?.assignedVmIds.includes(vm.id)).toBe(false);

    // Host 6 now has the VM
    const newHost = progressed.hosts.find((h) => h.id === targetHost.id);
    expect(newHost?.assignedVmIds.includes(vm.id)).toBe(true);
  });

  // Test 7: Migration rejection when destination capacity is insufficient
  it('7. rejects migration when destination host lacks capacity', () => {
    const state = createInitialSimulationState();
    // artifically fill destination host to 100%
    state.hosts[5].usedMemoryGB = state.hosts[5].totalMemoryGB;
    state.hosts[5].usedCpuPercent = 95;

    const vm = state.vms[0];
    const result = startMigration(state, vm.id, state.hosts[5].id, 'Live', 'Overload test');

    expect(result.success).toBe(false);
    expect(result.errorMessage).toBeDefined();
    expect(result.newState.activeMigrations.length).toBe(0);
  });

  // Test 8: Prevention of VM duplication
  it('8. prevents VM duplication across multiple hosts during migration', () => {
    const state = createInitialSimulationState();
    const vm = state.vms[0];
    const targetHost = state.hosts[4];

    const startResult = startMigration(state, vm.id, targetHost.id, 'Live', 'Duplication check');
    let completed = startResult.newState;
    while (completed.activeMigrations.length > 0) {
      completed = progressMigrations(completed);
    }

    // VM must appear in exactly ONE host's assignedVmIds
    const assignedHosts = completed.hosts.filter((h) => h.assignedVmIds.includes(vm.id));
    expect(assignedHosts.length).toBe(1);
    expect(assignedHosts[0].id).toBe(targetHost.id);
  });

  // Test 9: Prevention of assignment to failed hosts
  it('9. prevents assignment of VMs to a failed host', () => {
    const state = createInitialSimulationState();
    state.hosts[1].status = 'Failed';

    const vm = state.vms[0];
    const check = canHostAccommodateVm(state.hosts[1], vm, state.lbConfig, false);
    expect(check.canAccommodate).toBe(false);
    expect(check.reason).toContain('FAILED');

    const result = startMigration(state, vm.id, state.hosts[1].id, 'Live', 'Fail test');
    expect(result.success).toBe(false);
  });

  // Test 10: Host failure recovery
  it('10. recovers VMs from a failed host to surviving healthy hosts', () => {
    const state = createInitialSimulationState();
    // Fail host-1 which has vm-1 and vm-2
    const { newState, result } = simulateHostFailure(state, 'host-1');

    expect(result.totalVmsAffected).toBe(2);
    expect(result.vmsRecovered.length).toBe(2);
    expect(result.vmsUnrecovered.length).toBe(0);
    expect(result.successRate).toBe(100);

    const failedHost = newState.hosts.find((h) => h.id === 'host-1');
    expect(failedHost?.status).toBe('Failed');
    expect(failedHost?.assignedVmIds.length).toBe(0);

    // All affected VMs must now be assigned to healthy hosts and running
    const vm1 = newState.vms.find((v) => v.id === 'vm-1');
    const vm2 = newState.vms.find((v) => v.id === 'vm-2');
    expect(vm1?.currentHostId).not.toBe('host-1');
    expect(vm1?.status).toBe('Running');
    expect(vm2?.currentHostId).not.toBe('host-1');
    expect(vm2?.status).toBe('Running');
  });

  // Test 11: Recovery failure when no host has enough capacity
  it('11. correctly reports unrecovered VMs when cluster has insufficient capacity', () => {
    const state = createInitialSimulationState();
    // Fill all other hosts to 100% capacity
    state.hosts.forEach((h) => {
      if (h.id !== 'host-1') {
        h.usedMemoryGB = h.totalMemoryGB;
      }
    });

    const { result } = simulateHostFailure(state, 'host-1');
    expect(result.vmsUnrecovered.length).toBeGreaterThan(0);
    expect(result.successRate).toBeLessThan(100);
  });

  // Test 12: Metric calculation when there are zero migrations
  it('12. handles division by zero safely when there are zero migrations', () => {
    const state = createInitialSimulationState();
    state.migrations = [];
    state.activeMigrations = [];

    const metrics = calculateSystemMetrics(state);
    expect(metrics.totalMigrationAttempts).toBe(0);
    expect(metrics.migrationSuccessRate).toBe(100);
    expect(metrics.meanMigrationDurationSeconds).toBe(0);
    expect(metrics.meanEstimatedDowntimeMs).toBe(0);
    expect(isNaN(metrics.migrationSuccessRate)).toBe(false);
  });

  // Test 13: Reset behavior
  it('13. resets environment cleanly to initial 6 hosts and 12 VMs', () => {
    let state = createInitialSimulationState();
    // Mutate state
    state.hosts[0].status = 'Failed';
    state.vms[0].status = 'Stopped';

    // Reset
    state = createInitialSimulationState();
    expect(state.hosts.length).toBe(6);
    expect(state.vms.length).toBe(12);
    expect(state.hosts.every((h) => h.status === 'Healthy' || h.status === 'Warning')).toBe(true);
    expect(state.migrations.length).toBe(0);
    expect(state.activeMigrations.length).toBe(0);
  });

  // Test 14: Experiment isolation between algorithms
  it('14. guarantees complete state isolation when running comparative experiments', () => {
    const state1 = createIsolatedState('FirstFit', 'Normal');
    const state2 = createIsolatedState('LeastLoaded', 'Normal');

    state1.hosts[0].usedCpuPercent = 99; // mutate state1
    expect(state2.hosts[0].usedCpuPercent).not.toBe(99); // state2 unaffected
  });

  // Test 15: Concurrent migration capacity reservation
  it('15. reserves capacity on destination host to prevent oversubscription during concurrent migrations', () => {
    const state = createInitialSimulationState();
    const destHost = state.hosts[5];
    const initialReservedRam = destHost.reservedMemoryGB || 0;

    const vm = state.vms[0];
    const startResult = startMigration(state, vm.id, destHost.id, 'Live', 'Reservation test');

    const updatedDest = startResult.newState.hosts.find((h) => h.id === destHost.id);
    expect(updatedDest?.reservedMemoryGB).toBe(initialReservedRam + vm.memoryUsageGB);
  });
});
