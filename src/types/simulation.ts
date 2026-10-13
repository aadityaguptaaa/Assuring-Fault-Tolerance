export type HostStatus = 'Healthy' | 'Overloaded' | 'Failed' | 'Warning' | 'Maintenance' | 'Standby';

export type VmStatus =
  | 'Running'
  | 'Migrating'
  | 'Failed'
  | 'Paused'
  | 'Stopped'
  | 'Recovery Pending';

export type WorkloadType =
  | 'Web Server'
  | 'API Gateway'
  | 'Microservice'
  | 'Database'
  | 'AI Inference'
  | 'Batch Processing';

export type VmPriority = 'Low' | 'Medium' | 'High';

export type MigrationStrategy = 'Live' | 'Cold' | 'Emergency';

export type MigrationStatus = 'Pending' | 'In Progress' | 'In-Progress' | 'Completed' | 'Failed';

export type LoadBalancingAlgorithm = 'FirstFit' | 'BestFit' | 'LeastLoaded';

export type WorkloadProfile = 'Low' | 'Normal' | 'High' | 'Spike' | 'Uneven';

export interface SimulatedVM {
  id: string;
  name: string;
  vCpu: number;
  memoryGB: number;
  storageGB: number;
  cpuDemandPercent: number;
  memoryUsageGB: number;
  networkDemandMbps: number;
  currentHostId: string | null;
  status: VmStatus;
  workloadType: WorkloadType;
  migrationEligible: boolean;
  priority: VmPriority;
  lastMigratedStep?: number;
}

export interface SimulatedHost {
  id: string;
  name: string;
  status: HostStatus;
  healthStatus?: HostStatus;
  totalCpuCores: number;
  totalMemoryGB: number;
  totalStorageGB: number;
  usedCpuPercent: number;
  usedMemoryGB: number;
  usedStorageGB: number;
  networkUtilizationPercent: number;
  assignedVmIds: string[];
  rackId: string;
  reservedCpuCores?: number;
  reservedMemoryGB?: number;
  reservedStorageGB?: number;
  loadScore?: number;
  cooldownUntilStep?: number;
}

export interface LoadBalancerConfig {
  algorithm: LoadBalancingAlgorithm;
  cpuOverloadThreshold: number;
  memoryOverloadThreshold: number;
  underloadThreshold: number;
  cpuWeight: number;
  memoryWeight: number;
  storageWeight: number;
  cooldownSteps: number;
  hysteresisMargin: number;
  autoBalanceEnabled: boolean;
}

export interface MigrationRecord {
  migrationId: string;
  vmId: string;
  vmName: string;
  sourceHostId: string;
  sourceHostName: string;
  destinationHostId: string;
  destinationHostName: string;
  strategy: MigrationStrategy;
  status: MigrationStatus;
  progressPercent: number;
  startTime: number;
  estimatedDurationSeconds: number;
  simulatedDataTransferredGB: number;
  estimatedDowntimeMs: number;
  reason: string;
  loadBeforeMigration?: {
    sourceCpu: number;
    destCpu: number;
  };
  loadAfterMigration?: {
    sourceCpu: number;
    destCpu: number;
  };
  completionTime?: number;
  failureReason?: string;
}

export interface ActivityEvent {
  id: string;
  step: number;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'warn' | 'error';
  category: 'system' | 'load-balancer' | 'migration' | 'fault-tolerance' | 'workload';
  message: string;
  details?: string;
}

export interface AlgorithmDecisionLog {
  id: string;
  step: number;
  algorithm: LoadBalancingAlgorithm;
  triggerReason: string;
  candidateVmId?: string;
  candidateVmName?: string;
  sourceHostId?: string;
  selectedDestinationId?: string;
  evaluationDetails: Array<{
    hostId: string;
    hostName: string;
    score?: number;
    loadScore?: number;
    cpuUtil?: number;
    memUtil?: number;
    capacityFeasible?: boolean;
    canAccommodate?: boolean;
    reason?: string;
    rejectionReason?: string;
  }>;
  finalOutcome: 'Migrated' | 'Rejected' | 'No-Action' | 'NoActionNeeded';
  summary: string;
}

export interface FaultRecoveryResult {
  failedHostId: string;
  failedHostName: string;
  totalVmsAffected: number;
  vmsRecovered: string[];
  vmsUnrecovered: string[];
  recoveryDurationSteps: number;
  successRate: number;
  details: string[];
}

export interface SystemMetrics {
  totalHosts: number;
  totalVms: number;
  healthyHosts: number;
  overloadedHosts: number;
  failedHosts: number;
  warningHosts: number;
  maintenanceHosts: number;
  averageCpuPercent: number;
  peakCpuPercent: number;
  averageMemoryPercent: number;
  peakMemoryPercent: number;
  successfulMigrations: number;
  failedMigrations: number;
  totalMigrationAttempts: number;
  migrationSuccessRate: number;
  estimatedAvailability: number;
  totalSimulatedMigrationOverheadGB: number;
  meanMigrationDurationSeconds: number;
  meanEstimatedDowntimeMs: number;
  loadVariance: number;
  loadImbalanceIndex: number;
}

export interface ExperimentResult {
  id: string;
  experimentName: string;
  timestamp: string;
  algorithm: LoadBalancingAlgorithm;
  initialWorkload: WorkloadProfile;
  stepsSimulated: number;
  migrationsTriggered: number;
  migrationsSuccessful: number;
  overloadIncidents: number;
  averageCpuUtilization: number;
  peakCpuUtilization: number;
  loadVariance: number;
  totalDowntimeMs: number;
  availabilityPercent: number;
  notes: string;
}

export interface SimulationState {
  step: number;
  isRunning: boolean;
  simulationSpeedMs: number;
  workloadProfile: WorkloadProfile;
  hosts: SimulatedHost[];
  vms: SimulatedVM[];
  migrations: MigrationRecord[];
  activeMigrations: MigrationRecord[];
  lbConfig: LoadBalancerConfig;
  activityLogs: ActivityEvent[];
  decisionLogs: AlgorithmDecisionLog[];
}

export interface CostModelConfig {
  hostHourlyRate: number;
  storageHourlyRateGB: number;
  idlePowerSavingPercent: number;
}
