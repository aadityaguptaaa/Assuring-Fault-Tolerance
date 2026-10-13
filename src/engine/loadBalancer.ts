import {
  SimulatedHost,
  SimulatedVM,
  LoadBalancerConfig,
  AlgorithmDecisionLog,
} from '../types/simulation';
import { calculateLoadScore, canHostAccommodateVm } from './calculations';

export interface BalancingPlan {
  shouldMigrate: boolean;
  sourceHost?: SimulatedHost;
  targetVm?: SimulatedVM;
  destinationHost?: SimulatedHost;
  reason: string;
  decisionLog: AlgorithmDecisionLog;
}

/**
 * Finds candidate VM to migrate from an overloaded host.
 * Selects an eligible running VM whose migration will effectively relieve overload
 * without being excessively disruptive.
 */
export function selectCandidateVmToMigrate(
  host: SimulatedHost,
  vms: SimulatedVM[],
  currentStep: number,
  cooldownSteps: number
): SimulatedVM | null {
  const eligibleVms = vms.filter(
    (vm) =>
      host.assignedVmIds.includes(vm.id) &&
      vm.currentHostId === host.id &&
      vm.status === 'Running' &&
      vm.migrationEligible &&
      (vm.lastMigratedStep === undefined || currentStep - vm.lastMigratedStep >= cooldownSteps)
  );

  if (eligibleVms.length === 0) return null;

  // Sort by priority (Low priority first, then Medium, then High)
  // then by CPU demand to find a VM that provides significant relief
  const priorityWeight = { Low: 1, Medium: 2, High: 3 };

  eligibleVms.sort((a, b) => {
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    }
    // High CPU usage preferred for relief
    return b.vCpu * (b.cpuDemandPercent / 100) - a.vCpu * (a.cpuDemandPercent / 100);
  });

  return eligibleVms[0];
}

/**
 * First Fit Algorithm
 * Selects the first healthy destination host that satisfies capacity constraints.
 */
export function findDestinationFirstFit(
  candidateVm: SimulatedVM,
  sourceHost: SimulatedHost,
  hosts: SimulatedHost[],
  config: LoadBalancerConfig
): { destination: SimulatedHost | null; evaluations: AlgorithmDecisionLog['evaluationDetails'] } {
  const evaluations: AlgorithmDecisionLog['evaluationDetails'] = [];

  for (const host of hosts) {
    if (host.id === sourceHost.id) continue;

    const weights = {
      cpuWeight: config.cpuWeight,
      memoryWeight: config.memoryWeight,
      storageWeight: config.storageWeight,
    };
    const score = calculateLoadScore(host, weights);

    if (host.status !== 'Healthy' && host.status !== 'Warning') {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: false,
        rejectionReason: `Host is not healthy (Status: ${host.status})`,
      });
      continue;
    }

    const check = canHostAccommodateVm(host, candidateVm, config, true);

    if (check.canAccommodate) {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: true,
      });
      return { destination: host, evaluations };
    } else {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: false,
        rejectionReason: check.reason,
      });
    }
  }

  return { destination: null, evaluations };
}

/**
 * Best Fit Algorithm
 * Evaluates all feasible hosts and chooses the one that minimizes residual slack,
 * packing the VM tightly into the host that fits best without exceeding thresholds.
 */
export function findDestinationBestFit(
  candidateVm: SimulatedVM,
  sourceHost: SimulatedHost,
  hosts: SimulatedHost[],
  config: LoadBalancerConfig
): { destination: SimulatedHost | null; evaluations: AlgorithmDecisionLog['evaluationDetails'] } {
  const evaluations: AlgorithmDecisionLog['evaluationDetails'] = [];
  let bestHost: SimulatedHost | null = null;
  let minResidualSlack = Number.MAX_VALUE;

  for (const host of hosts) {
    if (host.id === sourceHost.id) continue;

    const weights = {
      cpuWeight: config.cpuWeight,
      memoryWeight: config.memoryWeight,
      storageWeight: config.storageWeight,
    };
    const score = calculateLoadScore(host, weights);

    if (host.status !== 'Healthy' && host.status !== 'Warning') {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: false,
        rejectionReason: `Host is not healthy (Status: ${host.status})`,
      });
      continue;
    }

    const check = canHostAccommodateVm(host, candidateVm, config, true);

    if (check.canAccommodate) {
      // Residual slack: remaining unused normalized capacity after VM placement
      const currentCpuUsed = (host.usedCpuPercent / 100) * host.totalCpuCores;
      const additionalCpu = candidateVm.vCpu * (candidateVm.cpuDemandPercent / 100);
      const remainingCpuCores = host.totalCpuCores - (currentCpuUsed + additionalCpu);
      const remainingRamGB = host.totalMemoryGB - (host.usedMemoryGB + candidateVm.memoryUsageGB);

      // Normalized residual slack (smaller = tighter best fit)
      const residualSlack =
        (remainingCpuCores / host.totalCpuCores) * 0.5 +
        (remainingRamGB / host.totalMemoryGB) * 0.5;

      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: true,
      });

      if (residualSlack < minResidualSlack) {
        minResidualSlack = residualSlack;
        bestHost = host;
      }
    } else {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: false,
        rejectionReason: check.reason,
      });
    }
  }

  return { destination: bestHost, evaluations };
}

/**
 * Least Loaded Algorithm
 * Chooses the feasible healthy host with the lowest normalized load score:
 * Load Score = 0.5 * CPU + 0.4 * RAM + 0.1 * Storage
 */
export function findDestinationLeastLoaded(
  candidateVm: SimulatedVM,
  sourceHost: SimulatedHost,
  hosts: SimulatedHost[],
  config: LoadBalancerConfig
): { destination: SimulatedHost | null; evaluations: AlgorithmDecisionLog['evaluationDetails'] } {
  const evaluations: AlgorithmDecisionLog['evaluationDetails'] = [];
  let leastLoadedHost: SimulatedHost | null = null;
  let lowestLoadScore = Number.MAX_VALUE;

  for (const host of hosts) {
    if (host.id === sourceHost.id) continue;

    const weights = {
      cpuWeight: config.cpuWeight,
      memoryWeight: config.memoryWeight,
      storageWeight: config.storageWeight,
    };
    const score = calculateLoadScore(host, weights);

    if (host.status !== 'Healthy' && host.status !== 'Warning') {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: false,
        rejectionReason: `Host is not healthy (Status: ${host.status})`,
      });
      continue;
    }

    const check = canHostAccommodateVm(host, candidateVm, config, true);

    if (check.canAccommodate) {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: true,
      });

      if (score < lowestLoadScore) {
        lowestLoadScore = score;
        leastLoadedHost = host;
      }
    } else {
      evaluations.push({
        hostId: host.id,
        hostName: host.name,
        loadScore: score,
        cpuUtil: host.usedCpuPercent,
        memUtil: (host.usedMemoryGB / host.totalMemoryGB) * 100,
        capacityFeasible: false,
        rejectionReason: check.reason,
      });
    }
  }

  return { destination: leastLoadedHost, evaluations };
}

/**
 * Evaluates the entire cluster and produces a balancing plan
 */
export function evaluateLoadBalancing(
  hosts: SimulatedHost[],
  vms: SimulatedVM[],
  config: LoadBalancerConfig,
  currentStep: number
): BalancingPlan {
  // Check for overloaded hosts
  const overloadedHosts = hosts.filter((h) => {
    if (h.status === 'Failed' || h.status === 'Maintenance') return false;
    if (h.cooldownUntilStep && h.cooldownUntilStep > currentStep) return false;

    const memPercent = (h.usedMemoryGB / h.totalMemoryGB) * 100;
    return (
      h.usedCpuPercent >= config.cpuOverloadThreshold ||
      memPercent >= config.memoryOverloadThreshold
    );
  });

  if (overloadedHosts.length === 0) {
    const log: AlgorithmDecisionLog = {
      id: `lb-dec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      step: currentStep,
      algorithm: config.algorithm,
      triggerReason: 'Cluster evaluation: No host currently exceeds overload thresholds.',
      evaluationDetails: [],
      finalOutcome: 'NoActionNeeded',
      summary: 'All physical hosts are within normal operational thresholds. No migration required.',
    };
    return { shouldMigrate: false, reason: 'All hosts operating within thresholds.', decisionLog: log };
  }

  // Pick the most severely overloaded host
  overloadedHosts.sort((a, b) => {
    const aSeverity = Math.max(a.usedCpuPercent - config.cpuOverloadThreshold, (a.usedMemoryGB / a.totalMemoryGB) * 100 - config.memoryOverloadThreshold);
    const bSeverity = Math.max(b.usedCpuPercent - config.cpuOverloadThreshold, (b.usedMemoryGB / b.totalMemoryGB) * 100 - config.memoryOverloadThreshold);
    return bSeverity - aSeverity;
  });

  const sourceHost = overloadedHosts[0];
  const candidateVm = selectCandidateVmToMigrate(sourceHost, vms, currentStep, config.cooldownSteps);

  if (!candidateVm) {
    const log: AlgorithmDecisionLog = {
      id: `lb-dec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      step: currentStep,
      algorithm: config.algorithm,
      triggerReason: `Host ${sourceHost.name} overloaded (CPU: ${sourceHost.usedCpuPercent}%), but no eligible VMs found.`,
      sourceHostId: sourceHost.id,
      evaluationDetails: [],
      finalOutcome: 'Rejected',
      summary: `Overloaded host ${sourceHost.name} has no migration-eligible VMs or all are in cooldown.`,
    };
    return {
      shouldMigrate: false,
      sourceHost,
      reason: `Host ${sourceHost.name} is overloaded, but no eligible VMs could be selected for migration.`,
      decisionLog: log,
    };
  }

  // Select destination based on algorithm
  let destinationResult: {
    destination: SimulatedHost | null;
    evaluations: AlgorithmDecisionLog['evaluationDetails'];
  };

  switch (config.algorithm) {
    case 'FirstFit':
      destinationResult = findDestinationFirstFit(candidateVm, sourceHost, hosts, config);
      break;
    case 'BestFit':
      destinationResult = findDestinationBestFit(candidateVm, sourceHost, hosts, config);
      break;
    case 'LeastLoaded':
    default:
      destinationResult = findDestinationLeastLoaded(candidateVm, sourceHost, hosts, config);
      break;
  }

  if (!destinationResult.destination) {
    const log: AlgorithmDecisionLog = {
      id: `lb-dec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      step: currentStep,
      algorithm: config.algorithm,
      triggerReason: `Host ${sourceHost.name} overloaded. Attempted migration for ${candidateVm.name}.`,
      candidateVmId: candidateVm.id,
      candidateVmName: candidateVm.name,
      sourceHostId: sourceHost.id,
      evaluationDetails: destinationResult.evaluations,
      finalOutcome: 'Rejected',
      summary: `No healthy destination host has sufficient capacity without violating overload thresholds.`,
    };
    return {
      shouldMigrate: false,
      sourceHost,
      targetVm: candidateVm,
      reason: `Overloaded host ${sourceHost.name} cannot migrate ${candidateVm.name}: No available host has sufficient capacity.`,
      decisionLog: log,
    };
  }

  const destinationHost = destinationResult.destination;
  const log: AlgorithmDecisionLog = {
    id: `lb-dec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    step: currentStep,
    algorithm: config.algorithm,
    triggerReason: `Host ${sourceHost.name} overloaded (CPU: ${sourceHost.usedCpuPercent}%). Selected ${candidateVm.name} to migrate.`,
    candidateVmId: candidateVm.id,
    candidateVmName: candidateVm.name,
    sourceHostId: sourceHost.id,
    selectedDestinationId: destinationHost.id,
    evaluationDetails: destinationResult.evaluations,
    finalOutcome: 'Migrated',
    summary: `Selected ${destinationHost.name} using ${config.algorithm} algorithm for migration of ${candidateVm.name}.`,
  };

  return {
    shouldMigrate: true,
    sourceHost,
    targetVm: candidateVm,
    destinationHost,
    reason: `Initiating migration of ${candidateVm.name} from ${sourceHost.name} to ${destinationHost.name} via ${config.algorithm}.`,
    decisionLog: log,
  };
}
