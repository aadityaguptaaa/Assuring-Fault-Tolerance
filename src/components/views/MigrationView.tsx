import React from 'react';
import {
  ArrowLeftRight,
  Clock,
  HardDrive,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { MigrationRecord, MigrationStrategy } from '../../types/simulation';

interface MigrationViewProps {
  activeMigrations: MigrationRecord[];
  allMigrations: MigrationRecord[];
}

export const MigrationView: React.FC<MigrationViewProps> = ({
  activeMigrations,
  allMigrations,
}) => {
  const completedMigrations = allMigrations.filter((m) => m.status === 'Completed');
  const failedMigrations = allMigrations.filter((m) => m.status === 'Failed');

  const totalTransferred = completedMigrations.reduce(
    (sum, m) => sum + m.simulatedDataTransferredGB,
    0
  );
  const avgDowntime =
    completedMigrations.length > 0
      ? Math.round(
          completedMigrations.reduce((sum, m) => sum + m.estimatedDowntimeMs, 0) /
            completedMigrations.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            VM Migration Engine & Telemetry
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60">
              Live & Cold Protocols
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Observes real-time dirty memory page pre-copy iterations, downtime switchovers, and bandwidth allocation across cluster blades.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Total Transfer: <span className="text-cyan-400 font-semibold">{totalTransferred.toFixed(1)} GB</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Mean Downtime: <span className="text-emerald-400 font-semibold">{avgDowntime} ms</span>
          </div>
        </div>
      </div>

      {/* Migration Strategy Conceptual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Live Migration */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Zap className="w-4 h-4" /> Live Migration
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Zero-Disruption
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            VM remains conceptually running on the source host while iterative memory pages are synchronized across the 10 Gbps interconnect.
          </p>
          <div className="space-y-1 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono">
            <div>Downtime Pause: <span className="text-emerald-400 font-semibold">80 - 240 ms</span></div>
            <div>Overhead: <span className="text-slate-300">~1.25x RAM size (dirty pages)</span></div>
            <div>Workload Impact: <span className="text-slate-300">Transient CPU degradation</span></div>
          </div>
        </div>

        {/* Cold Migration */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wide">
              <Clock className="w-4 h-4" /> Cold Migration
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              State Suspended
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            VM is paused or stopped during disk volume and memory dump transfer, then restarted afresh on the target host.
          </p>
          <div className="space-y-1 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono">
            <div>Downtime Pause: <span className="text-amber-400 font-semibold">10 - 30 seconds</span></div>
            <div>Overhead: <span className="text-slate-300">1.0x RAM + disk sync</span></div>
            <div>Workload Impact: <span className="text-slate-300">Total service pause</span></div>
          </div>
        </div>

        {/* Emergency Evacuation */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4" /> Emergency Evacuation
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Hardware Failure
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Triggered automatically upon host crash. VMs are rebooted on surviving healthy nodes using persistent storage snapshots.
          </p>
          <div className="space-y-1 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 font-mono">
            <div>Downtime Pause: <span className="text-rose-400 font-semibold">5 - 12 seconds (Boot)</span></div>
            <div>State Preserved: <span className="text-slate-300">Crash-consistent storage</span></div>
            <div>Admission Control: <span className="text-slate-300">Strict spare capacity check</span></div>
          </div>
        </div>
      </div>

      {/* Active Migrations In-Progress Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            Active Transfers In-Flight ({activeMigrations.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Network Link: 10 Gbps Fabric</span>
        </div>

        {activeMigrations.length > 0 ? (
          <div className="space-y-3">
            {activeMigrations.map((mig) => (
              <div
                key={mig.migrationId}
                className="bg-slate-950/70 p-3 rounded-lg border border-cyan-500/30 text-xs space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-semibold text-white">
                    <span className="text-cyan-300">{mig.vmName}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400">{mig.sourceHostName.replace('Physical Host ', 'H')}</span>
                    <span className="text-cyan-400">&rarr;</span>
                    <span className="text-emerald-400">{mig.destinationHostName.replace('Physical Host ', 'H')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {mig.strategy} Migration
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">{mig.progressPercent}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full striped-progress transition-all duration-300"
                    style={{ width: `${mig.progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Transfer: {mig.simulatedDataTransferredGB} GB</span>
                  <span>Est. Duration: {mig.estimatedDurationSeconds}s</span>
                  <span>Downtime: {mig.estimatedDowntimeMs} ms</span>
                  <span className="text-slate-500 italic">Reason: {mig.reason}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
            No active migrations currently in progress. Trigger automated load balancing or manual migration to begin a transfer.
          </div>
        )}
      </div>

      {/* Migration History Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Migration History Log</h3>
            <p className="text-xs text-slate-400">Complete historical audit trail of all automated and manual migration attempts</p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {allMigrations.length} Total Executions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Migration ID</th>
                <th className="px-3 py-3">Instance</th>
                <th className="px-3 py-3">Source &rarr; Target</th>
                <th className="px-3 py-3">Strategy</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Data Transferred</th>
                <th className="px-3 py-3">Est. Downtime</th>
                <th className="px-3 py-3">Step</th>
                <th className="px-4 py-3">Trigger Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {allMigrations.map((m) => (
                <tr key={m.migrationId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{m.migrationId.slice(0, 16)}</td>
                  <td className="px-3 py-3 font-mono font-semibold text-white">{m.vmName}</td>
                  <td className="px-3 py-3 font-mono text-slate-300">
                    {m.sourceHostName.replace('Physical Host ', 'H')} &rarr; {m.destinationHostName.replace('Physical Host ', 'H')}
                  </td>
                  <td className="px-3 py-3 text-slate-300">{m.strategy}</td>
                  <td className="px-3 py-3">
                    {m.status === 'Completed' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
                      </span>
                    ) : m.status === 'In Progress' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800 inline-flex items-center gap-1">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-400 border border-rose-800 inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" /> Failed
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-300">{m.simulatedDataTransferredGB} GB</td>
                  <td className="px-3 py-3 font-mono text-slate-300">{m.estimatedDowntimeMs} ms</td>
                  <td className="px-3 py-3 font-mono text-slate-400">Step {m.startTime}</td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {m.status === 'Failed' ? (
                      <span className="text-rose-400">{m.failureReason || m.reason}</span>
                    ) : (
                      m.reason
                    )}
                  </td>
                </tr>
              ))}
              {allMigrations.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500 italic">
                    No migration records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
