import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Play,
  Square,
  ArrowLeftRight,
  Trash2,
  Edit2,
  Server,
  Activity,
  HardDrive,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
} from 'lucide-react';
import {
  SimulatedVM,
  SimulatedHost,
  WorkloadType,
  VmStatus,
  MigrationStrategy,
} from '../../types/simulation';
import { canHostAccommodateVm } from '../../engine/calculations';

interface VmManagementViewProps {
  vms: SimulatedVM[];
  hosts: SimulatedHost[];
  onToggleVmState: (vmId: string) => void;
  onDeleteVm: (vmId: string) => void;
  onCreateVm: (vm: Omit<SimulatedVM, 'id'>) => void;
  onUpdateVm: (vmId: string, updates: Partial<SimulatedVM>) => void;
  onInitiateMigration: (vmId: string, destinationHostId: string, strategy: MigrationStrategy) => void;
}

export const VmManagementView: React.FC<VmManagementViewProps> = ({
  vms,
  hosts,
  onToggleVmState,
  onDeleteVm,
  onCreateVm,
  onUpdateVm,
  onInitiateMigration,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMigrateModalOpen, setIsMigrateModalOpen] = useState(false);
  const [selectedVmForMigration, setSelectedVmForMigration] = useState<SimulatedVM | null>(null);
  const [targetHostId, setTargetHostId] = useState<string>('');
  const [migrationStrategy, setMigrationStrategy] = useState<MigrationStrategy>('Live');

  // Form states for Create VM
  const [name, setName] = useState('');
  const [vCpu, setVCpu] = useState(8);
  const [memoryGB, setMemoryGB] = useState(32);
  const [storageGB, setStorageGB] = useState(150);
  const [cpuDemandPercent, setCpuDemandPercent] = useState(60);
  const [workloadType, setWorkloadType] = useState<WorkloadType>('Web Server');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [initialHostId, setInitialHostId] = useState<string>('');

  // Filter logic
  const filteredVms = vms.filter((vm) => {
    if (filterType !== 'ALL' && vm.workloadType !== filterType) return false;
    if (filterStatus !== 'ALL' && vm.status !== filterStatus) return false;
    return true;
  });

  const handleOpenMigration = (vm: SimulatedVM) => {
    setSelectedVmForMigration(vm);
    const availableHealthyHosts = hosts.filter(
      (h) => h.id !== vm.currentHostId && h.status !== 'Failed' && h.status !== 'Maintenance'
    );
    setTargetHostId(availableHealthyHosts[0]?.id || '');
    setIsMigrateModalOpen(true);
  };

  const handleExecuteMigration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVmForMigration || !targetHostId) return;
    onInitiateMigration(selectedVmForMigration.id, targetHostId, migrationStrategy);
    setIsMigrateModalOpen(false);
    setSelectedVmForMigration(null);
  };

  const handleCreateVmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateVm({
      name: name.trim(),
      vCpu: Number(vCpu),
      memoryGB: Number(memoryGB),
      storageGB: Number(storageGB),
      cpuDemandPercent: Number(cpuDemandPercent),
      memoryUsageGB: Math.round(Number(memoryGB) * 0.75),
      networkDemandMbps: Number(vCpu) * 50,
      currentHostId: initialHostId || hosts[0]?.id || null,
      status: 'Running',
      workloadType,
      migrationEligible: true,
      priority,
    });

    setName('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Virtual Machine Directory
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {vms.length} Instances Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure instance sizes, monitor tenant demand profiles, toggle states, or trigger manual live migrations with validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Workload Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Workload Types</option>
            <option value="Web Server">Web Server</option>
            <option value="Database">Database</option>
            <option value="Batch Processing">Batch Processing</option>
            <option value="AI Inference">AI Inference</option>
            <option value="API Gateway">API Gateway</option>
            <option value="Microservice">Microservice</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none"
          >
            <option value="ALL">All States</option>
            <option value="Running">Running</option>
            <option value="Migrating">Migrating</option>
            <option value="Stopped">Stopped</option>
            <option value="Recovery Pending">Recovery Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Create VM Button */}
          <button
            onClick={() => {
              setName(`vm-${Math.random().toString(36).substring(2, 6)}`);
              setInitialHostId(hosts.find((h) => h.status === 'Healthy')?.id || '');
              setIsCreateModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Launch VM</span>
          </button>
        </div>
      </div>

      {/* VM Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Instance Name</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Workload Type</th>
                <th className="px-3 py-3">Current Physical Host</th>
                <th className="px-3 py-3">vCPU / Demand</th>
                <th className="px-3 py-3">RAM Allocation</th>
                <th className="px-3 py-3">Storage</th>
                <th className="px-3 py-3">Priority</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredVms.map((vm) => {
                const currentHost = hosts.find((h) => h.id === vm.currentHostId);
                const isRunning = vm.status === 'Running';
                const isMigrating = vm.status === 'Migrating';

                return (
                  <tr key={vm.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="text-white font-mono font-semibold">{vm.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {vm.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      {vm.status === 'Running' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          Running
                        </span>
                      ) : vm.status === 'Migrating' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 inline-flex items-center gap-1 animate-pulse">
                          <ArrowLeftRight className="w-3 h-3 text-cyan-400" />
                          Migrating
                        </span>
                      ) : vm.status === 'Recovery Pending' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                          Pending Placement
                        </span>
                      ) : vm.status === 'Stopped' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          Stopped
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800">
                          Failed
                        </span>
                      )}
                    </td>

                    {/* Workload */}
                    <td className="px-3 py-3 text-slate-300">{vm.workloadType}</td>

                    {/* Current Host */}
                    <td className="px-3 py-3">
                      {currentHost ? (
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Server className="w-3.5 h-3.5 text-slate-400" />
                          <span>{currentHost.name.replace('Physical Host ', 'Host ')}</span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              currentHost.status === 'Failed'
                                ? 'bg-red-500'
                                : currentHost.status === 'Overloaded'
                                ? 'bg-rose-500'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned (Host Offline)</span>
                      )}
                    </td>

                    {/* vCPU & Demand */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-200 font-semibold">{vm.vCpu} vCPUs</span>
                        <span
                          className={`font-mono text-[11px] ${
                            vm.cpuDemandPercent >= 75 ? 'text-amber-400 font-bold' : 'text-slate-400'
                          }`}
                        >
                          ({vm.cpuDemandPercent}%)
                        </span>
                      </div>
                    </td>

                    {/* RAM */}
                    <td className="px-3 py-3 font-mono text-slate-300">
                      {vm.memoryUsageGB} / {vm.memoryGB} GB
                    </td>

                    {/* Storage */}
                    <td className="px-3 py-3 font-mono text-slate-400">{vm.storageGB} GB</td>

                    {/* Priority */}
                    <td className="px-3 py-3">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                          vm.priority === 'High'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                            : vm.priority === 'Medium'
                            ? 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {vm.priority}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Start/Stop */}
                        <button
                          onClick={() => onToggleVmState(vm.id)}
                          disabled={isMigrating || vm.status === 'Failed'}
                          className={`p-1 rounded hover:bg-slate-800 transition-colors disabled:opacity-40 ${
                            isRunning ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                          title={isRunning ? 'Stop instance' : 'Start instance'}
                        >
                          {isRunning ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>

                        {/* Manual Migrate */}
                        <button
                          onClick={() => handleOpenMigration(vm)}
                          disabled={isMigrating || !vm.migrationEligible || !currentHost || currentHost.status === 'Failed'}
                          className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-[11px] font-semibold flex items-center gap-1 disabled:opacity-40 transition-colors"
                          title="Initiate live or cold migration to destination host"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-cyan-400" />
                          <span>Migrate</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => onDeleteVm(vm.id)}
                          disabled={isMigrating}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
                          title="Terminate virtual machine"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Migration Dialog with Live Capacity Validation */}
      {isMigrateModalOpen && selectedVmForMigration && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleExecuteMigration}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
                Initiate VM Migration
              </h3>
              <button
                type="button"
                onClick={() => setIsMigrateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* VM Summary Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                <div className="font-bold text-cyan-300 text-sm font-mono mb-1">
                  Instance: {selectedVmForMigration.name}
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <div>Cores: <strong className="text-white">{selectedVmForMigration.vCpu} vCPUs</strong></div>
                  <div>RAM: <strong className="text-white">{selectedVmForMigration.memoryUsageGB} GB</strong></div>
                  <div>Storage: <strong className="text-white">{selectedVmForMigration.storageGB} GB</strong></div>
                </div>
              </div>

              {/* Destination Host Selector */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Target Destination Physical Host:
                </label>
                <select
                  value={targetHostId}
                  onChange={(e) => setTargetHostId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {hosts
                    .filter((h) => h.id !== selectedVmForMigration.currentHostId)
                    .map((host) => {
                      const isUnavailable = host.status === 'Failed' || host.status === 'Maintenance';
                      return (
                        <option key={host.id} value={host.id} disabled={isUnavailable}>
                          {host.name} ({host.status}) — CPU: {host.usedCpuPercent}% | Avail RAM: {host.totalMemoryGB - host.usedMemoryGB} GB
                        </option>
                      );
                    })}
                </select>
              </div>

              {/* Destination Capacity Check Preview */}
              {(() => {
                const targetHost = hosts.find((h) => h.id === targetHostId);
                if (!targetHost) return null;
                const check = canHostAccommodateVm(
                  targetHost,
                  selectedVmForMigration,
                  {
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
                  },
                  true
                );

                return (
                  <div
                    className={`p-2.5 rounded-lg border text-[11px] flex items-start gap-2 ${
                      check.canAccommodate
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-800 text-rose-300'
                    }`}
                  >
                    {check.canAccommodate ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">
                        {check.canAccommodate ? 'Capacity Feasibility Validated' : 'Capacity Constraint Violation'}
                      </div>
                      <div className="mt-0.5">
                        {check.canAccommodate
                          ? `Host ${targetHost.name} has sufficient compute, memory, and storage headroom.`
                          : check.reason}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Migration Strategy Selector */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Migration Strategy:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Live', 'Cold', 'Emergency'] as MigrationStrategy[]).map((strat) => (
                    <button
                      key={strat}
                      type="button"
                      onClick={() => setMigrationStrategy(strat)}
                      className={`p-2 rounded-lg border text-left transition-all ${
                        migrationStrategy === strat
                          ? 'border-cyan-500 bg-cyan-950/60 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs">{strat} Migration</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {strat === 'Live' ? '~150ms pause' : strat === 'Cold' ? 'Stop & copy' : 'Crash recovery'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsMigrateModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Begin Migration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Create VM Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateVmSubmit}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Deploy Virtual Machine Instance
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Instance Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">vCPU Cores:</label>
                  <select
                    value={vCpu}
                    onChange={(e) => setVCpu(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={4}>4 vCPUs</option>
                    <option value={8}>8 vCPUs</option>
                    <option value={16}>16 vCPUs</option>
                    <option value={24}>24 vCPUs</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">RAM Size:</label>
                  <select
                    value={memoryGB}
                    onChange={(e) => setMemoryGB(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value={16}>16 GB RAM</option>
                    <option value={32}>32 GB RAM</option>
                    <option value={64}>64 GB RAM</option>
                    <option value={128}>128 GB RAM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Workload Profile:</label>
                  <select
                    value={workloadType}
                    onChange={(e) => setWorkloadType(e.target.value as WorkloadType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Web Server">Web Server</option>
                    <option value="Database">Database</option>
                    <option value="Batch Processing">Batch Processing</option>
                    <option value="AI Inference">AI Inference</option>
                    <option value="API Gateway">API Gateway</option>
                    <option value="Microservice">Microservice</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Priority Tier:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Initial Physical Host:</label>
                <select
                  value={initialHostId}
                  onChange={(e) => setInitialHostId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  {hosts
                    .filter((h) => h.status !== 'Failed' && h.status !== 'Maintenance')
                    .map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.status})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Deploy Instance
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
