import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Code2,
  HelpCircle,
  Download,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface VivaQA {
  q: string;
  a: string;
  category: 'Fundamentals' | 'Virtualization' | 'Load Balancing' | 'Migration' | 'Fault Tolerance' | 'Project Architecture';
}

export const DocumentationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viva' | 'rubric' | 'algorithms' | 'model'>('viva');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const vivaQuestions: VivaQA[] = [
    {
      q: '1. What is Cloud Computing?',
      a: 'Cloud computing is the on-demand delivery of compute power, database storage, applications, and other IT resources via the internet with pay-as-you-go pricing, replacing on-premise hardware provisioning.',
      category: 'Fundamentals',
    },
    {
      q: '2. What is Virtualization?',
      a: 'Virtualization is the fundamental technology that enables the creation of simulated, software-based computing environments (virtual machines) on top of a single physical hardware server using a hypervisor abstraction layer.',
      category: 'Virtualization',
    },
    {
      q: '3. What is a Virtual Machine (VM)?',
      a: 'A virtual machine is an isolated software container that runs its own operating system and applications just like a physical computer, with dedicated allocations of virtual CPU (vCPU), RAM, and storage.',
      category: 'Virtualization',
    },
    {
      q: '4. What is a Hypervisor (VMM)?',
      a: 'A Hypervisor or Virtual Machine Monitor is the system software that manages physical hardware resources and mediates access between virtual machines. Type-1 (bare-metal) runs directly on hardware (e.g. VMware ESXi, KVM), while Type-2 runs on a host OS (e.g. VirtualBox).',
      category: 'Virtualization',
    },
    {
      q: '5. What is Load Balancing in Cloud Data Centers?',
      a: 'Load balancing is the process of redistributing computational workloads across multiple computing resources (physical hosts or virtual servers) to maximize throughput, minimize response time, eliminate hotspots, and optimize resource utilization.',
      category: 'Load Balancing',
    },
    {
      q: '6. Why is Load Balancing required?',
      a: 'Without load balancing, certain physical servers become overloaded (causing high latency, thermal stress, and SLA violations) while others remain idle, leading to stranded capacity, high energy waste, and cascade hardware failures.',
      category: 'Load Balancing',
    },
    {
      q: '7. What is Virtual Machine Migration?',
      a: 'VM migration is the process of transferring an active or suspended virtual machine from one physical host to another physical host within the cloud cluster without disrupting network connectivity or tenant application service.',
      category: 'Migration',
    },
    {
      q: '8. What is Live Migration?',
      a: 'Live migration transfers a running VM between physical servers with near-zero downtime (typically under 200 milliseconds). Memory pages are pre-copied iteratively over a high-speed network while the VM remains operational, followed by a brief stop-and-copy dirty page switchover.',
      category: 'Migration',
    },
    {
      q: '9. What is Cold Migration?',
      a: 'Cold migration involves completely stopping or suspending the virtual machine on the source host, copying its memory state and disk volume over to the destination host, and restarting it. Downtime is equal to the total transfer duration (several seconds to minutes).',
      category: 'Migration',
    },
    {
      q: '10. What is Fault Tolerance in Cloud Computing?',
      a: 'Fault tolerance is the property that enables a cloud system to continue operating without interruption even in the event of hardware failures (e.g. host crash, power supply loss). In our model, emergency evacuation rapidly moves workloads to surviving nodes.',
      category: 'Fault Tolerance',
    },
    {
      q: '11. What is the difference between Fault Tolerance and Disaster Recovery?',
      a: 'Fault tolerance aims for zero or minimal downtime during local component failure within a cluster, while disaster recovery refers to overarching policies and processes for restoring entire data centers after catastrophic regional events (floods, power grid loss).',
      category: 'Fault Tolerance',
    },
    {
      q: '12. How is an overloaded physical host detected in this project?',
      a: 'A host is classified as Overloaded when its current CPU utilization exceeds the configured threshold (default 80%) OR its memory usage exceeds the memory threshold (default 85%). Warning state is triggered within 10% of these thresholds.',
      category: 'Load Balancing',
    },
    {
      q: '13. How does the First Fit (FF) algorithm work?',
      a: 'First Fit sequentially scans available cluster hosts and selects the first healthy physical node that possesses sufficient free CPU, RAM, and storage headroom to accommodate the candidate VM. It operates in O(N) time with minimal compute overhead.',
      category: 'Load Balancing',
    },
    {
      q: '14. How does the Best Fit (BF) algorithm work?',
      a: 'Best Fit evaluates all candidate healthy hosts and selects the node that minimizes remaining residual capacity (slack) after placement. This maximizes bin-packing density, preserving larger contiguous chunks on remaining blades.',
      category: 'Load Balancing',
    },
    {
      q: '15. How does the Least Loaded (LL) algorithm work?',
      a: 'Least Loaded computes a multi-resource objective score: Load Score = 0.5×CPU% + 0.4×RAM% + 0.1×Storage%. It assigns the candidate VM to the feasible host with the lowest score, directly minimizing cluster-wide load variance.',
      category: 'Load Balancing',
    },
    {
      q: '16. How do you select which VM to migrate from an overloaded host?',
      a: 'We evaluate resident VMs by priority (Low priority migrated first to preserve mission-critical services) and CPU demand. We pick an eligible VM whose removal relieves the host overload without causing an immediate breach on the target.',
      category: 'Migration',
    },
    {
      q: '17. What happens when a destination host lacks capacity?',
      a: 'The migration engine immediately rejects the transfer. If no healthy host in the entire cluster has sufficient headroom, the migration is aborted and an alert is logged. The simulator never invents fake capacity.',
      category: 'Migration',
    },
    {
      q: '18. What is Migration Downtime and how is it simulated?',
      a: 'Migration downtime is the duration during final switchover when the VM is paused on the source host and resumes on the target host. We simulate live downtime between 80–240 milliseconds based on iterative dirty page synchronization over a 10 Gbps interconnect.',
      category: 'Migration',
    },
    {
      q: '19. How is the Migration Success Rate calculated?',
      a: 'Migration Success Rate = (Successful Migrations / Total Completed or Failed Migration Attempts) × 100. If total attempts equal zero, it displays 100% and safely handles division by zero.',
      category: 'Migration',
    },
    {
      q: '20. How do you compare algorithms fairly in the Experiment Lab?',
      a: 'Each experiment clones a clean, pristine copy of the initial cluster state template. This ensures identical starting host loads, VM placements, and synthetic workload seeds, eliminating cross-run mutation contamination.',
      category: 'Project Architecture',
    },
    {
      q: '21. Why is this project a simulation rather than a real IaaS deployment?',
      a: 'Real multi-host bare-metal testing requires 6–10 physical servers, high hypervisor licensing, and significant cloud spending (hundreds of dollars per test). Our in-browser simulator models the mathematical algorithms with zero financial barrier and complete deterministic reproducibility.',
      category: 'Project Architecture',
    },
    {
      q: '22. What role does Cloudflare Pages play in this project?',
      a: 'Cloudflare Pages serves as the static PaaS/edge deployment platform. It delivers the compiled HTML5, CSS, and TypeScript assets to the browser. Cloudflare Pages does NOT provision VMs; all simulation logic runs client-side.',
      category: 'Project Architecture',
    },
    {
      q: '23. Why are there no AWS EC2 instances or remote databases created?',
      a: 'To guarantee security, zero student expense, and complete transparency. The project prompt strictly mandates no external cloud resources, no API credentials, and no secret keys.',
      category: 'Project Architecture',
    },
    {
      q: '24. What are the key limitations of this browser-based simulation?',
      a: 'Limitations include: in-memory state scope (resets on browser tab reload), simplified network topology (assumes uniform 10 Gbps Top-of-Rack without spine-leaf packet drops), and discrete clock steps rather than microsecond hardware interrupts.',
      category: 'Project Architecture',
    },
    {
      q: '25. How could this project be extended to a real cloud environment in future work?',
      a: 'The decision engine and heuristic logic (First Fit, Best Fit, Least Loaded) can be connected to real cloud orchestration frameworks such as OpenStack Watcher, VMware DRS APIs, or Kubernetes Custom Schedulers via REST endpoints.',
      category: 'Project Architecture',
    },
  ];

  const filteredQuestions = vivaQuestions.filter(
    (q) =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner with Presentation Download */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Technical Documentation & Assessment Guide
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/60">
              Case Study (15 Marks)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete marking rubric mapping, algorithm pseudocode, cloud service model distinctions, and 25 viva voce defense questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/VM_Migration_Load_Balancing.pptx"
            download="VM_Migration_Load_Balancing.pptx"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download Presentation (.pptx)</span>
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('viva')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'viva'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Viva Voce Defense (25 Q&As)</span>
        </button>

        <button
          onClick={() => setActiveTab('rubric')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'rubric'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Marking Rubric Alignment (15 Marks)</span>
        </button>

        <button
          onClick={() => setActiveTab('algorithms')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'algorithms'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Algorithm Pseudocode</span>
        </button>

        <button
          onClick={() => setActiveTab('model')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'model'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Cloud Service Model</span>
        </button>
      </div>

      {/* TAB 1: VIVA VOCE QUESTIONS & ANSWERS */}
      {activeTab === 'viva' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search viva questions by topic, algorithm, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredQuestions.length} of {vivaQuestions.length} Q&As
            </span>
          </div>

          <div className="space-y-2">
            {filteredQuestions.map((qa, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className="font-semibold text-xs sm:text-sm text-white">
                        {qa.q}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-950 text-cyan-300 border border-slate-800 shrink-0">
                      {qa.category}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 border-t border-slate-800/60 bg-slate-950/40 leading-relaxed pl-11">
                      {qa.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MARKING RUBRIC ALIGNMENT */}
      {activeTab === 'rubric' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Part 1 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">Part 1: Problem Analysis & Cloud Design</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-xs border border-cyan-800">
                  2 Marks
                </span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Problem Identification:</strong> Static VM allocation causing host hotspots and unrecoverable hardware crashes.</li>
                <li><strong>Requirements:</strong> Clear functional & non-functional requirements implemented in TypeScript.</li>
                <li><strong>Architecture:</strong> Dual SVG diagrams separating Cloudflare Pages delivery from the conceptual cloud IaaS model.</li>
                <li><strong>Service Model:</strong> Transparently explains that Cloudflare Pages is PaaS/JAMstack while the simulation models IaaS compute blades.</li>
              </ul>
            </div>

            {/* Part 2 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">Part 2: Implementation & Technical Execution</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-800">
                  8 Marks
                </span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Working Frontend:</strong> React 19 + TypeScript + Vite + Tailwind CSS console.</li>
                <li><strong>3 LB Algorithms:</strong> First Fit, Best Fit, and Least Loaded with anti-oscillation cooldowns.</li>
                <li><strong>Migration Engine:</strong> Live, Cold, and Emergency migration with atomic state updates.</li>
                <li><strong>Fault Tolerance:</strong> Host crash injection, priority-ordered recovery, and capacity constraint adherence.</li>
                <li><strong>Automated Testing:</strong> 15 automated Vitest unit tests verifying calculations and edge cases.</li>
              </ul>
            </div>

            {/* Part 3 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">Part 3: Results & Technical Evaluation</span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold text-xs border border-purple-800">
                  2 Marks
                </span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Experiment Lab:</strong> 5 controlled experiments with state cloning and CSV export.</li>
                <li><strong>Baseline Evaluation:</strong> Static allocation vs dynamic rebalancing comparison table.</li>
                <li><strong>Telemetry Metrics:</strong> Mathematical formulas for load variance (&sigma;), imbalance index, and downtime.</li>
                <li><strong>Cost Model:</strong> Hypothetical OpEx model contrasting 33% consolidation savings against $0.00 actual Cloudflare hosting.</li>
              </ul>
            </div>

            {/* Part 4 */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">Part 4: Viva Voce & Technical Defense</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold text-xs border border-amber-800">
                  3 Marks
                </span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                <li><strong>Viva Q&A Repository:</strong> 25 comprehensive questions with precise, beginner-friendly engineering answers.</li>
                <li><strong>Academic Transparency:</strong> Explicit declarations that no fake cloud provisioning is performed.</li>
                <li><strong>Presentation:</strong> Complete 15-slide editable PowerPoint presentation (`FT_III_VM_Migration_Load_Balancing.pptx`) with speaker notes.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALGORITHM PSEUDOCODE */}
      {activeTab === 'algorithms' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
            <h3 className="text-cyan-400 font-bold text-sm">Algorithm 1: Least Loaded (LL) Destination Selection</h3>
            <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
{`FUNCTION FindDestinationLeastLoaded(candidateVm, sourceHost, hosts, config):
    bestHost = NULL
    lowestScore = INFINITY

    FOR EACH host IN hosts:
        IF host.id == sourceHost.id: CONTINUE
        IF host.status != "Healthy" AND host.status != "Warning": CONTINUE

        // Step 1: Check capacity feasibility with hysteresis headroom
        IF NOT CanAccommodate(host, candidateVm, config):
            CONTINUE

        // Step 2: Calculate multi-resource weighted load score
        cpu% = host.usedCpuPercent
        mem% = (host.usedMemoryGB / host.totalMemoryGB) * 100
        storage% = (host.usedStorageGB / host.totalStorageGB) * 100
        score = (config.cpuWeight * cpu%) + (config.memWeight * mem%) + (config.storageWeight * storage%)

        // Step 3: Pick host minimizing load variance
        IF score < lowestScore:
            lowestScore = score
            bestHost = host

    RETURN bestHost`}
            </pre>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
            <h3 className="text-emerald-400 font-bold text-sm">Algorithm 2: Atomic VM Live Migration Engine</h3>
            <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
{`FUNCTION ExecuteMigration(vm, sourceHost, destHost, strategy):
    // 1. Lock resources on destination host to prevent concurrent oversubscription
    destHost.reservedMemoryGB += vm.memoryUsageGB
    destHost.reservedCpuCores += vm.vCpu * (vm.cpuDemandPercent / 100)
    vm.status = "Migrating"

    // 2. Simulate iterative memory dirty-page pre-copy iterations
    simulatedTransferGB = vm.memoryUsageGB * 1.25
    estimatedDuration = simulatedTransferGB / linkBandwidthGBps
    estimatedDowntimeMs = RandomBetween(80, 240) // Stop-and-copy pause

    // 3. Atomically transfer ownership
    sourceHost.assignedVmIds.Remove(vm.id)
    destHost.assignedVmIds.Add(vm.id)
    vm.currentHostId = destHost.id
    vm.status = "Running"

    // 4. Release reservation locks & set anti-oscillation cooldown timer
    destHost.reservedMemoryGB -= vm.memoryUsageGB
    sourceHost.cooldownUntilStep = currentStep + CooldownSteps
    destHost.cooldownUntilStep = currentStep + CooldownSteps

    // 5. Recalculate physical utilization metrics
    RecalculateHost(sourceHost)
    RecalculateHost(destHost)`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: CLOUD SERVICE MODEL */}
      {activeTab === 'model' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-4 text-xs leading-relaxed text-slate-300">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Cloud Service Model & Deployment Classification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-cyan-300 uppercase tracking-wide">1. Hosting Model (PaaS / Edge)</span>
              <p className="text-slate-400">
                The web application is hosted on <strong>Cloudflare Pages</strong>. It utilizes edge caching and automated Git build deployments to deliver static bundles. It requires zero cloud databases or virtual machine servers.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-300 uppercase tracking-wide">2. Modeled Architecture (IaaS)</span>
              <p className="text-slate-400">
                The application simulates <strong>Infrastructure as a Service (IaaS)</strong> concepts: bare-metal server blades, hypervisor vCPU allocation, memory paging, Top-of-Rack network bandwidth, and VM migration.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="font-bold text-amber-300 uppercase tracking-wide">3. Academic Boundary</span>
              <p className="text-slate-400">
                The simulator models behavior purely in browser memory. It does not manage real Linux KVM hypervisors or cloud provider provisioning APIs.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
