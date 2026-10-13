import {
  SimulatedHost,
  SimulatedVM,
  SimulationState,
  FaultRecoveryResult,
  ActivityEvent,
  MigrationRecord,
} from '../types/simulation';
import { canHostAccommodateVm, recalculateHostUsage } from './calculations';

/**
 * Triggers a simulated failure on a specific host and executes emergency recovery.
 */
export function simulateHostFailure(
  state: SimulationState,
  hostId: string
): { newState: SimulationState; result: FaultRecoveryResult } {
  const host = state.hosts.find((h) => h.id === hostId);
  if (!host) {
    throw new Error(`Host with ID ${hostId} does not exist.`);
  }

  // 1. Identify assigned VMs
  const affectedVms = state.vms.filter(
    (vm) => host.assignedVmIds.includes(vm.id) && vm.currentHostId === host.id
  );

  // 2. Mark host as Failed
  let updatedHosts = state.hosts.map((h) => {
    if (h.id === hostId) {
      return {
        ...h,
        status: 'Failed' as const,
        healthStatus: 'Failed' as const,
        usedCpuPercent: 0,
        usedMemoryGB: 0,
        networkUtilizationPercent: 0,
        assignedVmIds: [],
      };
    }
    return h;
  });

  // 3. Mark affected VMs as Recovery Pending
  let updatedVms = state.vms.map((vm) => {
    if (affectedVms.some((av) => av.id === vm.id)) {
      return {
        ...vm,
        status: 'Recovery Pending' as const,
        currentHostId: null,
      };
    }
    return vm;
  });

  const vmsRecovered: string[] = [];
  const vmsUnrecovered: string[] = [];
  const recoveryDetails: string[] = [];
  const emergencyMigrations: MigrationRecord[] = [];
  const activityLogs: ActivityEvent[] = [
    {
      id: `evt-fail-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      step: state.step,
      timestamp: new Date().toLocaleTimeString(),
      level: 'error',
      category: 'fault-tolerance',
      message: `HOST FAILURE DETECTED: Physical Host ${host.name} has suffered a hardware crash.`,
      details: `${affectedVms.length} virtual machines affected and require emergency placement.`,
    },
  ];

  // 4. Sort affected VMs by priority (High priority first)
  const sortedVms = [...affectedVms].sort((a, b) => {
    const priorityWeight = { High: 3, Medium: 2, Low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  // 5. Place affected VMs onto healthy surviving hosts with spare capacity
  for (const vm of sortedVms) {
    // Find candidate surviving hosts
    const candidateHosts = updatedHosts.filter(
      (h) => h.status === 'Healthy' || h.status === 'Warning'
    );

    let placedHost: SimulatedHost | null = null;
    let failureReason = 'No healthy hosts with sufficient capacity available.';

    for (const candHost of candidateHosts) {
      const check = canHostAccommodateVm(candHost, vm, state.lbConfig, false);
      if (check.canAccommodate) {
        placedHost = candHost;
        break;
      } else {
        failureReason = check.reason || failureReason;
      }
    }

    if (placedHost) {
      // Place VM on surviving host
      vmsRecovered.push(vm.name);

      // Create emergency migration record
      const emergencyRecord: MigrationRecord = {
        migrationId: `emerg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        vmId: vm.id,
        vmName: vm.name,
        sourceHostId: host.id,
        sourceHostName: host.name,
        destinationHostId: placedHost.id,
        destinationHostName: placedHost.name,
        strategy: 'Emergency',
        status: 'Completed',
        progressPercent: 100,
        startTime: state.step,
        completionTime: state.step,
        estimatedDurationSeconds: 4.5,
        simulatedDataTransferredGB: Math.round(vm.memoryUsageGB * 0.5 * 10) / 10,
        estimatedDowntimeMs: 6500,
        reason: `Emergency recovery from failed host ${host.name}.`,
      };
      emergencyMigrations.push(emergencyRecord);

      // Update VM
      updatedVms = updatedVms.map((v) => {
        if (v.id === vm.id) {
          return {
            ...v,
            currentHostId: placedHost!.id,
            status: 'Running' as const,
            lastMigratedStep: state.step,
          };
        }
        return v;
      });

      // Update host
      updatedHosts = updatedHosts.map((h) => {
        if (h.id === placedHost!.id) {
          return {
            ...h,
            assignedVmIds: [...h.assignedVmIds, vm.id],
          };
        }
        return h;
      });

      // Recalculate usage for this host
      updatedHosts = updatedHosts.map((h) =>
        recalculateHostUsage(h, updatedVms, state.lbConfig)
      );

      recoveryDetails.push(
        `VM ${vm.name} (${vm.priority} priority) successfully recovered to ${placedHost.name}.`
      );

      activityLogs.push({
        id: `evt-rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        step: state.step,
        timestamp: new Date().toLocaleTimeString(),
        level: 'success',
        category: 'fault-tolerance',
        message: `Emergency placement: ${vm.name} recovered to ${placedHost.name}.`,
        details: `Simulated downtime: 6.5s. Workload restarted from storage snapshot.`,
      });
    } else {
      // Unrecovered VM due to cluster capacity exhaustion
      vmsUnrecovered.push(vm.name);

      updatedVms = updatedVms.map((v) => {
        if (v.id === vm.id) {
          return {
            ...v,
            status: 'Failed' as const,
          };
        }
        return v;
      });

      recoveryDetails.push(
        `VM ${vm.name} could NOT be recovered: ${failureReason}`
      );

      activityLogs.push({
        id: `evt-unrec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        step: state.step,
        timestamp: new Date().toLocaleTimeString(),
        level: 'error',
        category: 'fault-tolerance',
        message: `Recovery failed for ${vm.name}: Insufficient cluster capacity.`,
        details: failureReason,
      });
    }
  }

  const successRate =
    affectedVms.length > 0
      ? Math.round((vmsRecovered.length / affectedVms.length) * 1000) / 10
      : 100;

  const result: FaultRecoveryResult = {
    failedHostId: host.id,
    failedHostName: host.name,
    totalVmsAffected: affectedVms.length,
    vmsRecovered,
    vmsUnrecovered,
    recoveryDurationSteps: 1,
    successRate,
    details: recoveryDetails,
  };

  return {
    newState: {
      ...state,
      hosts: updatedHosts,
      vms: updatedVms,
      migrations: [...emergencyMigrations, ...state.migrations],
      activityLogs: [...activityLogs, ...state.activityLogs],
    },
    result,
  };
}

/**
 * Restores a failed or maintenance host back to Healthy operational status.
 */
export function restoreHost(
  state: SimulationState,
  hostId: string
): { newState: SimulationState; message: string } {
  const host = state.hosts.find((h) => h.id === hostId);
  if (!host) {
    throw new Error(`Host with ID ${hostId} does not exist.`);
  }

  const updatedHosts = state.hosts.map((h) => {
    if (h.id === hostId) {
      return recalculateHostUsage(
        {
          ...h,
          status: 'Healthy' as const,
          healthStatus: 'Healthy' as const,
          reservedCpuCores: 0,
          reservedMemoryGB: 0,
          reservedStorageGB: 0,
          cooldownUntilStep: 0,
        },
        state.vms,
        state.lbConfig
      );
    }
    return h;
  });

  const event: ActivityEvent = {
    id: `evt-rst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    step: state.step,
    timestamp: new Date().toLocaleTimeString(),
    level: 'info',
    category: 'system',
    message: `Physical Host ${host.name} restored to service.`,
    details: `Hardware diagnostics passed. Host is now available for VM allocations and load balancing.`,
  };

  return {
    newState: {
      ...state,
      hosts: updatedHosts,
      activityLogs: [event, ...state.activityLogs],
    },
    message: `Host ${host.name} successfully restored to Healthy status.`,
  };
}
