import React, { useState } from 'react';
import {
  DollarSign,
  Server,
  HardDrive,
  TrendingDown,
  Info,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { SimulatedHost } from '../../types/simulation';

interface CostAnalysisViewProps {
  hosts: SimulatedHost[];
  simulatedStep: number;
}

export const CostAnalysisView: React.FC<CostAnalysisViewProps> = ({
  hosts,
  simulatedStep,
}) => {
  // Configurable hypothetical rates
  const [hostRate, setHostRate] = useState<number>(0.08); // $0.08 per host-hour
  const [storageRate, setStorageRate] = useState<number>(0.00015); // $0.00015 per GB-hour
  const [consolidationPowerSavings, setConsolidationPowerSavings] = useState<number>(40); // 40% reduction when idle

  const activeHosts = hosts.filter((h) => h.status !== 'Failed');
  const activeHostCount = activeHosts.length;
  const simulatedHours = Math.max(1, (simulatedStep * 5) / 3600); // 5 sec per step
  const monthlyHours = 730;

  // Total allocated storage across active hosts
  const totalStorageGB = activeHosts.reduce((sum, h) => sum + h.totalStorageGB, 0);

  // Baseline Monthly Cost (all active hosts running full power)
  const baselineMonthlyHostCost = activeHostCount * hostRate * monthlyHours;
  const baselineMonthlyStorageCost = totalStorageGB * storageRate * monthlyHours;
  const baselineTotalMonthlyCost = baselineMonthlyHostCost + baselineMonthlyStorageCost;

  // Consolidated Scenario (Migrate workloads to pack onto 4 hosts, 2 hosts powered down / idle)
  const consolidatedActiveHosts = Math.max(2, activeHostCount - 2);
  const consolidatedIdleHosts = activeHostCount - consolidatedActiveHosts;
  const consolidatedHostCost =
    consolidatedActiveHosts * hostRate * monthlyHours +
    consolidatedIdleHosts * (hostRate * (1 - consolidationPowerSavings / 100)) * monthlyHours;
  const consolidatedTotalCost = consolidatedHostCost + baselineMonthlyStorageCost;
  const monthlySavings = baselineTotalMonthlyCost - consolidatedTotalCost;
  const savingsPercent = Math.round((monthlySavings / baselineTotalMonthlyCost) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Cloud Financial & Hosting Cost Analysis
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/60">
              Dual-Perspective
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparently distinguishes between the hypothetical IaaS cluster financial model and actual Cloudflare Pages deployment costs.
          </p>
        </div>
      </div>

      {/* SECTION A: SIMULATED INFRASTRUCTURE COST MODEL */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              Section A: Hypothetical Cloud IaaS Infrastructure Cost Model
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configurable financial projections modeling operational expenses (OpEx) for physical servers and storage.
            </p>
          </div>
          <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/80 px-2 py-1 rounded border border-amber-800/60 uppercase tracking-wide">
            HYPOTHETICAL MODEL ONLY &bull; NOT A REAL BILL
          </span>
        </div>

        {/* Rate Adjuster Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-medium">Physical Blade Rate ($/hr):</span>
              <span className="text-cyan-400 font-bold font-mono">${hostRate.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={0.04}
              max={0.2}
              step={0.005}
              value={hostRate}
              onChange={(e) => setHostRate(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Industry standard bare-metal rate</span>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-medium">Storage Rate ($/GB-hr):</span>
              <span className="text-purple-400 font-bold font-mono">${storageRate.toFixed(5)}</span>
            </div>
            <input
              type="range"
              min={0.00005}
              max={0.0005}
              step={0.00002}
              value={storageRate}
              onChange={(e) => setStorageRate(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">NVMe networked storage pool</span>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300 font-medium">Idle Power Reduction (%):</span>
              <span className="text-emerald-400 font-bold font-mono">{consolidationPowerSavings}%</span>
            </div>
            <input
              type="range"
              min={20}
              max={60}
              step={5}
              value={consolidationPowerSavings}
              onChange={(e) => setConsolidationPowerSavings(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Energy saved in low-power idle state</span>
          </div>
        </div>

        {/* Financial Comparison Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Baseline Scenario */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Baseline (Unconsolidated Cluster)
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              ${baselineTotalMonthlyCost.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">/ mo</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
              <div>Active Hosts: {activeHostCount} blades</div>
              <div>Compute: ${baselineMonthlyHostCost.toFixed(2)} / mo</div>
              <div>Storage: ${baselineMonthlyStorageCost.toFixed(2)} / mo</div>
            </div>
          </div>

          {/* Consolidation Scenario */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
              VM Migration Consolidation
            </span>
            <div className="text-2xl font-bold text-cyan-400 font-mono">
              ${consolidatedTotalCost.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-500">/ mo</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800/80">
              <div>Packed Blades: {consolidatedActiveHosts} blades</div>
              <div>Idled/Low-Power Blades: {consolidatedIdleHosts} blades</div>
              <div>Consolidated OpEx: ${consolidatedHostCost.toFixed(2)} / mo</div>
            </div>
          </div>

          {/* Monthly Savings */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-emerald-400" /> Projected Energy Savings
            </span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              ${monthlySavings.toFixed(2)}{' '}
              <span className="text-xs font-normal text-slate-400">({savingsPercent}% saved)</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
              Achieved by migrating workloads off underutilized hosts, enabling sleep mode or dynamic voltage scaling on vacant blades.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION B: ACTUAL CLOUDFLARE PAGES HOSTING COST */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Section B: Actual Project Hosting Infrastructure Cost
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Truthful declaration of the real-world deployment infrastructure hosting this simulator.
            </p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800/60 uppercase tracking-wide">
            REAL PRODUCTION DEPLOYMENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Cloudflare Pages Plan Details */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Cloudflare Pages (Free Tier)</span>
              <span className="font-mono text-emerald-400 font-bold text-base">$0.00 / month</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              This application is bundled as a static Single Page Application (SPA) using Vite and deployed globally on Cloudflare Pages edge network.
            </p>
            <div className="space-y-1 text-[11px] text-slate-400 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <div>Bandwidth: <span className="text-white">Unlimited</span></div>
              <div>Builds per Month: <span className="text-white">500 included builds</span></div>
              <div>SSL Certificate: <span className="text-white">Automatic Edge TLS</span></div>
              <div>Serverless Workers / D1 / R2: <span className="text-white">None utilized ($0.00)</span></div>
            </div>
          </div>

          {/* AWS EC2 & Billing Absence Disclaimer */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">AWS / Azure / GCP Incurred Charges</span>
              <span className="font-mono text-cyan-400 font-bold text-base">$0.00 (Zero EC2)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              No real AWS EC2 virtual machines, Elastic Load Balancers, EBS volumes, or Azure VMs are launched.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Academic Honesty Guarantee
              </div>
              <p className="leading-snug">
                The student incurs zero out-of-pocket charges and provides no cloud account credentials. All hypervisor models execute strictly within the user's web browser process.
              </p>
            </div>
          </div>
        </div>

        {/* Official Reference Citation */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
          <span>Official Reference: Cloudflare Pages Pricing Documentation</span>
          <a
            href="https://developers.cloudflare.com/pages/platform/pricing/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Cloudflare Official Documentation</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
