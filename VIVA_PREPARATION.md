# VIVA VOCE DEFENSE & ORAL EXAMINATION PREPARATION
## FT-III Case Study Assessment — 15 Marks
**Project Title:** Assuring Fault-Tolerance through VM Migration-Based Load Balancing in the Cloud  
**Subject:** Cloud Computing (CS-701 / CC-401)  
**Deployment Platform:** Cloudflare Pages (Pure Browser In-Memory Simulation)  

---

### Core Questions & Answers (25 Comprehensive Technical Defenses)

#### 1. What is Cloud Computing?
**Answer:** Cloud computing is the on-demand delivery of IT resources (compute power, database storage, applications, and networking) over the internet with pay-as-you-go pricing. Instead of purchasing and maintaining physical servers and data centers, organizations rent computing capacity from cloud providers or deploy automated private clouds.

#### 2. What is Virtualization?
**Answer:** Virtualization is the foundational technology enabling cloud computing. It abstracts physical computer hardware (CPU, memory, storage, and I/O) using a software layer called a hypervisor, allowing multiple isolated virtual computing environments (virtual machines) to run concurrently on a single physical host machine.

#### 3. What is a Virtual Machine (VM)?
**Answer:** A virtual machine is an isolated software computer that executes its own operating system (Guest OS) and user applications, identical to a physical machine. Each VM is allocated a defined quota of virtual CPUs (vCPUs), RAM, and virtual block storage from the underlying physical server.

#### 4. What is a Hypervisor (VMM)?
**Answer:** A Hypervisor, or Virtual Machine Monitor (VMM), is the low-level firmware or software responsible for allocating physical resources and maintaining memory isolation between tenant VMs.
- **Type-1 (Bare-Metal):** Runs directly on physical hardware without a host OS (e.g., VMware ESXi, KVM, Xen).
- **Type-2 (Hosted):** Runs on top of a conventional host operating system (e.g., Oracle VirtualBox, VMware Workstation).

#### 5. What is Load Balancing in Cloud Data Centers?
**Answer:** Load balancing is the systematic redistribution of computational workloads and virtual machines across physical servers to prevent any single host from becoming an overloaded bottleneck while ensuring other servers do not remain underutilized.

#### 6. Why is Load Balancing required?
**Answer:** Without active load balancing:
1. Physical hosts develop thermal and compute "hotspots" (CPU > 80%, RAM > 85%), degrading application throughput and triggering SLA violations.
2. Underutilized hosts waste idle electricity.
3. Unbalanced hardware faces elevated thermal fatigue and premature component failure.

#### 7. What is Virtual Machine Migration?
**Answer:** VM migration is the process of moving an active or configured virtual machine from a source physical host to a destination physical host across a high-speed data center network without losing data or disrupting client network connections.

#### 8. What is Live Migration?
**Answer:** Live migration transfers a powered-on virtual machine between hosts with near-zero perceived service interruption (downtime < 200 ms). It iteratively copies memory pages over the network while the VM continues running (the pre-copy phase), followed by a brief stop-and-copy pause where modified (dirty) pages and CPU registers are committed.

#### 9. What is Cold Migration?
**Answer:** Cold migration suspends or shuts down the virtual machine completely on the source host, moves its memory footprint and disk references to the target host, and boots the VM afresh. The downtime equals the full duration of the file transfer (typically several seconds to minutes).

#### 10. What is Fault Tolerance in Cloud Computing?
**Answer:** Fault tolerance is the capability of a cloud system to sustain hardware or software failures (such as a physical blade crash or power supply loss) without catastrophic data loss or prolonged application outage. In this project, fault tolerance is assured by rapid emergency evacuation and recovery placement on surviving cluster nodes.

#### 11. What is the difference between Fault Tolerance and Disaster Recovery?
**Answer:**
- **Fault Tolerance:** Proactive or immediate automated survival of localized hardware crashes within an operational cluster (measured in seconds or milliseconds).
- **Disaster Recovery:** Broad operational workflows and offsite backups designed to restore entire facilities after regional disasters (earthquakes, power grid collapse) over hours or days.

#### 12. How is an overloaded physical host detected in this project?
**Answer:** The simulator calculates host utilization at every simulation step:
- **CPU Overload:** $\text{CPU Utilization} \ge 80\%$ (configurable).
- **RAM Overload:** $\text{RAM Utilization} \ge 85\%$ (configurable).
- **Warning State:** Triggered when load is within 10% of overload thresholds.

#### 13. How does the First Fit (FF) algorithm work?
**Answer:** First Fit evaluates physical hosts in sequential order ($H_1, H_2, \dots, H_n$) and selects the very first healthy node that possesses sufficient free CPU cores, RAM, and storage headroom to accommodate the candidate VM without violating the overload threshold. It operates in $O(N)$ time with minimal compute complexity.

#### 14. How does the Best Fit (BF) algorithm work?
**Answer:** Best Fit evaluates all candidate healthy hosts and selects the host that minimizes remaining residual capacity ($\text{Slack}$) after the VM is placed. This tightly packs VMs into fewer hosts, leaving larger contiguous blocks of unfragmented capacity on other servers.

#### 15. How does the Least Loaded (LL) algorithm work?
**Answer:** Least Loaded calculates a multi-resource normalized objective score:
$$\text{Load Score} = (0.5 \times \text{CPU}\%) + (0.4 \times \text{RAM}\%) + (0.1 \times \text{Storage}\%)$$
The algorithm selects the feasible healthy host with the lowest load score, directly dispersing workloads and minimizing cluster-wide load variance ($\sigma$).

#### 16. How do you select which VM to migrate from an overloaded host?
**Answer:** Resident VMs are evaluated by priority tier (Low priority first, then Medium, then High to protect mission-critical workloads) and CPU contribution. We select an eligible VM whose removal provides meaningful relief to the overloaded host while fitting cleanly into the destination.

#### 17. What happens when a destination host lacks capacity?
**Answer:** The migration engine enforces strict admission validation. If a candidate host lacks the necessary vCPU headroom, RAM, or storage, the placement is rejected. If all cluster hosts lack capacity, the migration is cleanly aborted with an alert. The simulator never invents phantom capacity.

#### 18. What is Migration Downtime and how is it modeled?
**Answer:** Migration downtime is the transient pause window during which the VM ceases execution on the source host and resumes on the target host. In live migration, we model this as an 80–240 ms dirty page flush. In cold migration, downtime equals total transfer time (10–30s). In emergency failure recovery, downtime equals reboot time (5–12s).

#### 19. How is the Migration Success Rate calculated?
**Answer:**
$$\text{Migration Success Rate} = \left( \frac{\text{Successful Migrations}}{\text{Total Completed or Failed Migration Attempts}} \right) \times 100$$
The engine safely handles division by zero when zero migration attempts have occurred, returning 100% or N/A.

#### 20. How do you compare algorithms fairly in the Experiment Lab?
**Answer:** Each experiment benchmark creates an isolated deep clone of the initial cluster state template. This guarantees that all three algorithms (First Fit, Best Fit, Least Loaded) and the static allocation baseline execute against identical starting host states, VM configurations, and synthetic workload seeds without cross-run mutation contamination.

#### 21. Why is this project a simulation rather than a real IaaS deployment?
**Answer:** Provisioning 6 to 10 real bare-metal cloud compute instances on AWS or Azure costs hundreds of dollars in hourly compute fees, requires credit cards, and introduces nondeterministic network jitter during academic viva exams. Our browser-based simulation models the mathematical algorithms with complete fidelity, zero financial cost, and 100% reproducible execution.

#### 22. What role does Cloudflare Pages play in this project?
**Answer:** Cloudflare Pages is the hosting platform for the compiled web application (HTML/CSS/TypeScript). It delivers the static application globally via edge CDN. Cloudflare Pages does NOT provision VMs or act as a cloud hypervisor; all infrastructure modeling occurs purely client-side in browser RAM.

#### 23. Why are there no AWS EC2 instances or remote databases created?
**Answer:** To preserve security, zero student expense, and complete transparency. The assessment prompt strictly mandates no external cloud resources, no API credentials, and no secret keys.

#### 24. What are the key limitations of this browser-based simulation?
**Answer:**
1. Hypervisor memory dirtying is modeled mathematically rather than executing kernel-level bitmask page tracking.
2. The network fabric models uniform 10 Gbps Top-of-Rack connectivity without inter-rack spine-leaf packet drops.
3. State resides in browser memory and resets if the user refreshes the page.

#### 25. How could this project be extended to a real cloud environment in future work?
**Answer:** The decision logic (First Fit, Best Fit, Least Loaded) and admission validation engines can be packaged as a REST microservice or integrated into open-source cloud management stacks such as OpenStack Watcher, VMware DRS APIs, or Kubernetes Custom Schedulers.
