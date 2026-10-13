import React from 'react';
import {
  Scale,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Info,
  Shield,
  Layers,
} from 'lucide-react';
import {
  SimulatedHost,
  SimulatedVM,
  LoadBalancerConfig,
  LoadBalancingAlgorithm,
  AlgorithmDecisionLog,
} from '../../types/simulation';
import { calculateLoadScore } from '../../engine/calculations';

interface LoadBalancerViewProps {
  config: LoadBalancerConfig;
  hosts: SimulatedHost[];
  vms: SimulatedVM[];
  decisionLogs: AlgorithmDecisionLog[];
  onUpdateConfig: (newConfig: Partial<LoadBalancerConfig>) => void;
  onTriggerEvaluation: () => void;
}

export const LoadBalancerView: React.FC<LoadBalancerViewProps> = ({
  config,
  hosts,
  vms,
  decisionLogs,
  onUpdateConfig,
  onTriggerEvaluation,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner & Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Multi-Heuristic Cloud Load Balancer
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60">
              Active: {config.algorithm}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuously balances physical cluster workloads, detects hotspots, and selects optimal destination nodes using configurable objective weights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerEvaluation}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <Scale className="w-4 h-4" />
            <span>Evaluate Cluster Now</span>
          </button>
        </div>
      </div>

      {/* Algorithm Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* First Fit */}
        <div
          onClick={() => onUpdateConfig({ algorithm: 'FirstFit' })}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            config.algorithm === 'FirstFit'
              ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/50'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              First Fit (FF)
            </h3>
            {config.algorithm === 'FirstFit' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Scans hosts sequentially and places the candidate VM on the very first healthy node that satisfies capacity constraints.
          </p>
          <div className="text-[11px] text-slate-500 space-y-0.5 font-mono">
            <div>Complexity: <span className="text-slate-300">O(N) search</span></div>
            <div>Focus: <span className="text-slate-300">Minimal algorithmic overhead</span></div>
          </div>
        </div>

        {/* Best Fit */}
        <div
          onClick={() => onUpdateConfig({ algorithm: 'BestFit' })}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            config.algorithm === 'BestFit'
              ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/50'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
              Best Fit (BF)
            </h3>
            {config.algorithm === 'BestFit' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Evaluates all feasible hosts and chooses the node that minimizes remaining residual slack, packing VMs snugly.
          </p>
          <div className="text-[11px] text-slate-500 space-y-0.5 font-mono">
            <div>Complexity: <span className="text-slate-300">O(N) full scan</span></div>
            <div>Focus: <span className="text-slate-300">Dense bin-packing consolidation</span></div>
          </div>
        </div>

        {/* Least Loaded */}
        <div
          onClick={() => onUpdateConfig({ algorithm: 'LeastLoaded' })}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            config.algorithm === 'LeastLoaded'
              ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/50'
              : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Least Loaded (LL)
            </h3>
            {config.algorithm === 'LeastLoaded' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                RECOMMENDED
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Chooses the feasible host with the lowest multi-resource weighted score (0.5 CPU + 0.4 RAM + 0.1 Storage).
          </p>
          <div className="text-[11px] text-slate-500 space-y-0.5 font-mono">
            <div>Complexity: <span className="text-slate-300">O(N) weighted min</span></div>
            <div>Focus: <span className="text-emerald-400">Minimizes cluster variance &sigma;</span></div>
          </div>
        </div>
      </div>

      {/* Threshold & Safeguard Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threshold Settings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Detection Thresholds</h3>
            </div>
            <button
              onClick={() =>
                onUpdateConfig({
                  cpuOverloadThreshold: 80,
                  memoryOverloadThreshold: 85,
                  underloadThreshold: 25,
                  cooldownSteps: 3,
                  hysteresisMargin: 5,
                })
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Defaults</span>
            </button>
          </div>

          {/* CPU Overload Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">CPU Overload Threshold:</span>
              <span className="text-amber-400 font-bold font-mono">{config.cpuOverloadThreshold}%</span>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              value={config.cpuOverloadThreshold}
              onChange={(e) => onUpdateConfig({ cpuOverloadThreshold: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Hosts exceeding this CPU % trigger proactive VM migration.</p>
          </div>

          {/* RAM Overload Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">RAM Overload Threshold:</span>
              <span className="text-purple-400 font-bold font-mono">{config.memoryOverloadThreshold}%</span>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              value={config.memoryOverloadThreshold}
              onChange={(e) => onUpdateConfig({ memoryOverloadThreshold: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Hosts exceeding this memory % trigger proactive VM migration.</p>
          </div>

          {/* Underload Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Underload Consolidation Threshold:</span>
              <span className="text-blue-400 font-bold font-mono">{config.underloadThreshold}%</span>
            </div>
            <input
              type="range"
              min={15}
              max={40}
              value={config.underloadThreshold}
              onChange={(e) => onUpdateConfig({ underloadThreshold: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Candidate threshold for consolidating VMs and idling underused blades.</p>
          </div>
        </div>

        {/* Anti-Oscillation & Weight Safeguards */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Anti-Oscillation Safeguards & Weights</h3>
          </div>

          {/* Cooldown Period */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Migration Cooldown Period:</span>
              <span className="text-cyan-400 font-bold font-mono">{config.cooldownSteps} steps</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={config.cooldownSteps}
              onChange={(e) => onUpdateConfig({ cooldownSteps: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Locks recently migrated VMs to eliminate rapid back-and-forth ping-pong oscillations.</p>
          </div>

          {/* Hysteresis Margin */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">Hysteresis Headroom Margin:</span>
              <span className="text-emerald-400 font-bold font-mono">{config.hysteresisMargin}%</span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              value={config.hysteresisMargin}
              onChange={(e) => onUpdateConfig({ hysteresisMargin: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Destination host projected load must remain below (Threshold - Headroom).</p>
          </div>

          {/* Formula Display */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="text-cyan-400 font-bold">Least Loaded Score Formula:</span>
            <div className="mt-1 text-slate-400">
              Load Score = ({config.cpuWeight} &times; CPU%) + ({config.memoryWeight} &times; RAM%) + ({config.storageWeight} &times; Storage%)
            </div>
          </div>
        </div>
      </div>

      {/* Live Host Load Evaluation Ranking Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Live Cluster Placement Score Evaluation</h3>
            <p className="text-xs text-slate-400">Real-time ranking of hosts evaluated for candidate VM reception</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Ranked: Lowest Load Score &rarr; Highest</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Host Name</th>
                <th className="px-3 py-3">Health Status</th>
                <th className="px-3 py-3">CPU %</th>
                <th className="px-3 py-3">RAM %</th>
                <th className="px-3 py-3">Storage %</th>
                <th className="px-3 py-3 font-mono text-cyan-300">Computed Load Score</th>
                <th className="px-3 py-3">Available RAM</th>
                <th className="px-4 py-3">Eligibility for Inbound Migration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {[...hosts]
                .sort((a, b) => {
                  const scoreA = calculateLoadScore(a, {
                    cpuWeight: config.cpuWeight,
                    memoryWeight: config.memoryWeight,
                    storageWeight: config.storageWeight,
                  });
                  const scoreB = calculateLoadScore(b, {
                    cpuWeight: config.cpuWeight,
                    memoryWeight: config.memoryWeight,
                    storageWeight: config.storageWeight,
                  });
                  return scoreA - scoreB;
                })
                .map((host) => {
                  const score = calculateLoadScore(host, {
                    cpuWeight: config.cpuWeight,
                    memoryWeight: config.memoryWeight,
                    storageWeight: config.storageWeight,
                  });
                  const isEligible = host.status === 'Healthy' || host.status === 'Warning';
                  const availableRam = host.totalMemoryGB - host.usedMemoryGB;

                  return (
                    <tr key={host.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{host.name}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            host.status === 'Healthy'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : host.status === 'Warning'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : host.status === 'Overloaded'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {host.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-300">{host.usedCpuPercent}%</td>
                      <td className="px-3 py-3 font-mono text-slate-300">
                        {Math.round((host.usedMemoryGB / host.totalMemoryGB) * 100)}%
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-400">
                        {Math.round((host.usedStorageGB / host.totalStorageGB) * 100)}%
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-cyan-400">{score.toFixed(1)}</td>
                      <td className="px-3 py-3 font-mono text-slate-300">{availableRam} GB</td>
                      <td className="px-4 py-3">
                        {isEligible ? (
                          <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Eligible Destination
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Ineligible ({host.status})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Logs (Detailed Algorithmic Justifications) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Algorithmic Decision Justification Log</h3>
          <span className="text-xs text-slate-400 font-mono">{decisionLogs.length} Decisions Logged</span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {decisionLogs.slice(0, 6).map((log) => (
            <div
              key={log.id}
              className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-cyan-300 font-mono">[{log.algorithm}]</span>
                  <span className="text-slate-200">{log.triggerReason}</span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    log.finalOutcome === 'Migrated'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : log.finalOutcome === 'Rejected'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  Outcome: {log.finalOutcome}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 leading-snug">
                {log.summary}
              </div>

              {/* Host evaluations list if any */}
              {log.evaluationDetails.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[10px] font-mono">
                  {log.evaluationDetails.map((ev) => (
                    <div
                      key={ev.hostId}
                      className={`p-1.5 rounded border ${
                        ev.capacityFeasible
                          ? 'bg-slate-900 border-emerald-800/60 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold">{ev.hostName.replace('Physical Host ', 'H')}</div>
                      <div>Score: {ev.loadScore} | {ev.capacityFeasible ? 'Feasible' : 'Rejected'}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {decisionLogs.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500 italic">
              No load balancing decisions recorded yet. Trigger an evaluation or step the simulation to observe decisions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
