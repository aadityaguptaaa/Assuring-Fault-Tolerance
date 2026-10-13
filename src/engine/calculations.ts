import {
  SimulatedHost,
  SimulatedVM,
  SimulationState,
  SystemMetrics,
  LoadBalancerConfig,
} from '../types/simulation';

export const DEFAULT_LB_CONFIG: LoadBalancerConfig = {
  algorithm: 'LeastLoaded',
  cpuOverloadThreshold: 80,
  memoryOverloadThreshold: 85,
  underloadThreshold: 25,
  cpuWeight: 0.5,
  memoryWeight: 0.4,
  storageWeight: 0.1,
  cooldownSteps: 3,
  hysteresisMargin: 5,
  autoBalanceEnabled: true,
};

export function createDefaultHosts(): SimulatedHost[] {
  return [
    {
      id: 'host-1',
      name: 'Physical Host 01 (Rack A1)',
      status: 'Healthy',
      totalCpuCores: 32,
      totalMemoryGB: 128,
      totalStorageGB: 1000,
      usedCpuPercent: 45,
      usedMemoryGB: 64,
      usedStorageGB: 350,
      networkUtilizationPercent: 32,
      assignedVmIds: ['vm-1', 'vm-2'],
      healthStatus: 'Healthy',
      rackId: 'Rack-A1',
      reservedCpuCores: 0,
      reservedMemoryGB: 0,
      reservedStorageGB: 0,
    },
    {
      id: 'host-2',
      name: 'Physical Host 02 (Rack A2)',
      status: 'Healthy',
      totalCpuCores: 32,
      totalMemoryGB: 128,
      totalStorageGB: 1000,
      usedCpuPercent: 55,
      usedMemoryGB: 72,
      usedStorageGB: 400,
      networkUtilizationPercent: 41,
      assignedVmIds: ['vm-3', 'vm-4'],
      healthStatus: 'Healthy',
      rackId: 'Rack-A2',
      reservedCpuCores: 0,
      reservedMemoryGB: 0,
      reservedStorageGB: 0,
    },
    {
      id: 'host-3',
      name: 'Physical Host 03 (Rack B1)',
      status: 'Healthy',
      totalCpuCores: 64,
      totalMemoryGB: 256,
      totalStorageGB: 2000,
      usedCpuPercent: 62,
      usedMemoryGB: 140,
      usedStorageGB: 750,
      networkUtilizationPercent: 50,
      assignedVmIds: ['vm-5', 'vm-6', 'vm-7'],
      healthStatus: 'Healthy',
      rackId: 'Rack-B1',
      reservedCpuCores: 0,
      reservedMemoryGB: 0,
      reservedStorageGB: 0,
    },
    {
      id: 'host-4',
      name: 'Physical Host 04 (Rack B2)',
      status: 'Healthy',
      totalCpuCores: 64,
      totalMemoryGB: 256,
      totalStorageGB: 2000,
      usedCpuPercent: 40,
      usedMemoryGB: 96,
      usedStorageGB: 600,
      networkUtilizationPercent: 35,
      assignedVmIds: ['vm-8', 'vm-9'],
      healthStatus: 'Healthy',
      rackId: 'Rack-B2',
      reservedCpuCores: 0,
      reservedMemoryGB: 0,
      reservedStorageGB: 0,
    },
    {
      id: 'host-5',
      name: 'Physical Host 05 (Rack C1)',
      status: 'Healthy',
      totalCpuCores: 48,
      totalMemoryGB: 192,
      totalStorageGB: 1500,
      usedCpuPercent: 35,
      usedMemoryGB: 54,
      usedStorageGB: 380,
      networkUtilizationPercent: 28,
      assignedVmIds: ['vm-10', 'vm-11'],
      healthStatus: 'Healthy',
      rackId: 'Rack-C1',
      reservedCpuCores: 0,
      reservedMemoryGB: 0,
      reservedStorageGB: 0,
    },
    {
      id: 'host-6',
      name: 'Physical Host 06 (Rack C2)',
      status: 'Healthy',
      totalCpuCores: 48,
      totalMemoryGB: 192,
      totalStorageGB: 1500,
      usedCpuPercent: 25,
      usedMemoryGB: 32,
      usedStorageGB: 200,
      networkUtilizationPercent: 18,
      assignedVmIds: ['vm-12'],
      healthStatus: 'Healthy',
      rackId: 'Rack-C2',
      reservedCpuCores: 0,
      reservedMemoryGB: 0,
      reservedStorageGB: 0,
    },
  ];
}

export function createDefaultVms(): SimulatedVM[] {
  return [
    {
      id: 'vm-1',
      name: 'vm-prod-web-01',
      vCpu: 8,
      memoryGB: 32,
      storageGB: 150,
      cpuDemandPercent: 65,
      memoryUsageGB: 24,
      networkDemandMbps: 450,
      currentHostId: 'host-1',
      status: 'Running',
      workloadType: 'Web Server',
      migrationEligible: true,
      priority: 'High',
    },
    {
      id: 'vm-2',
      name: 'vm-api-gateway-01',
      vCpu: 8,
      memoryGB: 32,
      storageGB: 200,
      cpuDemandPercent: 55,
      memoryUsageGB: 22,
      networkDemandMbps: 380,
      currentHostId: 'host-1',
      status: 'Running',
      workloadType: 'API Gateway',
      migrationEligible: true,
      priority: 'Medium',
    },
    {
      id: 'vm-3',
      name: 'vm-auth-service-01',
      vCpu: 6,
      memoryGB: 24,
      storageGB: 120,
      cpuDemandPercent: 70,
      memoryUsageGB: 18,
      networkDemandMbps: 290,
      currentHostId: 'host-2',
      status: 'Running',
      workloadType: 'Microservice',
      migrationEligible: true,
      priority: 'High',
    },
    {
      id: 'vm-4',
      name: 'vm-cache-redis-01',
      vCpu: 8,
      memoryGB: 48,
      storageGB: 280,
      cpuDemandPercent: 60,
      memoryUsageGB: 42,
      networkDemandMbps: 520,
      currentHostId: 'host-2',
      status: 'Running',
      workloadType: 'Database',
      migrationEligible: true,
      priority: 'High',
    },
    {
      id: 'vm-5',
      name: 'vm-db-postgres-primary',
      vCpu: 16,
      memoryGB: 64,
      storageGB: 400,
      cpuDemandPercent: 75,
      memoryUsageGB: 58,
      networkDemandMbps: 850,
      currentHostId: 'host-3',
      status: 'Running',
      workloadType: 'Database',
      migrationEligible: true,
      priority: 'High',
    },
    {
      id: 'vm-6',
      name: 'vm-ai-inference-01',
      vCpu: 16,
      memoryGB: 64,
      storageGB: 250,
      cpuDemandPercent: 70,
      memoryUsageGB: 52,
      networkDemandMbps: 620,
      currentHostId: 'host-3',
      status: 'Running',
      workloadType: 'AI Inference',
      migrationEligible: true,
      priority: 'Medium',
    },
    {
      id: 'vm-7',
      name: 'vm-batch-worker-01',
      vCpu: 8,
      memoryGB: 24,
      storageGB: 100,
      cpuDemandPercent: 45,
      memoryUsageGB: 16,
      networkDemandMbps: 180,
      currentHostId: 'host-3',
      status: 'Running',
      workloadType: 'Batch Processing',
      migrationEligible: true,
      priority: 'Low',
    },
    {
      id: 'vm-8',
      name: 'vm-analytics-spark-01',
      vCpu: 16,
      memoryGB: 64,
      storageGB: 350,
      cpuDemandPercent: 55,
      memoryUsageGB: 48,
      networkDemandMbps: 420,
      currentHostId: 'host-4',
      status: 'Running',
      workloadType: 'Batch Processing',
      migrationEligible: true,
      priority: 'Medium',
    },
    {
      id: 'vm-9',
      name: 'vm-search-es-01',
      vCpu: 12,
      memoryGB: 48,
      storageGB: 250,
      cpuDemandPercent: 40,
      memoryUsageGB: 36,
      networkDemandMbps: 310,
      currentHostId: 'host-4',
      status: 'Running',
      workloadType: 'Database',
      migrationEligible: true,
      priority: 'Medium',
    },
    {
      id: 'vm-10',
      name: 'vm-reporting-service',
      vCpu: 8,
      memoryGB: 32,
      storageGB: 180,
      cpuDemandPercent: 45,
      memoryUsageGB: 24,
      networkDemandMbps: 210,
      currentHostId: 'host-5',
      status: 'Running',
      workloadType: 'Microservice',
      migrationEligible: true,
      priority: 'Low',
    },
    {
      id: 'vm-11',
      name: 'vm-event-kafka-01',
      vCpu: 8,
      memoryGB: 32,
      storageGB: 200,
      cpuDemandPercent: 40,
      memoryUsageGB: 26,
      networkDemandMbps: 390,
      currentHostId: 'host-5',
      status: 'Running',
      workloadType: 'Database',
      migrationEligible: true,
      priority: 'High',
    },
    {
      id: 'vm-12',
      name: 'vm-monitoring-grafana',
      vCpu: 6,
      memoryGB: 16,
      storageGB: 120,
      cpuDemandPercent: 35,
      memoryUsageGB: 12,
      networkDemandMbps: 160,
      currentHostId: 'host-6',
      status: 'Running',
      workloadType: 'Web Server',
      migrationEligible: true,
      priority: 'Low',
    },
  ];
}

export function createInitialSimulationState(): SimulationState {
  const hosts = createDefaultHosts();
  const vms = createDefaultVms();

  // Recalculate each host based on assigned VMs
  const updatedHosts = hosts.map((h) => recalculateHostUsage(h, vms, DEFAULT_LB_CONFIG));

  return {
    step: 0,
    isRunning: false,
    simulationSpeedMs: 1500,
    workloadProfile: 'Normal',
    hosts: updatedHosts,
    vms,
    migrations: [],
    activeMigrations: [],
    lbConfig: { ...DEFAULT_LB_CONFIG },
    activityLogs: [
      {
        id: 'init-1',
        step: 0,
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        category: 'system',
        message: 'Cluster environment initialized with 6 physical hosts and 12 virtual machines.',
        details: 'Physical blades active. Load balancing and migration engines operational.',
      },
      {
        id: 'init-2',
        step: 0,
        timestamp: new Date().toLocaleTimeString(),
        level: 'success',
        category: 'system',
        message: 'Load balancer ready. Algorithm: Least Loaded (Weights: 0.5 CPU, 0.4 RAM, 0.1 Storage).',
      },
    ],
    decisionLogs: [],
  };
}

export function recalculateHostUsage(
  host: SimulatedHost,
  vms: SimulatedVM[],
  config: LoadBalancerConfig
): SimulatedHost {
  if (host.status === 'Failed') {
    return {
      ...host,
      status: 'Failed',
      healthStatus: 'Failed',
      usedCpuPercent: 0,
      usedMemoryGB: 0,
      networkUtilizationPercent: 0,
    };
  }

  if (host.status === 'Maintenance') {
    return {
      ...host,
      status: 'Maintenance',
      healthStatus: 'Maintenance',
    };
  }

  // Filter VMs assigned to this host that are currently running or migrating
  const assignedVms = vms.filter(
    (vm) => host.assignedVmIds.includes(vm.id) && vm.currentHostId === host.id
  );

  let totalEffectiveCpuCoresUsed = 0;
  let totalMemoryUsedGB = 0;
  let totalStorageUsedGB = 0;
  let totalNetworkDemandMbps = 0;

  for (const vm of assignedVms) {
    if (vm.status === 'Running' || vm.status === 'Migrating') {
      const vmCoreUsage = vm.vCpu * (vm.cpuDemandPercent / 100);
      totalEffectiveCpuCoresUsed += vmCoreUsage;
      totalMemoryUsedGB += vm.memoryUsageGB;
      totalNetworkDemandMbps += vm.networkDemandMbps;
    }
    // Storage is allocated regardless of VM running status if assigned
    totalStorageUsedGB += vm.storageGB;
  }

  // Factor in any reserved capacity from pending migrations
  totalEffectiveCpuCoresUsed += (host.reservedCpuCores || 0);
  totalMemoryUsedGB += (host.reservedMemoryGB || 0);
  totalStorageUsedGB += (host.reservedStorageGB || 0);

  const calculatedCpuPercent = Math.min(
    100,
    Math.max(0, Math.round((totalEffectiveCpuCoresUsed / host.totalCpuCores) * 100))
  );

  const calculatedMemGB = Math.min(host.totalMemoryGB, Math.max(0, totalMemoryUsedGB));
  const memoryPercent = (calculatedMemGB / host.totalMemoryGB) * 100;

  const calculatedStorageGB = Math.min(host.totalStorageGB, Math.max(0, totalStorageUsedGB));

  // Network utilization estimation based on nominal 10 Gbps host link (10,000 Mbps)
  const networkPercent = Math.min(100, Math.round((totalNetworkDemandMbps / 10000) * 100));

  let newStatus: SimulatedHost['status'] = 'Healthy';

  if (
    calculatedCpuPercent >= config.cpuOverloadThreshold ||
    memoryPercent >= config.memoryOverloadThreshold
  ) {
    newStatus = 'Overloaded';
  } else if (
    calculatedCpuPercent >= config.cpuOverloadThreshold - 10 ||
    memoryPercent >= config.memoryOverloadThreshold - 10
  ) {
    newStatus = 'Warning';
  } else {
    newStatus = 'Healthy';
  }

  return {
    ...host,
    usedCpuPercent: calculatedCpuPercent,
    usedMemoryGB: calculatedMemGB,
    usedStorageGB: calculatedStorageGB,
    networkUtilizationPercent: networkPercent,
    status: newStatus,
    healthStatus: newStatus,
  };
}

export function calculateLoadScore(
  host: SimulatedHost,
  weights: { cpuWeight: number; memoryWeight: number; storageWeight: number }
): number {
  const cpuPercent = host.usedCpuPercent;
  const memPercent = (host.usedMemoryGB / host.totalMemoryGB) * 100;
  const storagePercent = (host.usedStorageGB / host.totalStorageGB) * 100;

  const score =
    weights.cpuWeight * cpuPercent +
    weights.memoryWeight * memPercent +
    weights.storageWeight * storagePercent;

  return Math.round(score * 10) / 10;
}

export function canHostAccommodateVm(
  host: SimulatedHost,
  vm: SimulatedVM,
  config: LoadBalancerConfig,
  checkHeadroom = true
): { canAccommodate: boolean; reason?: string } {
  if (host.status === 'Failed') {
    return { canAccommodate: false, reason: 'Destination host has FAILED and cannot accept workloads.' };
  }

  if (host.status === 'Maintenance') {
    return { canAccommodate: false, reason: 'Destination host is in MAINTENANCE mode.' };
  }

  // Available memory check
  const availableMem = host.totalMemoryGB - host.usedMemoryGB - (host.reservedMemoryGB || 0);
  if (availableMem < vm.memoryUsageGB) {
    return {
      canAccommodate: false,
      reason: `Insufficient RAM: Needs ${vm.memoryUsageGB} GB, available is ${availableMem} GB.`,
    };
  }

  // Available storage check
  const availableStorage = host.totalStorageGB - host.usedStorageGB - (host.reservedStorageGB || 0);
  if (availableStorage < vm.storageGB) {
    return {
      canAccommodate: false,
      reason: `Insufficient Storage: Needs ${vm.storageGB} GB, available is ${availableStorage} GB.`,
    };
  }

  // Check if placement would immediately overload the host
  if (checkHeadroom) {
    const additionalCpuCores = vm.vCpu * (vm.cpuDemandPercent / 100);
    const currentCpuCores = (host.usedCpuPercent / 100) * host.totalCpuCores;
    const projectedCpuPercent = ((currentCpuCores + additionalCpuCores) / host.totalCpuCores) * 100;

    const projectedMemPercent = ((host.usedMemoryGB + vm.memoryUsageGB) / host.totalMemoryGB) * 100;

    // Safety threshold: must not exceed overload threshold minus hysteresis margin
    const maxSafeCpu = config.cpuOverloadThreshold - config.hysteresisMargin;
    const maxSafeMem = config.memoryOverloadThreshold - config.hysteresisMargin;

    if (projectedCpuPercent > maxSafeCpu) {
      return {
        canAccommodate: false,
        reason: `Projected CPU (${Math.round(projectedCpuPercent)}%) would breach safety threshold (${maxSafeCpu}%).`,
      };
    }

    if (projectedMemPercent > maxSafeMem) {
      return {
        canAccommodate: false,
        reason: `Projected RAM (${Math.round(projectedMemPercent)}%) would breach safety threshold (${maxSafeMem}%).`,
      };
    }
  }

  return { canAccommodate: true };
}

export function calculateSystemMetrics(state: SimulationState): SystemMetrics {
  const hosts = state.hosts;
  const vms = state.vms;

  const totalHosts = hosts.length;
  const totalVms = vms.length;

  const healthyHosts = hosts.filter((h) => h.status === 'Healthy').length;
  const overloadedHosts = hosts.filter((h) => h.status === 'Overloaded').length;
  const failedHosts = hosts.filter((h) => h.status === 'Failed').length;
  const warningHosts = hosts.filter((h) => h.status === 'Warning').length;
  const maintenanceHosts = hosts.filter((h) => h.status === 'Maintenance').length;

  const activeHosts = hosts.filter((h) => h.status !== 'Failed');

  const cpuPercentages = activeHosts.map((h) => h.usedCpuPercent);
  const averageCpuPercent =
    cpuPercentages.length > 0
      ? Math.round(cpuPercentages.reduce((a, b) => a + b, 0) / cpuPercentages.length)
      : 0;
  const peakCpuPercent = cpuPercentages.length > 0 ? Math.max(...cpuPercentages) : 0;

  const memPercentages = activeHosts.map((h) => (h.usedMemoryGB / h.totalMemoryGB) * 100);
  const averageMemoryPercent =
    memPercentages.length > 0
      ? Math.round(memPercentages.reduce((a, b) => a + b, 0) / memPercentages.length)
      : 0;
  const peakMemoryPercent = memPercentages.length > 0 ? Math.round(Math.max(...memPercentages)) : 0;

  const successfulMigrations = state.migrations.filter((m) => m.status === 'Completed').length;
  const failedMigrations = state.migrations.filter((m) => m.status === 'Failed').length;
  const totalMigrationAttempts = successfulMigrations + failedMigrations;

  const migrationSuccessRate =
    totalMigrationAttempts > 0
      ? Math.round((successfulMigrations / totalMigrationAttempts) * 1000) / 10
      : 100;

  const completedMigrations = state.migrations.filter((m) => m.status === 'Completed');
  const totalSimulatedMigrationOverheadGB = completedMigrations.reduce(
    (sum, m) => sum + m.simulatedDataTransferredGB,
    0
  );

  const meanMigrationDurationSeconds =
    completedMigrations.length > 0
      ? Math.round(
          (completedMigrations.reduce((sum, m) => sum + m.estimatedDurationSeconds, 0) /
            completedMigrations.length) *
            10
        ) / 10
      : 0;

  const meanEstimatedDowntimeMs =
    completedMigrations.length > 0
      ? Math.round(
          completedMigrations.reduce((sum, m) => sum + m.estimatedDowntimeMs, 0) /
            completedMigrations.length
        )
      : 0;

  // Load variance across healthy & warning hosts
  const evaluationHosts = hosts.filter((h) => h.status === 'Healthy' || h.status === 'Warning');
  let loadVariance = 0;
  if (evaluationHosts.length > 1) {
    const scores = evaluationHosts.map((h) =>
      calculateLoadScore(h, {
        cpuWeight: state.lbConfig.cpuWeight,
        memoryWeight: state.lbConfig.memoryWeight,
        storageWeight: state.lbConfig.storageWeight,
      })
    );
    const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance =
      scores.reduce((sum, s) => sum + Math.pow(s - meanScore, 2), 0) / scores.length;
    loadVariance = Math.round(Math.sqrt(variance) * 10) / 10;
  }

  // Load imbalance index
  const minCpu = cpuPercentages.length > 0 ? Math.min(...cpuPercentages) : 0;
  const loadImbalanceIndex =
    averageCpuPercent > 0
      ? Math.round(((peakCpuPercent - minCpu) / averageCpuPercent) * 100) / 100
      : 0;

  // Estimated availability: % of VMs that are currently Running vs Failed or Recovery Pending
  const runningVms = vms.filter((v) => v.status === 'Running' || v.status === 'Migrating').length;
  const estimatedAvailability =
    totalVms > 0 ? Math.round((runningVms / totalVms) * 1000) / 10 : 100;

  return {
    totalHosts,
    totalVms,
    healthyHosts,
    overloadedHosts,
    failedHosts,
    warningHosts,
    maintenanceHosts,
    averageCpuPercent,
    peakCpuPercent,
    averageMemoryPercent,
    peakMemoryPercent,
    successfulMigrations,
    failedMigrations,
    totalMigrationAttempts,
    migrationSuccessRate,
    estimatedAvailability,
    totalSimulatedMigrationOverheadGB,
    meanMigrationDurationSeconds,
    meanEstimatedDowntimeMs,
    loadVariance,
    loadImbalanceIndex,
  };
}
