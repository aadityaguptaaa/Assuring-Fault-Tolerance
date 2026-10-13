import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  Download,
  RotateCcw,
  BarChart2,
  CheckCircle2,
  ArrowUpRight,
  TrendingDown,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ExperimentResult,
  LoadBalancingAlgorithm,
} from '../../types/simulation';
import {
  runExp1StaticVsDynamic,
  runExp2OverloadRecovery,
  runExp3FailureRecovery,
  runExp4AlgorithmComparison,
  runExp5WorkloadScaling,
  exportResultsToCSV,
} from '../../engine/experimentsEngine';

export const ExperimentsView: React.FC = () => {
  const [selectedExperiment, setSelectedExperiment] = useState<number>(1);
  const [selectedAlgo, setSelectedAlgo] = useState<LoadBalancingAlgorithm>('LeastLoaded');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [resultsList, setResultsList] = useState<ExperimentResult[]>([]);
  const [activeExpChartData, setActiveExpChartData] = useState<any[]>([]);

  const handleRunExperiment = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (selectedExperiment === 1) {
        const { staticResult, dynamicResult } = runExp1StaticVsDynamic(selectedAlgo);
        setResultsList((prev) => [dynamicResult, staticResult, ...prev]);
        setActiveExpChartData([
          { name: 'Static (No LB)', peakCpu: staticResult.peakCpuUtilization, variance: staticResult.loadVariance, migrations: 0 },
          { name: `Dynamic (${selectedAlgo})`, peakCpu: dynamicResult.peakCpuUtilization, variance: dynamicResult.loadVariance, migrations: dynamicResult.migrationsSuccessful },
        ]);
      } else if (selectedExperiment === 2) {
        const res = runExp2OverloadRecovery(selectedAlgo);
        setResultsList((prev) => [res, ...prev]);
        setActiveExpChartData([
          { name: 'Before Recovery', peakCpu: 95, variance: 16.5 },
          { name: 'After Recovery', peakCpu: res.peakCpuUtilization, variance: res.loadVariance },
        ]);
      } else if (selectedExperiment === 3) {
        const { result } = runExp3FailureRecovery('host-3');
        setResultsList((prev) => [result, ...prev]);
        setActiveExpChartData([
          { name: 'Affected VMs', count: result.migrationsTriggered },
          { name: 'Recovered VMs', count: result.migrationsSuccessful },
        ]);
      } else if (selectedExperiment === 4) {
        const comparison = runExp4AlgorithmComparison(12);
        const resArray = [comparison.FirstFit, comparison.BestFit, comparison.LeastLoaded];
        setResultsList((prev) => [...resArray, ...prev]);
        setActiveExpChartData([
          { name: 'First Fit', variance: comparison.FirstFit.loadVariance, peakCpu: comparison.FirstFit.peakCpuUtilization, migrations: comparison.FirstFit.migrationsSuccessful },
          { name: 'Best Fit', variance: comparison.BestFit.loadVariance, peakCpu: comparison.BestFit.peakCpuUtilization, migrations: comparison.BestFit.migrationsSuccessful },
          { name: 'Least Loaded', variance: comparison.LeastLoaded.loadVariance, peakCpu: comparison.LeastLoaded.peakCpuUtilization, migrations: comparison.LeastLoaded.migrationsSuccessful },
        ]);
      } else if (selectedExperiment === 5) {
        const scalingResults = runExp5WorkloadScaling();
        setResultsList((prev) => [...scalingResults, ...prev]);
        setActiveExpChartData(
          scalingResults.map((r) => ({
            name: r.initialWorkload,
            avgCpu: r.averageCpuUtilization,
            migrations: r.migrationsSuccessful,
            variance: r.loadVariance,
          }))
        );
      }
      setIsRunning(false);
    }, 300);
  };

  const handleExportCSV = () => {
    if (resultsList.length === 0) return;
    const csvContent = exportResultsToCSV(resultsList);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CloudSim_Experiment_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Automated Experimentation & Benchmarking Lab
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60">
              Deterministic Runner
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Run controlled, multi-step cloud experiments using isolated pristine state clones to guarantee non-contaminated, reproducible findings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {resultsList.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Experiment Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { id: 1, title: 'Exp 1: Static vs Dynamic', desc: 'Baseline comparison against auto-migration' },
          { id: 2, title: 'Exp 2: Overload Recovery', desc: 'Host 95% CPU hotspot mitigation' },
          { id: 3, title: 'Exp 3: Failure Recovery', desc: 'Host crash & emergency placement' },
          { id: 4, title: 'Exp 4: Algorithm Shootout', desc: 'First Fit vs Best Fit vs Least Loaded' },
          { id: 5, title: 'Exp 5: Workload Scaling', desc: 'Low to Spike stress scaling' },
        ].map((exp) => (
          <button
            key={exp.id}
            onClick={() => setSelectedExperiment(exp.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedExperiment === exp.id
                ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/60'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className={`font-bold text-xs ${selectedExperiment === exp.id ? 'text-white' : 'text-slate-300'}`}>
              {exp.title}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 leading-snug">
              {exp.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Experiment Runner Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Heuristic Algorithm:</span>
            <select
              value={selectedAlgo}
              onChange={(e) => setSelectedAlgo(e.target.value as LoadBalancingAlgorithm)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-cyan-300 font-medium focus:outline-none"
            >
              <option value="LeastLoaded">Least Loaded (LL)</option>
              <option value="FirstFit">First Fit (FF)</option>
              <option value="BestFit">Best Fit (BF)</option>
            </select>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono text-[11px]">
            Guaranteed Isolated Clones &bull; Zero State Contamination
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleRunExperiment}
            disabled={isRunning}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-cyan-950"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunning ? 'Evaluating...' : 'Run Experiment Benchmarks'}</span>
          </button>
        </div>
      </div>

      {/* Visual Chart from Latest Experiment */}
      {activeExpChartData.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-2">
            Empirical Results Visualization — Experiment {selectedExperiment}
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Directly computed from isolated benchmark test executions:
          </p>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeExpChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', fontSize: '12px' }}
                />
                {activeExpChartData[0]?.peakCpu !== undefined && (
                  <Bar dataKey="peakCpu" fill="#ef4444" name="Peak CPU %" radius={[4, 4, 0, 0]} />
                )}
                {activeExpChartData[0]?.variance !== undefined && (
                  <Bar dataKey="variance" fill="#06b6d4" name="Load Variance (σ)" radius={[4, 4, 0, 0]} />
                )}
                {activeExpChartData[0]?.migrations !== undefined && (
                  <Bar dataKey="migrations" fill="#10b981" name="Migrations Executed" radius={[4, 4, 0, 0]} />
                )}
                {activeExpChartData[0]?.count !== undefined && (
                  <Bar dataKey="count" fill="#818cf8" name="VM Count" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Results Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Cumulative Benchmark Execution Log</h3>
            <p className="text-xs text-slate-400">All experimental runs captured during this browser session</p>
          </div>
          {resultsList.length > 0 && (
            <button
              onClick={() => setResultsList([])}
              className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Experiment Run</th>
                <th className="px-3 py-3">Algorithm</th>
                <th className="px-3 py-3">Workload Profile</th>
                <th className="px-3 py-3">Avg CPU</th>
                <th className="px-3 py-3">Peak CPU</th>
                <th className="px-3 py-3">Variance (&sigma;)</th>
                <th className="px-3 py-3">Migrations</th>
                <th className="px-3 py-3">Downtime</th>
                <th className="px-4 py-3">Outcome Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {resultsList.map((res) => (
                <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{res.experimentName}</td>
                  <td className="px-3 py-3 font-mono text-cyan-300">{res.algorithm}</td>
                  <td className="px-3 py-3 text-slate-300">{res.initialWorkload}</td>
                  <td className="px-3 py-3 font-mono text-slate-300">{res.averageCpuUtilization}%</td>
                  <td className="px-3 py-3 font-mono">
                    <span className={res.peakCpuUtilization >= 80 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {res.peakCpuUtilization}%
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-indigo-300">{res.loadVariance}</td>
                  <td className="px-3 py-3 font-mono text-emerald-400">{res.migrationsSuccessful}</td>
                  <td className="px-3 py-3 font-mono text-slate-400">{res.totalDowntimeMs} ms</td>
                  <td className="px-4 py-3 text-[11px] text-slate-400 max-w-xs leading-snug">{res.notes}</td>
                </tr>
              ))}
              {resultsList.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500 italic">
                    No experiments executed yet. Click "Run Experiment Benchmarks" above to start testing.
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
