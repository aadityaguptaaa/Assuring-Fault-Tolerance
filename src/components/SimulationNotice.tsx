import React from 'react';
import { Activity } from 'lucide-react';

export const SimulationNotice: React.FC = () => {
  return (
    <div className="bg-slate-900/90 border-b border-cyan-500/20 px-4 py-1.5 backdrop-blur-sm z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-cyan-200">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide text-emerald-300 uppercase text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
            SYSTEM ONLINE
          </span>
          <span className="text-slate-300">
            Cloud Infrastructure Control Plane &bull; Proactive VM Migration &amp; Fault-Tolerant Load Balancing
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded border border-slate-800">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>High-Availability Cluster &bull; Region: us-east-1</span>
        </div>
      </div>
    </div>
  );
};
