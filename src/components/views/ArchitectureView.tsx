import React, { useState } from 'react';
import { Network, Server, Cpu, Layers, Info, CheckCircle2 } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeDiagram, setActiveDiagram] = useState<'simulation' | 'conceptual'>('simulation');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Cloud System Architecture & Modeling Diagrams
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60">
              Interactive SVG Visualizations
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Clear separation between the client-side simulation execution pipeline and the conceptual cloud IaaS data center model.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveDiagram('simulation')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${activeDiagram === 'simulation'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            1. Control Plane Architecture
          </button>
          <button
            onClick={() => setActiveDiagram('conceptual')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${activeDiagram === 'conceptual'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            2. Conceptual IaaS Topology
          </button>
        </div>
      </div>

      {/* DIAGRAM 1: SIMULATION ENGINE ARCHITECTURE */}
      {activeDiagram === 'simulation' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                System Architecture &amp; Control Plane Pipeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Shows data flow from user interaction and Cloudflare Pages edge delivery into in-memory React/TS modules.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Zero External Backend
            </span>
          </div>

          {/* SVG Diagram 1 */}
          <div className="w-full overflow-x-auto bg-[#070d18] p-4 rounded-xl border border-slate-800/80">
            <svg
              viewBox="0 0 960 480"
              className="w-full min-w-[800px] h-auto select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Definitions */}
              <defs>
                <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.05" />
                </linearGradient>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                </marker>
                <marker id="arrowMuted" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
              </defs>

              {/* Stage 1: User & Browser */}
              <rect x="30" y="40" width="160" height="90" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="110" y="75" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">User / Evaluator</text>
              <text x="110" y="95" fill="#94a3b8" fontSize="11" textAnchor="middle">Web Browser (Chrome/Edge)</text>

              {/* Arrow 1 */}
              <line x1="190" y1="85" x2="250" y2="85" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="220" y="75" fill="#06b6d4" fontSize="10" textAnchor="middle">HTTPS</text>

              {/* Stage 2: Cloudflare Pages */}
              <rect x="250" y="40" width="180" height="90" rx="10" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="340" y="72" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">Cloudflare Pages</text>
              <text x="340" y="90" fill="#f8fafc" fontSize="11" textAnchor="middle">Edge Static Hosting</text>
              <text x="340" y="108" fill="#64748b" fontSize="10" textAnchor="middle">HTML / JS Bundles (Vite)</text>

              {/* Arrow 2 */}
              <line x1="430" y1="85" x2="490" y2="85" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#arrow)" />
              <text x="460" y="75" fill="#06b6d4" fontSize="10" textAnchor="middle">Client Execution</text>

              {/* Stage 3: React + TS Engine Boundary */}
              <rect x="490" y="25" width="440" height="430" rx="14" fill="url(#cyanGrad)" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="6 4" />
              <text x="515" y="55" fill="#38bdf8" fontSize="14" fontWeight="bold">Browser Client Memory Execution Boundary</text>
              <text x="515" y="72" fill="#94a3b8" fontSize="11">React 19 + TypeScript Simulation Engine (No Backend / No EC2)</text>

              {/* Engine Modules Inside Boundary */}
              {/* Row 1 Modules */}
              <rect x="510" y="95" width="190" height="60" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <text x="605" y="120" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">1. Host Manager</text>
              <text x="605" y="138" fill="#94a3b8" fontSize="10" textAnchor="middle">Blade States & Core Limits</text>

              <rect x="720" y="95" width="190" height="60" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <text x="815" y="120" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">2. VM Manager</text>
              <text x="815" y="138" fill="#94a3b8" fontSize="10" textAnchor="middle">vCPU & Demand Allocation</text>

              {/* Row 2 Modules */}
              <rect x="510" y="175" width="190" height="60" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="605" y="200" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">3. Load Balancer</text>
              <text x="605" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">FF / BF / LL Heuristics</text>

              <rect x="720" y="175" width="190" height="60" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
              <text x="815" y="200" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">4. Migration Engine</text>
              <text x="815" y="218" fill="#94a3b8" fontSize="10" textAnchor="middle">Atomic Placement & Downtime</text>

              {/* Row 3 Modules */}
              <rect x="510" y="255" width="190" height="60" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
              <text x="605" y="280" fill="#f87171" fontSize="12" fontWeight="bold" textAnchor="middle">5. Fault Tolerance</text>
              <text x="605" y="298" fill="#94a3b8" fontSize="10" textAnchor="middle">Crash Detection & Emergency Placement</text>

              <rect x="720" y="255" width="190" height="60" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
              <text x="815" y="280" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">6. Experiment Runner</text>
              <text x="815" y="298" fill="#94a3b8" fontSize="10" textAnchor="middle">Pristine Isolated State Clones</text>

              {/* In-Memory State & Metrics Output Box */}
              <rect x="510" y="340" width="400" height="90" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="710" y="365" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">In-Memory Simulation State & Reactive Hooks</text>
              <text x="710" y="385" fill="#f8fafc" fontSize="11" textAnchor="middle">Telemetry Engine &bull; Recharts Visualizations &bull; Activity Audit Log</text>
              <text x="710" y="405" fill="#10b981" fontSize="10" textAnchor="middle">State Updates &bull; Load Variance &bull; Migration Overhead &bull; Availability SLA</text>

              {/* Arrows connecting modules to state */}
              <line x1="605" y1="315" x2="605" y2="340" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)" />
              <line x1="815" y1="315" x2="815" y2="340" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arrow)" />
            </svg>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Key Architectural Characteristic:</strong> All state mutations occur locally in browser RAM via React state hooks. No external databases, microservices, or remote virtual machines exist.
            </span>
          </div>
        </div>
      )}

      {/* DIAGRAM 2: CONCEPTUAL IAAS CLOUD MODEL */}
      {activeDiagram === 'conceptual' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Conceptual Cloud Infrastructure (IaaS) Hierarchy
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Diagrammatic representation of the modeled enterprise data center architecture.
              </p>
            </div>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
              Conceptual Model
            </span>
          </div>

          {/* SVG Diagram 2 */}
          <div className="w-full overflow-x-auto bg-[#070d18] p-4 rounded-xl border border-slate-800/80">
            <svg
              viewBox="0 0 960 480"
              className="w-full min-w-[800px] h-auto select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Data Center Container */}
              <rect x="30" y="20" width="900" height="440" rx="14" fill="#0a101f" stroke="#1e293b" strokeWidth="2" />
              <text x="60" y="55" fill="#f8fafc" fontSize="15" fontWeight="bold">Conceptual Cloud Enterprise Data Center</text>
              <text x="60" y="75" fill="#94a3b8" fontSize="11">Tier-III Topology with Redundant Power & 10 Gbps Top-of-Rack Network Fabric</text>

              {/* Physical Host Blade 1 */}
              <rect x="60" y="100" width="260" height="330" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="80" y="130" fill="#38bdf8" fontSize="13" fontWeight="bold">Physical Host 01 (Rack A1)</text>
              <text x="80" y="148" fill="#64748b" fontSize="10">32 Cores &bull; 128 GB RAM &bull; 1000 GB NVMe</text>

              {/* VMs inside Host 1 */}
              <rect x="80" y="170" width="220" height="70" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
              <text x="95" y="195" fill="#f8fafc" fontSize="11" fontWeight="bold">vm-prod-web-01</text>
              <text x="95" y="212" fill="#94a3b8" fontSize="10">8 vCPUs &bull; 32 GB RAM &bull; Web Server</text>
              <text x="95" y="228" fill="#10b981" fontSize="9">Status: Running (65% CPU)</text>

              <rect x="80" y="255" width="220" height="70" rx="8" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
              <text x="95" y="280" fill="#f8fafc" fontSize="11" fontWeight="bold">vm-api-gateway-01</text>
              <text x="95" y="297" fill="#94a3b8" fontSize="10">8 vCPUs &bull; 32 GB RAM &bull; API Gateway</text>
              <text x="95" y="313" fill="#10b981" fontSize="9">Status: Running (55% CPU)</text>

              {/* Physical Host Blade 2 (Overload Candidate) */}
              <rect x="350" y="100" width="260" height="330" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="370" y="130" fill="#fbbf24" fontSize="13" fontWeight="bold">Physical Host 03 (Rack B1)</text>
              <text x="370" y="148" fill="#64748b" fontSize="10">64 Cores &bull; 256 GB RAM &bull; 2000 GB NVMe</text>

              {/* VMs inside Host 2 */}
              <rect x="370" y="170" width="220" height="60" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
              <text x="385" y="195" fill="#f8fafc" fontSize="11" fontWeight="bold">vm-db-postgres-primary</text>
              <text x="385" y="212" fill="#94a3b8" fontSize="10">16 vCPUs &bull; 64 GB &bull; Database</text>

              <rect x="370" y="240" width="220" height="60" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
              <text x="385" y="265" fill="#f8fafc" fontSize="11" fontWeight="bold">vm-ai-inference-01</text>
              <text x="385" y="282" fill="#94a3b8" fontSize="10">16 vCPUs &bull; 64 GB &bull; AI Inference</text>

              <rect x="370" y="310" width="220" height="60" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="385" y="333" fill="#fbbf24" fontSize="11" fontWeight="bold">vm-batch-worker-01 (MIGRATING)</text>
              <text x="385" y="350" fill="#94a3b8" fontSize="10">8 vCPUs &bull; 24 GB &bull; Batch Processing</text>

              {/* Migration Path Arrow */}
              <path d="M 590 340 C 620 340, 620 205, 640 205" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="5 3" markerEnd="url(#arrowGreen)" />
              <text x="615" y="270" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">Live Migration</text>

              {/* Physical Host Blade 3 (Destination) */}
              <rect x="640" y="100" width="260" height="330" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="660" y="130" fill="#34d399" fontSize="13" fontWeight="bold">Physical Host 06 (Rack C2)</text>
              <text x="660" y="148" fill="#64748b" fontSize="10">48 Cores &bull; 192 GB RAM &bull; Spare Headroom</text>

              {/* VMs inside Host 3 */}
              <rect x="660" y="170" width="220" height="70" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
              <text x="675" y="195" fill="#34d399" fontSize="11" fontWeight="bold">vm-batch-worker-01 (Destination)</text>
              <text x="675" y="212" fill="#94a3b8" fontSize="10">Receiving Memory Pages (Pre-copy)</text>
              <text x="675" y="228" fill="#38bdf8" fontSize="9">Absorption Feasible: Low Load</text>

              <rect x="660" y="255" width="220" height="70" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              <text x="675" y="280" fill="#f8fafc" fontSize="11" fontWeight="bold">vm-monitoring-grafana</text>
              <text x="675" y="297" fill="#94a3b8" fontSize="10">6 vCPUs &bull; 16 GB &bull; Web Server</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
