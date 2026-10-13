import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  Cpu,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Zap,
  Info,
} from 'lucide-react';
import { SimulatedHost, SimulatedVM, FaultRecoveryResult } from '../../types/simulation';

interface FaultToleranceViewProps {
  hosts: SimulatedHost[];
  vms: SimulatedVM[];
  onFailHost: (hostId: string) => void;
  onRestoreHost: (hostId: string) => void;
}

export const FaultToleranceView: React.FC<FaultToleranceViewProps> = ({
  hosts,
  vms,
  onFailHost,
  onRestoreHost,
}) => {
  const [selectedHostToFail, setSelectedHostToFail] = useState<string>(
    hosts.find((h) => h.status !== 'Failed')?.id || ''
  );
  const [lastRecoveryResult, setLastRecoveryResult] = useState<FaultRecoveryResult | null>(null);

  const failedHosts = hosts.filter((h) => h.status === 'Failed');
  const healthyHosts = hosts.filter((h) => h.status === 'Healthy' || h.status === 'Warning');
  const runningVms = vms.filter((v) => v.status === 'Running').length;
  const clusterAvailability = vms.length > 0 ? ((runningVms / vms.length) * 100).toFixed(1) : '100.0';

  const handleTriggerFailure = () => {
    if (!selectedHostToFail) return;
    onFailHost(selectedHostToFail);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Disaster Recovery & Fault Tolerance
            <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono border border-rose-800/60">
              Host Crash Protocol
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Models catastrophic physical hardware crashes, priority-ordered emergency placement on surviving nodes, and admission limits.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Cluster Availability: <span className="text-emerald-400 font-bold">{clusterAvailability}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Failed Nodes: <span className="text-rose-400 font-bold">{failedHosts.length}</span>
          </div>
        </div>
      </div>

      {/* Interactive Crash Injection Panel */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-rose-900/40 rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
          <span>Inject Physical Host Failure</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Select an operational physical blade to trigger a hardware failure (power supply failure, kernel panic, or motherboard fault). The cluster will immediately detect the failure, freeze allocations, identify affected VMs, and attempt emergency recovery onto surviving healthy hosts.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="flex-1">
            <select
              value={selectedHostToFail}
              onChange={(e) => setSelectedHostToFail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
            >
              {healthyHosts.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.assignedVmIds.length} resident VMs) &bull; CPU: {h.usedCpuPercent}%
                </option>
              ))}
              {healthyHosts.length === 0 && (
                <option value="">All hosts currently failed or in maintenance</option>
              )}
            </select>
          </div>

          <button
            onClick={handleTriggerFailure}
            disabled={!selectedHostToFail || healthyHosts.length === 0}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-rose-950"
          >
            <Zap className="w-4 h-4" />
            <span>Crash Selected Host Blade</span>
          </button>
        </div>
      </div>

      {/* Failed Hosts & Restoration Control */}
      {failedHosts.length > 0 && (
        <div className="bg-slate-900/90 border border-red-900/60 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Offline / Crashed Host Blades ({failedHosts.length})</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">No new VMs can be allocated to these nodes</span>
          </div>

          <div className="space-y-2">
            {failedHosts.map((fh) => (
              <div
                key={fh.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-red-900/40 text-xs"
              >
                <div>
                  <div className="font-bold text-white font-mono">{fh.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Rack: {fh.rackId} &bull; Spec: {fh.totalCpuCores} Cores, {fh.totalMemoryGB} GB RAM
                  </div>
                </div>

                <button
                  onClick={() => onRestoreHost(fh.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Host to Service</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fault Tolerance Architectural Explanation & Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Disaster Recovery vs Continuous Replication */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
          <div className="font-bold text-cyan-400 flex items-center gap-1.5 text-sm">
            <Info className="w-4 h-4" />
            <span>Recovery vs Synchronous Replication</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            In standard cloud IaaS, host failure triggers <strong>automated VM restart</strong> on an alternate healthy node backed by persistent network block storage (Ceph/EBS). Volatile in-memory state is flushed unless synchronous lock-step replication (e.g. VMware Fault Tolerance) is explicitly modeled.
          </p>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400">
            Expected MTTR: ~5 - 12 seconds per instance boot sequence.
          </div>
        </div>

        {/* Capacity Exhaustion Behavior */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
          <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Capacity Exhaustion Principle</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            If remaining healthy hosts lack adequate CPU cores, RAM, or storage to host the evacuated VMs, the admission controller <strong>rejects placement</strong> and records them as <span className="text-rose-400 font-semibold font-mono">Failed</span>.
          </p>
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400">
            Academic Rule: We never fabricate phantom capacity to mask failure.
          </div>
        </div>
      </div>
    </div>
  );
};
