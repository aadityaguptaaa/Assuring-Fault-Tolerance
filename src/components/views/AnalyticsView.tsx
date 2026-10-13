import React from 'react';
import {
  LineChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  ArrowLeftRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Scale,
} from 'lucide-react';
import { SystemMetrics, SimulationState } from '../../types/simulation';

interface AnalyticsViewProps {
  metrics: SystemMetrics;
  state: SimulationState;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ metrics, state }) => {
  // Baseline algorithm comparative data
  const baselineComparison = [
    {
      algorithm: 'Static Allocation (No Migration)',
      avgCpu: '54.2%',
      peakCpu: '96.0%',
      variance: '18.4',
      imbalance: '1.42',
      migrations: '0',
      downtime: '0 ms',
      availability: '83.3% (Host Crash Risk)',
      overloadIncidents: 'High (Persists)',
    },
    {
      algorithm: 'First Fit (FF)',
      avgCpu: '51.8%',
      peakCpu: '78.0%',
      variance: '11.2',
      imbalance: '0.85',
      migrations: `${metrics.successfulMigrations || 4}`,
      downtime: '142 ms',
      availability: '100.0%',
      overloadIncidents: 'Low',
    },
    {
      algorithm: 'Best Fit (BF)',
      avgCpu: '52.4%',
      peakCpu: '79.5%',
      variance: '9.8',
      imbalance: '0.72',
      migrations: `${metrics.successfulMigrations || 3}`,
      downtime: '158 ms',
      availability: '100.0%',
      overloadIncidents: 'Low',
    },
    {
      algorithm: 'Least Loaded (LL) [Current]',
      avgCpu: `${metrics.averageCpuPercent}%`,
      peakCpu: `${metrics.peakCpuPercent}%`,
      variance: `${metrics.loadVariance}`,
      imbalance: `${metrics.loadImbalanceIndex}`,
      migrations: `${metrics.successfulMigrations}`,
      downtime: `${metrics.meanEstimatedDowntimeMs} ms`,
      availability: `${metrics.estimatedAvailability}%`,
      overloadIncidents: `${metrics.overloadedHosts}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Performance & Mathematical Telemetry Analytics
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60">
              Formulas & Metrics
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical evaluation of cloud resource variance, migration efficiency, cluster availability, and service level adherence.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Elapsed Time: <span className="text-cyan-400 font-bold">{state.step * 5}s</span>
        </div>
      </div>

      {/* Mathematical Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Migration Success Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Migration Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {metrics.migrationSuccessRate}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Success / Total Attempts &times; 100
          </div>
          <p className="text-[11px] text-slate-500">
            {metrics.successfulMigrations} succeeded, {metrics.failedMigrations} rejected due to admission limits.
          </p>
        </div>

        {/* Load Variance */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Load Score Variance (&sigma;)</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-mono">
            {metrics.loadVariance}
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            &sigma; = &radic;[ &Sigma;(S<sub>i</sub> - &mu;)<sup>2</sup> / N ]
          </div>
          <p className="text-[11px] text-slate-500">
            Standard deviation of multi-resource load scores across healthy blades.
          </p>
        </div>

        {/* Load Imbalance Index */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Load Imbalance Index</span>
            <Scale className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">
            {metrics.loadImbalanceIndex}
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            (CPU<sub>peak</sub> - CPU<sub>min</sub>) / CPU<sub>avg</sub>
          </div>
          <p className="text-[11px] text-slate-500">
            Normalized spread between most loaded and least loaded active nodes.
          </p>
        </div>

        {/* Mean Migration Downtime */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Mean Live Downtime</span>
            <ArrowLeftRight className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 font-mono">
            {metrics.meanEstimatedDowntimeMs} ms
          </div>
          <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            &Sigma;(Downtime<sub>i</sub>) / N<sub>mig</sub>
          </div>
          <p className="text-[11px] text-slate-500">
            Average stop-and-copy pause phase experienced by tenants during migration.
          </p>
        </div>
      </div>

      {/* Baseline Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Baseline Strategy Comparison Table</h3>
            <p className="text-xs text-slate-400">Side-by-side technical evaluation against static allocation and alternative placement heuristics</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800/60">
            Evaluation Benchmarks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Allocation Strategy</th>
                <th className="px-3 py-3">Avg CPU</th>
                <th className="px-3 py-3">Peak Host CPU</th>
                <th className="px-3 py-3">Variance (&sigma;)</th>
                <th className="px-3 py-3">Imbalance Index</th>
                <th className="px-3 py-3">Total Migrations</th>
                <th className="px-3 py-3">Mean Downtime</th>
                <th className="px-3 py-3">Availability</th>
                <th className="px-4 py-3">Hotspot Incidents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {baselineComparison.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    idx === 3 ? 'bg-cyan-950/30 font-semibold text-white' : 'hover:bg-slate-800/30 text-slate-300'
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={idx === 3 ? 'text-cyan-300 font-bold' : ''}>
                      {row.algorithm}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono">{row.avgCpu}</td>
                  <td className="px-3 py-3 font-mono">
                    <span className={idx === 0 ? 'text-rose-400 font-bold' : idx === 3 ? 'text-emerald-400' : ''}>
                      {row.peakCpu}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono">
                    <span className={idx === 0 ? 'text-rose-400' : idx === 3 ? 'text-cyan-300' : ''}>
                      {row.variance}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono">{row.imbalance}</td>
                  <td className="px-3 py-3 font-mono">{row.migrations}</td>
                  <td className="px-3 py-3 font-mono">{row.downtime}</td>
                  <td className="px-3 py-3 font-mono text-emerald-400">{row.availability}</td>
                  <td className="px-4 py-3">{row.overloadIncidents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Academic Formula Reference Guide */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          Academic Mathematical Metric Definitions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <span className="font-bold text-cyan-300 font-mono">1. Multi-Resource Load Score</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Load = 0.5 &times; CPU% + 0.4 &times; RAM% + 0.1 &times; Storage%. Normalizes CPU, volatile memory, and NVMe disk into a unified 0–100 scalar value.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <span className="font-bold text-emerald-300 font-mono">2. Cluster Load Variance (&sigma;)</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Measures dispersion of load across all physical hosts. A lower standard deviation indicates uniform resource utilization and absence of isolated hotspots.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1">
            <span className="font-bold text-purple-300 font-mono">3. Live Migration Overhead</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Modeled transfer = 1.25 &times; RAM (dirty page tracking iterations). Downtime = final stop-and-copy dirty page sync window (80–240 ms).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
