import React from 'react';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Scale,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { WorkloadProfile } from '../types/simulation';

interface NavbarProps {
  step: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onTriggerBalance: () => void;
  workloadProfile: WorkloadProfile;
  onChangeProfile: (profile: WorkloadProfile) => void;
  onAdjustWorkload: (delta: number) => void;
  onSpikeWorkload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  step,
  isRunning,
  onTogglePlay,
  onStepForward,
  onReset,
  onTriggerBalance,
  workloadProfile,
  onChangeProfile,
  onAdjustWorkload,
  onSpikeWorkload,
}) => {
  return (
    <header className="h-16 bg-[#0a101f] border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 select-none">
      {/* System Clock & Step Counter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Step:</span>
          <span className="text-white font-bold">{step}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Uptime:</span>
          <span className="text-cyan-300 font-bold">{(step * 5).toFixed(0)}s</span>
        </div>

        {/* State Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-900/80 border-slate-800">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          ></span>
          <span className={isRunning ? 'text-emerald-400' : 'text-amber-400'}>
            {isRunning ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Control Buttons & Workload Panel */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Workload Profile Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-lg text-xs">
          <span className="text-slate-400 hidden md:inline">Profile:</span>
          <select
            value={workloadProfile}
            onChange={(e) => onChangeProfile(e.target.value as WorkloadProfile)}
            className="bg-transparent text-cyan-300 font-medium focus:outline-none cursor-pointer text-xs"
          >
            <option value="Low" className="bg-slate-900 text-slate-200">Low Load (Quiet)</option>
            <option value="Normal" className="bg-slate-900 text-slate-200">Normal Load</option>
            <option value="High" className="bg-slate-900 text-slate-200">High Load (Intense)</option>
            <option value="Spike" className="bg-slate-900 text-slate-200">Sudden Spike Burst</option>
            <option value="Uneven" className="bg-slate-900 text-slate-200">Uneven Distribution</option>
          </select>
        </div>

        {/* Workload Modifiers */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => onAdjustWorkload(-10)}
            title="Decrease cluster workload by 10%"
            className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded flex items-center gap-1 transition-colors"
          >
            <TrendingDown className="w-3.5 h-3.5 text-blue-400" />
            <span>-10%</span>
          </button>
          <button
            onClick={() => onAdjustWorkload(10)}
            title="Increase cluster workload by 10%"
            className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded flex items-center gap-1 transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>+10%</span>
          </button>
          <button
            onClick={onSpikeWorkload}
            title="Inject random sudden traffic spike"
            className="px-2 py-1 text-cyan-300 hover:bg-cyan-950/60 rounded flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spike</span>
          </button>
        </div>

        {/* Load Balance Trigger */}
        <button
          onClick={onTriggerBalance}
          title="Manually trigger load balancer evaluation"
          className="px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Scale className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Evaluate LB</span>
        </button>

        {/* Play/Pause & Step */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={onTogglePlay}
            className={`p-1.5 rounded flex items-center justify-center transition-colors ${
              isRunning
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            }`}
            title={isRunning ? 'Pause cluster engine' : 'Start cluster engine'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onStepForward}
            disabled={isRunning}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Advance single step forward"
          >
            <StepForward className="w-4 h-4" />
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset cluster to default clean state"
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
