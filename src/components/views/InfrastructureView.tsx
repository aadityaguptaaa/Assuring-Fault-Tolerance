import React, { useState } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  AlertTriangle,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Wrench,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SimulatedHost, SimulatedVM, HostStatus } from '../../types/simulation';

interface InfrastructureViewProps {
  hosts: SimulatedHost[];
  vms: SimulatedVM[];
  onOverloadHost: (hostId: string) => void;
  onFailHost: (hostId: string) => void;
  onRestoreHost: (hostId: string) => void;
  onToggleMaintenance: (hostId: string) => void;
  onAdjustHostWorkload: (hostId: string, deltaPercent: number) => void;
  onAddHost: (host: Omit<SimulatedHost, 'id' | 'assignedVmIds' | 'usedCpuPercent' | 'usedMemoryGB' | 'usedStorageGB' | 'networkUtilizationPercent' | 'healthStatus'>) => void;
  onRemoveHost: (hostId: string) => void;
  onNavigateToVm: (vmId: string) => void;
}

export const InfrastructureView: React.FC<InfrastructureViewProps> = ({
  hosts,
  vms,
  onOverloadHost,
  onFailHost,
  onRestoreHost,
  onToggleMaintenance,
  onAdjustHostWorkload,
  onAddHost,
  onRemoveHost,
  onNavigateToVm,
}) => {
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [isAddHostModalOpen, setIsAddHostModalOpen] = useState(false);
  const [newHostName, setNewHostName] = useState('');
  const [newCpuCores, setNewCpuCores] = useState(48);
  const [newMemoryGB, setNewMemoryGB] = useState(192);
  const [newStorageGB, setNewStorageGB] = useState(1500);

  const selectedHost = hosts.find((h) => h.id === selectedHostId) || null;
  const selectedHostVms = selectedHost
    ? vms.filter((v) => selectedHost.assignedVmIds.includes(v.id) && v.currentHostId === selectedHost.id)
    : [];

  const handleCreateHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostName.trim()) return;
    onAddHost({
      name: newHostName.trim(),
      status: 'Healthy',
      totalCpuCores: Number(newCpuCores),
      totalMemoryGB: Number(newMemoryGB),
      totalStorageGB: Number(newStorageGB),
      rackId: `Rack-${String.fromCharCode(65 + (hosts.length % 4))}${Math.floor(hosts.length / 4) + 1}`,
    });
    setNewHostName('');
    setIsAddHostModalOpen(false);
  };

  const getStatusBadge = (status: HostStatus) => {
    switch (status) {
      case 'Healthy':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">Healthy</span>;
      case 'Warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800/60">Warning</span>;
      case 'Overloaded':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60 animate-pulse">Overloaded</span>;
      case 'Failed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-400 border border-red-800">FAILED (CRASH)</span>;
      case 'Maintenance':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">Maintenance</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header with Add Host button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Physical Data Center Topology
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {hosts.length} Blades Configured
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage bare-metal physical host blades, inject workload spikes, trigger host failures, or configure maintenance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddHostModalOpen(true)}
            disabled={hosts.length >= 12}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Host Blade</span>
          </button>
        </div>
      </div>

      {/* Grid of Physical Host Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {hosts.map((host) => {
          const assignedVms = vms.filter(
            (v) => host.assignedVmIds.includes(v.id) && v.currentHostId === host.id
          );
          const ramPercent = Math.round((host.usedMemoryGB / host.totalMemoryGB) * 100);
          const storagePercent = Math.round((host.usedStorageGB / host.totalStorageGB) * 100);
          const isFailed = host.status === 'Failed';
          const isMaintenance = host.status === 'Maintenance';

          return (
            <div
              key={host.id}
              className={`bg-slate-900/90 border rounded-xl p-4 transition-all hover:shadow-lg flex flex-col justify-between ${
                isFailed
                  ? 'border-red-900/70 bg-red-950/10'
                  : host.status === 'Overloaded'
                  ? 'border-rose-500/50 bg-rose-950/10'
                  : host.status === 'Warning'
                  ? 'border-amber-500/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Host Card Top Bar */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Server
                        className={`w-4 h-4 ${
                          isFailed
                            ? 'text-red-500'
                            : host.status === 'Overloaded'
                            ? 'text-rose-400'
                            : 'text-cyan-400'
                        }`}
                      />
                      <h3 className="text-sm font-bold text-white tracking-tight">{host.name}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 ml-6">
                      {host.rackId} &bull; ID: {host.id}
                    </span>
                  </div>
                  <div>{getStatusBadge(host.status)}</div>
                </div>

                {/* Utilization Progress Bars */}
                <div className="space-y-2.5 my-3">
                  {/* CPU Utilization */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        CPU Cores ({host.totalCpuCores})
                      </span>
                      <span
                        className={`font-mono font-semibold ${
                          host.usedCpuPercent >= 80 ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {host.usedCpuPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          host.usedCpuPercent >= 80
                            ? 'bg-rose-500'
                            : host.usedCpuPercent >= 70
                            ? 'bg-amber-500'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${host.usedCpuPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* RAM Utilization */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        RAM ({host.totalMemoryGB} GB)
                      </span>
                      <span className="font-mono text-slate-200">
                        {host.usedMemoryGB} / {host.totalMemoryGB} GB ({ramPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          ramPercent >= 85
                            ? 'bg-rose-500'
                            : ramPercent >= 75
                            ? 'bg-amber-500'
                            : 'bg-purple-500'
                        }`}
                        style={{ width: `${ramPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Storage Utilization */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        NVMe Disk ({host.totalStorageGB} GB)
                      </span>
                      <span className="font-mono text-slate-400">
                        {host.usedStorageGB} GB ({storagePercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-slate-600 rounded-full transition-all duration-300"
                        style={{ width: `${storagePercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Assigned VMs Pills */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Resident VMs ({assignedVms.length}):</span>
                    <button
                      onClick={() => setSelectedHostId(host.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-medium text-[11px]"
                    >
                      Details &rarr;
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assignedVms.length > 0 ? (
                      assignedVms.map((vm) => (
                        <button
                          key={vm.id}
                          onClick={() => onNavigateToVm(vm.id)}
                          className="px-2 py-0.5 rounded bg-slate-950 text-[11px] font-mono text-cyan-300 border border-slate-800 hover:border-cyan-500/50 transition-colors"
                        >
                          {vm.name}
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-600 italic">No assigned virtual machines (Idle)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Host Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-1.5 text-xs">
                {isFailed ? (
                  <button
                    onClick={() => onRestoreHost(host.id)}
                    className="col-span-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Restore Failed Blade</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onOverloadHost(host.id)}
                      disabled={isMaintenance}
                      className="py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 disabled:opacity-40 flex items-center justify-center gap-1 transition-colors"
                      title="Inject CPU workload spike to force host overload"
                    >
                      <Zap className="w-3 h-3 text-rose-400" />
                      <span>Overload</span>
                    </button>

                    <button
                      onClick={() => onFailHost(host.id)}
                      className="py-1 rounded bg-red-950/70 hover:bg-red-900 text-red-300 border border-red-700/60 flex items-center justify-center gap-1 transition-colors"
                      title="Trigger catastrophic hardware crash"
                    >
                      <XCircle className="w-3 h-3 text-red-400" />
                      <span>Fail Blade</span>
                    </button>

                    <button
                      onClick={() => onAdjustHostWorkload(host.id, 15)}
                      disabled={isMaintenance}
                      className="py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1 transition-colors"
                      title="Increase load on resident VMs by +15%"
                    >
                      <TrendingUp className="w-3 h-3 text-amber-400" />
                      <span>Load +15%</span>
                    </button>

                    <button
                      onClick={() => onToggleMaintenance(host.id)}
                      className={`py-1 rounded border flex items-center justify-center gap-1 transition-colors ${
                        isMaintenance
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                      title={isMaintenance ? 'Resume normal operational state' : 'Put host in maintenance mode'}
                    >
                      <Wrench className="w-3 h-3 text-slate-400" />
                      <span>{isMaintenance ? 'Active' : 'Maint'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Host Details Drawer / Modal */}
      {selectedHost && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  {selectedHost.name} Specifications & Workloads
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Rack: {selectedHost.rackId} &bull; Hardware ID: {selectedHost.id}
                </span>
              </div>
              <button
                onClick={() => setSelectedHostId(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1"
              >
                &times;
              </button>
            </div>

            {/* Hardware Specifications Grid */}
            <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400">CPU Compute:</span>
                <div className="text-white font-bold font-mono text-sm mt-0.5">
                  {selectedHost.totalCpuCores} Cores
                </div>
                <span className="text-[11px] text-cyan-400">{selectedHost.usedCpuPercent}% active</span>
              </div>
              <div>
                <span className="text-slate-400">Total Memory:</span>
                <div className="text-white font-bold font-mono text-sm mt-0.5">
                  {selectedHost.totalMemoryGB} GB RAM
                </div>
                <span className="text-[11px] text-purple-400">{selectedHost.usedMemoryGB} GB used</span>
              </div>
              <div>
                <span className="text-slate-400">NVMe Storage:</span>
                <div className="text-white font-bold font-mono text-sm mt-0.5">
                  {selectedHost.totalStorageGB} GB
                </div>
                <span className="text-[11px] text-slate-400">{selectedHost.usedStorageGB} GB allocated</span>
              </div>
            </div>

            {/* Resident Virtual Machines List */}
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                Assigned Virtual Machines ({selectedHostVms.length})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {selectedHostVms.map((vm) => (
                  <div
                    key={vm.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-cyan-300 font-mono">{vm.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {vm.workloadType} &bull; {vm.vCpu} vCPUs &bull; {vm.memoryUsageGB} GB RAM &bull; Priority: {vm.priority}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-200">
                        {vm.cpuDemandPercent}% CPU
                      </span>
                      <button
                        onClick={() => {
                          setSelectedHostId(null);
                          onNavigateToVm(vm.id);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                      >
                        Manage &rarr;
                      </button>
                    </div>
                  </div>
                ))}
                {selectedHostVms.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-500 italic">
                    No VMs currently running on this physical blade.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">
                Status: {selectedHost.status}
              </span>
              <button
                onClick={() => setSelectedHostId(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Host Modal */}
      {isAddHostModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateHost}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                Add Physical Host Blade
              </h3>
              <button
                type="button"
                onClick={() => setIsAddHostModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Host Blade Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physical Host 07 (Rack D1)"
                  value={newHostName}
                  onChange={(e) => setNewHostName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Total CPU Cores:</label>
                <select
                  value={newCpuCores}
                  onChange={(e) => setNewCpuCores(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={32}>32 Cores (Intel Xeon Silver)</option>
                  <option value={48}>48 Cores (AMD EPYC 7002)</option>
                  <option value={64}>64 Cores (AMD EPYC 7003)</option>
                  <option value={96}>96 Cores (Dual Socket EPYC)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Total Memory (GB RAM):</label>
                <select
                  value={newMemoryGB}
                  onChange={(e) => setNewMemoryGB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={128}>128 GB DDR4 ECC</option>
                  <option value={192}>192 GB DDR4 ECC</option>
                  <option value={256}>256 GB DDR4 ECC</option>
                  <option value={512}>512 GB High-Density</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Storage Volume (GB NVMe):</label>
                <select
                  value={newStorageGB}
                  onChange={(e) => setNewStorageGB(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={1000}>1,000 GB NVMe Array</option>
                  <option value={1500}>1,500 GB NVMe Array</option>
                  <option value={2000}>2,000 GB NVMe Array</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsAddHostModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
              >
                Commission Blade
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
