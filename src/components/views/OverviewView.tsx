import React from 'react';
import {
  Server,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  ArrowLeftRight,
  HardDrive,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { SimulationState, SystemMetrics } from '../../types/simulation';

interface OverviewViewProps {
  state: SimulationState;
  metrics: SystemMetrics;
  onNavigateToTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  state,
  metrics,
  onNavigateToTab,
}) => {
  // Chart data: CPU and Memory by host
  const hostResourceData = state.hosts.map((h) => ({
    name: h.name.replace('Physical Host ', 'H'),
    fullName: h.name,
    cpu: h.usedCpuPercent,
    ram: Math.round((h.usedMemoryGB / h.totalMemoryGB) * 100),
    storage: Math.round((h.usedStorageGB / h.totalStorageGB) * 100),
    vmCount: h.assignedVmIds.length,
    status: h.status,
  }));

  // VM distribution across hosts
  const vmDistributionData = state.hosts.map((h) => ({
    name: h.name.replace('Physical Host ', 'Host '),
    vms: h.assignedVmIds.length,
    status: h.status,
  }));

  // Last 5 completed migrations for before-and-after visualization
  const recentMigrationsWithLoads = state.migrations
    .filter((m) => m.status === 'Completed' && m.loadBeforeMigration && m.loadAfterMigration)
    .slice(0, 4)
    .map((m) => ({
      name: m.vmName.replace('vm-', ''),
      sourceBefore: m.loadBeforeMigration?.sourceCpu || 0,
      sourceAfter: m.loadAfterMigration?.sourceCpu || 0,
      destBefore: m.loadBeforeMigration?.destCpu || 0,
      destAfter: m.loadAfterMigration?.destCpu || 0,
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy':
        return '#10b981';
      case 'Warning':
        return '#f59e0b';
      case 'Overloaded':
        return '#ef4444';
      case 'Failed':
        return '#dc2626';
      case 'Maintenance':
        return '#64748b';
      default:
        return '#06b6d4';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Cluster Telemetry Overview
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              Active Telemetry
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-host resource monitoring, automated hotspot alleviation, and emergency recovery tracking.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Current Algorithm: <span className="text-cyan-400 font-semibold">{state.lbConfig.algorithm}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            Overload Threshold: <span className="text-amber-400 font-semibold">{state.lbConfig.cpuOverloadThreshold}% CPU</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards (11 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {/* Total Hosts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Physical Hosts</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.totalHosts}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">{metrics.healthyHosts} healthy</span>
            {metrics.failedHosts > 0 && <span className="text-rose-400 font-medium">&bull; {metrics.failedHosts} failed</span>}
          </div>
        </div>

        {/* Total VMs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Virtual Machines</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.totalVms}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {state.vms.filter((v) => v.status === 'Running').length} running &bull; {state.vms.filter((v) => v.status === 'Migrating').length} moving
          </div>
        </div>

        {/* Average CPU */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Avg CPU Load</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.averageCpuPercent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Peak: <span className={metrics.peakCpuPercent >= 80 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>{metrics.peakCpuPercent}%</span>
          </div>
        </div>

        {/* Average RAM */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Avg RAM Load</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.averageMemoryPercent}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Peak: <span className="text-slate-300">{metrics.peakMemoryPercent}%</span>
          </div>
        </div>

        {/* Overloaded Hosts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Overloaded Nodes</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className={`text-xl font-bold ${metrics.overloadedHosts > 0 ? 'text-amber-400' : 'text-white'}`}>
            {metrics.overloadedHosts}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Threshold: &gt;={state.lbConfig.cpuOverloadThreshold}% CPU
          </div>
        </div>

        {/* Failed Hosts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Failed Hosts</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className={`text-xl font-bold ${metrics.failedHosts > 0 ? 'text-rose-400' : 'text-white'}`}>
            {metrics.failedHosts}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {metrics.failedHosts > 0 ? 'Disaster Recovery Active' : '0 Hardware Outages'}
          </div>
        </div>

        {/* Migrations Completed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Completed Migrations</span>
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.successfulMigrations}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Success Rate: <span className="text-emerald-400 font-semibold">{metrics.migrationSuccessRate}%</span>
          </div>
        </div>

        {/* Failed Migrations */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Rejected Migrations</span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-white">{metrics.failedMigrations}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Capacity constrained
          </div>
        </div>

        {/* Estimated Availability */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Cluster Availability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{metrics.estimatedAvailability}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            SLA target: 99.9%
          </div>
        </div>

        {/* Total Migration Overhead */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Migration Traffic</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {metrics.totalSimulatedMigrationOverheadGB.toFixed(1)} <span className="text-xs font-normal text-slate-400">GB</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Avg pause: {metrics.meanEstimatedDowntimeMs} ms
          </div>
        </div>

        {/* Load Variance */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors col-span-2">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Load Variance & Imbalance Index</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-xl font-bold text-white">&sigma; = {metrics.loadVariance}</div>
            <span className="text-xs text-slate-400">Imbalance Index: <strong className="text-slate-200">{metrics.loadImbalanceIndex}</strong></span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Lower standard deviation indicates more uniformly distributed cluster workload.
          </div>
        </div>
      </div>

      {/* Charts Row: CPU & Memory by Host + VM Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Host CPU & RAM Utilization */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Physical Host Resource Utilization</h3>
              <p className="text-xs text-slate-400">Comparative CPU (%) vs RAM (%) utilization across all cluster blades</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span> CPU %
              </span>
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> RAM %
              </span>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hostResourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [`${value}%`, name === 'cpu' ? 'CPU Utilization' : 'RAM Utilization']}
                  labelFormatter={(label, items) => items[0]?.payload?.fullName || label}
                />
                <Bar dataKey="cpu" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ram" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VM Distribution Across Hosts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">VM Host Placement Density</h3>
              <button
                onClick={() => onNavigateToTab('infrastructure')}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                View Hosts &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Count of virtual machines active on each physical blade</p>

            <div className="space-y-3">
              {state.hosts.map((host) => {
                const vmCount = host.assignedVmIds.length;
                const percentage = Math.round((vmCount / Math.max(1, state.vms.length)) * 100);
                return (
                  <div key={host.id} className="text-xs">
                    <div className="flex items-center justify-between text-slate-300 mb-1">
                      <span className="font-medium flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getStatusColor(host.status) }}
                        ></span>
                        {host.name.replace('Physical Host ', 'Host ')}
                      </span>
                      <span className="text-slate-400">
                        {vmCount} VMs ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (vmCount / 4) * 100)}%`,
                          backgroundColor: getStatusColor(host.status),
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Cluster Density:</span>
            <span className="font-semibold text-white">
              {(state.vms.length / Math.max(1, state.hosts.filter((h) => h.status !== 'Failed').length)).toFixed(1)} VMs / Active Host
            </span>
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Activity Log Feed & Migration Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Cluster Activity Feed</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {state.activityLogs.length} events logged
            </span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {state.activityLogs.slice(0, 8).map((evt) => {
              const borderClass =
                evt.level === 'error'
                  ? 'border-rose-500/40 bg-rose-950/20 text-rose-300'
                  : evt.level === 'warn'
                  ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                  : evt.level === 'success'
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-slate-950/40 text-slate-300';

              return (
                <div
                  key={evt.id}
                  className={`p-2.5 rounded-lg border text-xs transition-colors ${borderClass}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-[11px] uppercase tracking-wide opacity-90">
                      [{evt.category}]
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Step {evt.step} &bull; {evt.timestamp}
                    </span>
                  </div>
                  <div className="font-medium text-slate-200">{evt.message}</div>
                  {evt.details && (
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {evt.details}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Before-and-After Migration Load Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Before vs After Migration CPU Impact</h3>
              </div>
              <button
                onClick={() => onNavigateToTab('migration')}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Migration Engine &rarr;
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Telemetry proving source host overload reduction and destination host absorption:
            </p>

            {recentMigrationsWithLoads.length > 0 ? (
              <div className="space-y-3">
                {recentMigrationsWithLoads.map((m, idx) => (
                  <div key={idx} className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-slate-300 mb-1.5">
                      <span className="font-semibold text-cyan-300">VM: {m.name}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/60">
                        Overload Relieved
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="text-slate-400">Source Host CPU:</span>
                        <div className="flex items-center gap-1.5 font-mono mt-0.5">
                          <span className="text-rose-400 font-bold">{m.sourceBefore}%</span>
                          <span className="text-slate-500">&rarr;</span>
                          <span className="text-emerald-400 font-bold">{m.sourceAfter}%</span>
                          <span className="text-emerald-500 text-[10px]">(-{m.sourceBefore - m.sourceAfter}%)</span>
                        </div>
                      </div>
                      <div className="bg-slate-900 p-1.5 rounded">
                        <span className="text-slate-400">Destination Host CPU:</span>
                        <div className="flex items-center gap-1.5 font-mono mt-0.5">
                          <span className="text-slate-400 font-bold">{m.destBefore}%</span>
                          <span className="text-slate-500">&rarr;</span>
                          <span className="text-cyan-400 font-bold">{m.destAfter}%</span>
                          <span className="text-cyan-500 text-[10px]">(+{m.destAfter - m.destBefore}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                <ArrowLeftRight className="w-6 h-6 mb-2 text-slate-600" />
                <span>No migrations executed yet in this session.</span>
                <span className="text-[11px] text-slate-600 mt-1">
                  Trigger automatic load balancing or increase workload to observe before/after impacts.
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Average Relieved Delta:</span>
            <span className="font-semibold text-emerald-400 font-mono">
              {recentMigrationsWithLoads.length > 0
                ? `~${(
                    recentMigrationsWithLoads.reduce((s, m) => s + (m.sourceBefore - m.sourceAfter), 0) /
                    recentMigrationsWithLoads.length
                  ).toFixed(1)}% CPU drop on source`
                : 'Pending events'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
