import React from 'react';
import {
  LayoutDashboard,
  Server,
  Cpu,
  ArrowLeftRight,
  Scale,
  ShieldCheck,
  FlaskConical,
  LineChart,
  DollarSign,
  Network,
  BookOpen,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'infrastructure'
  | 'vms'
  | 'migration'
  | 'load-balancer'
  | 'fault-tolerance'
  | 'experiments'
  | 'analytics'
  | 'cost'
  | 'architecture'
  | 'documentation';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  overloadedCount: number;
  failedCount: number;
  activeMigrationCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  overloadedCount,
  failedCount,
  activeMigrationCount,
}) => {
  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'infrastructure' as NavTab, label: 'Infrastructure', icon: Server, badge: failedCount > 0 ? `${failedCount} Failed` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    { id: 'vms' as NavTab, label: 'VM Management', icon: Cpu },
    { id: 'migration' as NavTab, label: 'VM Migration', icon: ArrowLeftRight, badge: activeMigrationCount > 0 ? `${activeMigrationCount} Moving` : undefined, badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' },
    { id: 'load-balancer' as NavTab, label: 'Load Balancer', icon: Scale, badge: overloadedCount > 0 ? `${overloadedCount} Hot` : undefined, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { id: 'fault-tolerance' as NavTab, label: 'Fault Tolerance', icon: ShieldCheck },
    { id: 'experiments' as NavTab, label: 'Experiment Lab', icon: FlaskConical },
    { id: 'analytics' as NavTab, label: 'Performance Analytics', icon: LineChart },
    { id: 'cost' as NavTab, label: 'Cost Analysis', icon: DollarSign },
    { id: 'architecture' as NavTab, label: 'Architecture', icon: Network },

  ];

  return (
    <aside className="w-64 bg-[#0a101f] border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand & Assessment Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Server className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none">
              CloudSim <span className="text-cyan-400 font-mono text-xs">Cloud</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 leading-tight font-medium">
              VM Migration & Load Balancer
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${isActive
                  ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400">
        <div className="flex items-center justify-between text-slate-400">
          <span>Control Plane</span>
          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Active
          </span>
        </div>
        <div className="mt-1.5 text-[10px] text-slate-400 flex justify-between">
          <span>Cluster Region</span>
          <span className="text-cyan-300 font-mono">us-east-1</span>
        </div>
      </div>
    </aside>
  );
};
