import React, { useState, useEffect, useRef } from 'react';
import {
  SimulationState,
  SimulatedHost,
  SimulatedVM,
  WorkloadProfile,
  MigrationStrategy,
  LoadBalancerConfig,
} from './types/simulation';
import {
  createInitialSimulationState,
  calculateSystemMetrics,
  recalculateHostUsage,
} from './engine/calculations';
import {
  runSimulationTick,
  applyWorkloadStep,
} from './engine/experimentsEngine';
import { evaluateLoadBalancing } from './engine/loadBalancer';
import { startMigration } from './engine/migrationEngine';
import { simulateHostFailure, restoreHost } from './engine/faultTolerance';

import { SimulationNotice } from './components/SimulationNotice';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';

import { OverviewView } from './components/views/OverviewView';
import { InfrastructureView } from './components/views/InfrastructureView';
import { VmManagementView } from './components/views/VmManagementView';
import { MigrationView } from './components/views/MigrationView';
import { LoadBalancerView } from './components/views/LoadBalancerView';
import { FaultToleranceView } from './components/views/FaultToleranceView';
import { ExperimentsView } from './components/views/ExperimentsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { CostAnalysisView } from './components/views/CostAnalysisView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { DocumentationView } from './components/views/DocumentationView';

export const App: React.FC = () => {
  const [state, setState] = useState<SimulationState>(() => createInitialSimulationState());
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Keep state ref updated for interval execution
  const stateRef = useRef(state);
  stateRef.current = state;

  // Real-time interval timer for continuous simulation
  useEffect(() => {
    if (!state.isRunning) return;

    const intervalId = setInterval(() => {
      setState((prevState) => {
        // 1. Advance synthetic workload demand based on current profile
        const workloadAdvanced = applyWorkloadStep(
          prevState,
          prevState.workloadProfile,
          prevState.step
        );

        // 2. Advance migrations and evaluate load balancing
        return runSimulationTick(workloadAdvanced, prevState.lbConfig.autoBalanceEnabled);
      });
    }, state.simulationSpeedMs);

    return () => clearInterval(intervalId);
  }, [state.isRunning, state.simulationSpeedMs]);

  // Derived system metrics
  const metrics = calculateSystemMetrics(state);

  // Handlers for Navbar Simulation Controls
  const handleTogglePlay = () => {
    setState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const handleStepForward = () => {
    setState((prev) => {
      const advanced = applyWorkloadStep(prev, prev.workloadProfile, prev.step);
      return runSimulationTick(advanced, prev.lbConfig.autoBalanceEnabled);
    });
  };

  const handleResetConfirm = () => {
    setState(createInitialSimulationState());
    setIsResetConfirmOpen(false);
  };

  const handleChangeProfile = (profile: WorkloadProfile) => {
    setState((prev) => ({ ...prev, workloadProfile: profile }));
  };

  const handleAdjustWorkload = (deltaPercent: number) => {
    setState((prev) => {
      const updatedVms = prev.vms.map((vm) => {
        if (vm.status !== 'Running') return vm;
        const newDemand = Math.min(98, Math.max(10, vm.cpuDemandPercent + deltaPercent));
        return { ...vm, cpuDemandPercent: newDemand };
      });
      const updatedHosts = prev.hosts.map((h) => recalculateHostUsage(h, updatedVms, prev.lbConfig));
      return { ...prev, vms: updatedVms, hosts: updatedHosts };
    });
  };

  const handleSpikeWorkload = () => {
    setState((prev) => {
      const updatedVms = prev.vms.map((vm, idx) => {
        if (idx % 2 === 0 && vm.status === 'Running') {
          return { ...vm, cpuDemandPercent: Math.min(95, vm.cpuDemandPercent + 30) };
        }
        return vm;
      });
      const updatedHosts = prev.hosts.map((h) => recalculateHostUsage(h, updatedVms, prev.lbConfig));
      return {
        ...prev,
        vms: updatedVms,
        hosts: updatedHosts,
        activityLogs: [
          {
            id: `evt-spike-${Date.now()}`,
            step: prev.step,
            timestamp: new Date().toLocaleTimeString(),
            level: 'warn',
            category: 'workload',
            message: 'Random tenant workload spike injected across cluster virtual machines.',
          },
          ...prev.activityLogs,
        ],
      };
    });
  };

  const handleTriggerBalance = () => {
    setState((prev) => {
      const plan = evaluateLoadBalancing(prev.hosts, prev.vms, prev.lbConfig, prev.step);
      if (plan.shouldMigrate && plan.targetVm && plan.destinationHost) {
        const migResult = startMigration(
          prev,
          plan.targetVm.id,
          plan.destinationHost.id,
          'Live',
          plan.reason
        );
        return {
          ...migResult.newState,
          decisionLogs: [plan.decisionLog, ...prev.decisionLogs],
        };
      }
      return {
        ...prev,
        decisionLogs: [plan.decisionLog, ...prev.decisionLogs],
      };
    });
  };

  // Infrastructure Actions
  const handleOverloadHost = (hostId: string) => {
    setState((prev) => {
      const updatedVms = prev.vms.map((vm) => {
        if (vm.currentHostId === hostId) {
          return { ...vm, cpuDemandPercent: 95, memoryUsageGB: vm.memoryGB * 0.9 };
        }
        return vm;
      });
      const updatedHosts = prev.hosts.map((h) => recalculateHostUsage(h, updatedVms, prev.lbConfig));
      return { ...prev, vms: updatedVms, hosts: updatedHosts };
    });
  };

  const handleFailHost = (hostId: string) => {
    setState((prev) => {
      const { newState } = simulateHostFailure(prev, hostId);
      return newState;
    });
  };

  const handleRestoreHostAction = (hostId: string) => {
    setState((prev) => {
      const { newState } = restoreHost(prev, hostId);
      return newState;
    });
  };

  const handleToggleMaintenance = (hostId: string) => {
    setState((prev) => {
      const updatedHosts = prev.hosts.map((h) => {
        if (h.id === hostId) {
          const nextStatus = h.status === 'Maintenance' ? 'Healthy' : 'Maintenance';
          return recalculateHostUsage({ ...h, status: nextStatus }, prev.vms, prev.lbConfig);
        }
        return h;
      });
      return { ...prev, hosts: updatedHosts };
    });
  };

  const handleAdjustHostWorkload = (hostId: string, deltaPercent: number) => {
    setState((prev) => {
      const updatedVms = prev.vms.map((vm) => {
        if (vm.currentHostId === hostId && vm.status === 'Running') {
          return {
            ...vm,
            cpuDemandPercent: Math.min(95, Math.max(10, vm.cpuDemandPercent + deltaPercent)),
          };
        }
        return vm;
      });
      const updatedHosts = prev.hosts.map((h) => recalculateHostUsage(h, updatedVms, prev.lbConfig));
      return { ...prev, vms: updatedVms, hosts: updatedHosts };
    });
  };

  const handleAddHost = (
    hostData: Omit<
      SimulatedHost,
      | 'id'
      | 'assignedVmIds'
      | 'usedCpuPercent'
      | 'usedMemoryGB'
      | 'usedStorageGB'
      | 'networkUtilizationPercent'
      | 'healthStatus'
    >
  ) => {
    const newId = `host-${state.hosts.length + 1}`;
    const newHost: SimulatedHost = {
      ...hostData,
      id: newId,
      assignedVmIds: [],
      usedCpuPercent: 0,
      usedMemoryGB: 0,
      usedStorageGB: 0,
      networkUtilizationPercent: 0,
      healthStatus: 'Healthy',
      reservedCpuCores: 0,
      reservedMemoryGB: 0,
      reservedStorageGB: 0,
    };
    setState((prev) => ({
      ...prev,
      hosts: [...prev.hosts, newHost],
    }));
  };

  const handleRemoveHost = (hostId: string) => {
    setState((prev) => ({
      ...prev,
      hosts: prev.hosts.filter((h) => h.id !== hostId),
      vms: prev.vms.map((v) => (v.currentHostId === hostId ? { ...v, currentHostId: null, status: 'Recovery Pending' as const } : v)),
    }));
  };

  // VM Management Actions
  const handleToggleVmState = (vmId: string) => {
    setState((prev) => {
      const updatedVms = prev.vms.map((v) => {
        if (v.id === vmId) {
          const nextStatus = v.status === 'Running' ? ('Stopped' as const) : ('Running' as const);
          return { ...v, status: nextStatus };
        }
        return v;
      });
      const updatedHosts = prev.hosts.map((h) => recalculateHostUsage(h, updatedVms, prev.lbConfig));
      return { ...prev, vms: updatedVms, hosts: updatedHosts };
    });
  };

  const handleDeleteVm = (vmId: string) => {
    setState((prev) => {
      const target = prev.vms.find((v) => v.id === vmId);
      const remainingVms = prev.vms.filter((v) => v.id !== vmId);
      const updatedHosts = prev.hosts.map((h) => {
        if (target && h.assignedVmIds.includes(vmId)) {
          return recalculateHostUsage(
            { ...h, assignedVmIds: h.assignedVmIds.filter((id) => id !== vmId) },
            remainingVms,
            prev.lbConfig
          );
        }
        return h;
      });
      return { ...prev, vms: remainingVms, hosts: updatedHosts };
    });
  };

  const handleCreateVm = (newVm: Omit<SimulatedVM, 'id'>) => {
    const newId = `vm-${Date.now().toString(36)}`;
    const vmWithId: SimulatedVM = { ...newVm, id: newId };
    setState((prev) => {
      const updatedVms = [...prev.vms, vmWithId];
      const updatedHosts = prev.hosts.map((h) => {
        if (h.id === newVm.currentHostId) {
          return recalculateHostUsage(
            { ...h, assignedVmIds: [...h.assignedVmIds, newId] },
            updatedVms,
            prev.lbConfig
          );
        }
        return h;
      });
      return { ...prev, vms: updatedVms, hosts: updatedHosts };
    });
  };

  const handleUpdateVm = (vmId: string, updates: Partial<SimulatedVM>) => {
    setState((prev) => {
      const updatedVms = prev.vms.map((v) => (v.id === vmId ? { ...v, ...updates } : v));
      const updatedHosts = prev.hosts.map((h) => recalculateHostUsage(h, updatedVms, prev.lbConfig));
      return { ...prev, vms: updatedVms, hosts: updatedHosts };
    });
  };

  const handleInitiateManualMigration = (
    vmId: string,
    destinationHostId: string,
    strategy: MigrationStrategy
  ) => {
    setState((prev) => {
      const res = startMigration(
        prev,
        vmId,
        destinationHostId,
        strategy,
        `Manual migration initiated by user to ${destinationHostId}`
      );
      return res.newState;
    });
  };

  const handleUpdateLbConfig = (newConfig: Partial<LoadBalancerConfig>) => {
    setState((prev) => ({
      ...prev,
      lbConfig: { ...prev.lbConfig, ...newConfig },
    }));
  };

  return (
    <div className="min-h-screen bg-[#070d18] text-slate-100 flex flex-col font-sans">
      {/* Persistent Simulation Notice Banner */}
      <SimulationNotice />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          overloadedCount={metrics.overloadedHosts}
          failedCount={metrics.failedHosts}
          activeMigrationCount={state.activeMigrations.length}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#070d18]">
          {/* Top Navbar */}
          <Navbar
            step={state.step}
            isRunning={state.isRunning}
            onTogglePlay={handleTogglePlay}
            onStepForward={handleStepForward}
            onReset={() => setIsResetConfirmOpen(true)}
            onTriggerBalance={handleTriggerBalance}
            workloadProfile={state.workloadProfile}
            onChangeProfile={handleChangeProfile}
            onAdjustWorkload={handleAdjustWorkload}
            onSpikeWorkload={handleSpikeWorkload}
          />

          {/* View Container */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              {currentTab === 'overview' && (
                <OverviewView
                  state={state}
                  metrics={metrics}
                  onNavigateToTab={setCurrentTab}
                />
              )}

              {currentTab === 'infrastructure' && (
                <InfrastructureView
                  hosts={state.hosts}
                  vms={state.vms}
                  onOverloadHost={handleOverloadHost}
                  onFailHost={handleFailHost}
                  onRestoreHost={handleRestoreHostAction}
                  onToggleMaintenance={handleToggleMaintenance}
                  onAdjustHostWorkload={handleAdjustHostWorkload}
                  onAddHost={handleAddHost}
                  onRemoveHost={handleRemoveHost}
                  onNavigateToVm={(vmId) => setCurrentTab('vms')}
                />
              )}

              {currentTab === 'vms' && (
                <VmManagementView
                  vms={state.vms}
                  hosts={state.hosts}
                  onToggleVmState={handleToggleVmState}
                  onDeleteVm={handleDeleteVm}
                  onCreateVm={handleCreateVm}
                  onUpdateVm={handleUpdateVm}
                  onInitiateMigration={handleInitiateManualMigration}
                />
              )}

              {currentTab === 'migration' && (
                <MigrationView
                  activeMigrations={state.activeMigrations}
                  allMigrations={state.migrations}
                />
              )}

              {currentTab === 'load-balancer' && (
                <LoadBalancerView
                  config={state.lbConfig}
                  hosts={state.hosts}
                  vms={state.vms}
                  decisionLogs={state.decisionLogs}
                  onUpdateConfig={handleUpdateLbConfig}
                  onTriggerEvaluation={handleTriggerBalance}
                />
              )}

              {currentTab === 'fault-tolerance' && (
                <FaultToleranceView
                  hosts={state.hosts}
                  vms={state.vms}
                  onFailHost={handleFailHost}
                  onRestoreHost={handleRestoreHostAction}
                />
              )}

              {currentTab === 'experiments' && <ExperimentsView />}

              {currentTab === 'analytics' && (
                <AnalyticsView metrics={metrics} state={state} />
              )}

              {currentTab === 'cost' && (
                <CostAnalysisView hosts={state.hosts} simulatedStep={state.step} />
              )}

              {currentTab === 'architecture' && <ArchitectureView />}

              {currentTab === 'documentation' && <DocumentationView />}
            </div>
          </main>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Reset Cluster Topology?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will reset the physical cluster to the baseline 6 physical hosts and 12 virtual machines. All current migration logs and decisions will be cleared.
            </p>
            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
