import {
  SimulatedHost,
  SimulatedVM,
  MigrationRecord,
  MigrationStrategy,
  SimulationState,
  ActivityEvent,
} from '../types/simulation';
import { canHostAccommodateVm, recalculateHostUsage } from './calculations';

/**
 * Creates a new migration record with realistic simulated overhead values.
 */
export function createMigrationRecord(
  vm: SimulatedVM,
  sourceHost: SimulatedHost,
  destinationHost: SimulatedHost,
  strategy: MigrationStrategy,
  currentStep: number,
  reason: string
): MigrationRecord {
  const migrationId = `mig-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Simulated link bandwidth = 10 Gbps (1.25 GB/s effective with hypervisor encryption)
  const bandwidthGBps = 1.25;

  let simulatedDataTransferredGB = 0;
  let estimatedDurationSeconds = 0;
  let estimatedDowntimeMs = 0;

  if (strategy === 'Live') {
    // Live migration pre-copy + dirty page iterations (~1.2x memory size)
    simulatedDataTransferredGB = Math.round(vm.memoryUsageGB * 1.25 * 10) / 10;
    estimatedDurationSeconds = Math.max(3, Math.round((simulatedDataTransferredGB / bandwidthGBps) * 10) / 10);
    // Live migration switchover downtime: short 80 - 240 ms
    estimatedDowntimeMs = Math.round(80 + Math.random() * 160);
  } else if (strategy === 'Cold') {
    // Cold migration: memory image flushed + state transfer
    simulatedDataTransferredGB = vm.memoryUsageGB;
    estimatedDurationSeconds = Math.max(5, Math.round((simulatedDataTransferredGB / bandwidthGBps) * 10) / 10 + 4);
    // Cold downtime = full suspension + transfer + reboot time (e.g. 10s - 25s)
    estimatedDowntimeMs = Math.round(estimatedDurationSeconds * 1000);
  } else {
    // Emergency migration (host failure recovery): boot on new host
    simulatedDataTransferredGB = Math.round(vm.memoryUsageGB * 0.5 * 10) / 10;
    estimatedDurationSeconds = Math.max(4, Math.round((simulatedDataTransferredGB / bandwidthGBps) * 10) / 10 + 2);
    // Crash detection + recovery startup downtime
    estimatedDowntimeMs = Math.round(5000 + Math.random() * 3000);
  }

  return {
    migrationId,
    vmId: vm.id,
    vmName: vm.name,
    sourceHostId: sourceHost.id,
    sourceHostName: sourceHost.name,
    destinationHostId: destinationHost.id,
    destinationHostName: destinationHost.name,
    strategy,
    status: 'Pending',
    progressPercent: 0,
    startTime: currentStep,
    estimatedDurationSeconds,
    simulatedDataTransferredGB,
    estimatedDowntimeMs,
    reason,
    loadBeforeMigration: {
      sourceCpu: sourceHost.usedCpuPercent,
      destCpu: destinationHost.usedCpuPercent,
    },
  };
}

/**
 * Validates and initiates a migration, reserving capacity on the destination host
 * and updating VM status to Migrating.
 */
export function startMigration(
  state: SimulationState,
  vmId: string,
  destinationHostId: string,
  strategy: MigrationStrategy,
  reason: string
): {
  success: boolean;
  newState: SimulationState;
  errorMessage?: string;
  migrationRecord?: MigrationRecord;
} {
  const vm = state.vms.find((v) => v.id === vmId);
  if (!vm) {
    return { success: false, newState: state, errorMessage: `VM ${vmId} not found.` };
  }

  if (!vm.migrationEligible) {
    return { success: false, newState: state, errorMessage: `VM ${vm.name} is marked ineligible for migration.` };
  }

  if (vm.status === 'Migrating') {
    return { success: false, newState: state, errorMessage: `VM ${vm.name} is already migrating.` };
  }

  const sourceHost = state.hosts.find((h) => h.id === vm.currentHostId);
  if (!sourceHost) {
    return { success: false, newState: state, errorMessage: `Source host for VM ${vm.name} not found.` };
  }

  const destHost = state.hosts.find((h) => h.id === destinationHostId);
  if (!destHost) {
    return { success: false, newState: state, errorMessage: `Destination host ${destinationHostId} not found.` };
  }

  if (destHost.id === sourceHost.id) {
    return { success: false, newState: state, errorMessage: `Destination host cannot be the same as source host.` };
  }

  // Validate capacity
  const capacityCheck = canHostAccommodateVm(destHost, vm, state.lbConfig, true);
  if (!capacityCheck.canAccommodate) {
    const failedRecord = createMigrationRecord(vm, sourceHost, destHost, strategy, state.step, reason);
    failedRecord.status = 'Failed';
    failedRecord.failureReason = capacityCheck.reason;
    failedRecord.completionTime = state.step;

    const event: ActivityEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      step: state.step,
      timestamp: new Date().toLocaleTimeString(),
      level: 'error',
      category: 'migration',
      message: `Migration rejected: Destination ${destHost.name} capacity insufficient for ${vm.name}.`,
      details: capacityCheck.reason,
    };

    return {
      success: false,
      newState: {
        ...state,
        migrations: [failedRecord, ...state.migrations],
        activityLogs: [event, ...state.activityLogs],
      },
      errorMessage: capacityCheck.reason,
      migrationRecord: failedRecord,
    };
  }

  // Create active migration record
  const record = createMigrationRecord(vm, sourceHost, destHost, strategy, state.step, reason);
  record.status = 'In Progress';
  record.progressPercent = 10;

  // Reserve capacity on destination host so concurrent migrations do not oversubscribe
  const updatedHosts = state.hosts.map((h) => {
    if (h.id === destHost.id) {
      return {
        ...h,
        reservedCpuCores: (h.reservedCpuCores || 0) + vm.vCpu * (vm.cpuDemandPercent / 100),
        reservedMemoryGB: (h.reservedMemoryGB || 0) + vm.memoryUsageGB,
        reservedStorageGB: (h.reservedStorageGB || 0) + vm.storageGB,
      };
    }
    return h;
  });

  // Mark VM as migrating
  const updatedVms = state.vms.map((v) => {
    if (v.id === vm.id) {
      return {
        ...v,
        status: 'Migrating' as const,
      };
    }
    return v;
  });

  const event: ActivityEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    step: state.step,
    timestamp: new Date().toLocaleTimeString(),
    level: 'info',
    category: 'migration',
    message: `Started ${strategy} migration of ${vm.name} from ${sourceHost.name} to ${destHost.name}.`,
    details: `Estimated duration: ${record.estimatedDurationSeconds}s | Est. transfer: ${record.simulatedDataTransferredGB} GB | Reason: ${reason}`,
  };

  return {
    success: true,
    newState: {
      ...state,
      hosts: updatedHosts,
      vms: updatedVms,
      activeMigrations: [...state.activeMigrations, record],
      activityLogs: [event, ...state.activityLogs],
    },
    migrationRecord: record,
  };
}

/**
 * Advances progress of active migrations or completes them.
 * Performs atomic placement update on completion.
 */
export function progressMigrations(state: SimulationState): SimulationState {
  if (state.activeMigrations.length === 0) return state;

  const newlyCompleted: MigrationRecord[] = [];
  const remainingActive: MigrationRecord[] = [];
  let updatedHosts = [...state.hosts];
  let updatedVms = [...state.vms];
  const newActivityEvents: ActivityEvent[] = [];

  for (const mig of state.activeMigrations) {
    const nextProgress = mig.progressPercent + 35; // completes in 3 simulation steps

    if (nextProgress >= 100) {
      // Complete migration atomically!
      const vm = updatedVms.find((v) => v.id === mig.vmId);
      const sourceHost = updatedHosts.find((h) => h.id === mig.sourceHostId);
      const destHost = updatedHosts.find((h) => h.id === mig.destinationHostId);

      if (vm && destHost && sourceHost) {
        // Update VM placement
        updatedVms = updatedVms.map((v) => {
          if (v.id === vm.id) {
            return {
              ...v,
              currentHostId: destHost.id,
              status: 'Running' as const,
              lastMigratedStep: state.step,
            };
          }
          return v;
        });

        // Update hosts assigned VM lists and remove reservations
        updatedHosts = updatedHosts.map((h) => {
          if (h.id === sourceHost.id) {
            return {
              ...h,
              assignedVmIds: h.assignedVmIds.filter((id) => id !== vm.id),
              cooldownUntilStep: state.step + state.lbConfig.cooldownSteps,
            };
          }
          if (h.id === destHost.id) {
            const currentAssigned = h.assignedVmIds.includes(vm.id)
              ? h.assignedVmIds
              : [...h.assignedVmIds, vm.id];

            return {
              ...h,
              assignedVmIds: currentAssigned,
              reservedCpuCores: Math.max(0, (h.reservedCpuCores || 0) - vm.vCpu * (vm.cpuDemandPercent / 100)),
              reservedMemoryGB: Math.max(0, (h.reservedMemoryGB || 0) - vm.memoryUsageGB),
              reservedStorageGB: Math.max(0, (h.reservedStorageGB || 0) - vm.storageGB),
              cooldownUntilStep: state.step + state.lbConfig.cooldownSteps,
            };
          }
          return h;
        });

        // Recalculate both source and destination host usages
        updatedHosts = updatedHosts.map((h) =>
          recalculateHostUsage(h, updatedVms, state.lbConfig)
        );

        const finalizedSource = updatedHosts.find((h) => h.id === sourceHost.id);
        const finalizedDest = updatedHosts.find((h) => h.id === destHost.id);

        const completedRecord: MigrationRecord = {
          ...mig,
          progressPercent: 100,
          status: 'Completed',
          completionTime: state.step,
          loadAfterMigration: {
            sourceCpu: finalizedSource?.usedCpuPercent ?? 0,
            destCpu: finalizedDest?.usedCpuPercent ?? 0,
          },
        };

        newlyCompleted.push(completedRecord);

        newActivityEvents.push({
          id: `evt-comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          step: state.step,
          timestamp: new Date().toLocaleTimeString(),
          level: 'success',
          category: 'migration',
          message: `Completed migration of ${vm.name} to ${destHost.name}.`,
          details: `Source CPU dropped to ${finalizedSource?.usedCpuPercent}%. Dest CPU now ${finalizedDest?.usedCpuPercent}%. Downtime: ${completedRecord.estimatedDowntimeMs}ms.`,
        });
      } else {
        // Source or destination was removed or failed during migration
        const failedRecord: MigrationRecord = {
          ...mig,
          status: 'Failed',
          failureReason: 'Source or destination host became unavailable during transfer.',
          completionTime: state.step,
        };
        newlyCompleted.push(failedRecord);
      }
    } else {
      remainingActive.push({
        ...mig,
        progressPercent: nextProgress,
      });
    }
  }

  return {
    ...state,
    hosts: updatedHosts,
    vms: updatedVms,
    activeMigrations: remainingActive,
    migrations: [...newlyCompleted, ...state.migrations],
    activityLogs: [...newActivityEvents, ...state.activityLogs],
  };
}
