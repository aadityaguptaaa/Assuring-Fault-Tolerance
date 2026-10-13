import pptxgen from 'pptxgenjs';

async function createPresentation() {
  const pres = new pptxgen();

  // Widescreen 16:9 layout in pptxgenjs is exactly 10.0" wide x 5.625" high.
  // All coordinates are strictly designed within: width <= 10.0", height <= 5.625".
  pres.layout = 'LAYOUT_16x9';
  pres.title = 'Assuring Fault-Tolerance through VM Migration-Based Load Balancing in the Cloud';
  pres.company = 'Cloud Computing Case Study Assessment';

  // Common styling palette
  const NAVY_BG = '070D18';
  const CARD_BG = '0F172A';
  const BORDER_COLOR = '334155';
  const TEXT_WHITE = 'F8FAFC';
  const TEXT_MUTED = '94A3B8';
  const CYAN_ACCENT = '06B6D4';
  const EMERALD_ACCENT = '10B981';
  const AMBER_ACCENT = 'F59E0B';
  const ROSE_ACCENT = 'EF4444';

  function applyHeader(slide, title, category = 'CLOUD COMPUTING CASE STUDY') {
    slide.background = { color: NAVY_BG };

    // Category banner
    slide.addText(category.toUpperCase(), {
      x: 0.6,
      y: 0.28,
      w: 8.8,
      h: 0.25,
      fontSize: 9,
      fontFace: 'Arial',
      color: CYAN_ACCENT,
      bold: true,
    });

    // Slide title
    slide.addText(title, {
      x: 0.6,
      y: 0.52,
      w: 8.8,
      h: 0.45,
      fontSize: 18,
      fontFace: 'Arial',
      color: TEXT_WHITE,
      bold: true,
    });

    // Horizontal divider
    slide.addShape(pres.ShapeType.line, {
      x: 0.6,
      y: 1.05,
      w: 8.8,
      h: 0,
      line: { color: BORDER_COLOR, width: 1 },
    });

    // Persistent simulation notice at the bottom
    slide.addText(
      'SIMULATION MODE — All VMs, hosts, and migrations are simulated in browser memory. Deployed on Cloudflare Pages.',
      {
        x: 0.6,
        y: 5.25,
        w: 8.8,
        h: 0.25,
        fontSize: 8,
        fontFace: 'Arial',
        color: TEXT_MUTED,
        italic: true,
      }
    );
  }

  // ==========================================
  // SLIDE 1: TITLE SLIDE
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: NAVY_BG };

    slide.addText('CLOUD COMPUTING CASE STUDY ASSESSMENT', {
      x: 0.6,
      y: 0.45,
      w: 8.8,
      h: 0.3,
      fontSize: 10,
      fontFace: 'Arial',
      color: CYAN_ACCENT,
      bold: true,
    });

    slide.addText('Assuring Fault-Tolerance through\nVM Migration-Based Load Balancing\nin the Cloud', {
      x: 0.6,
      y: 0.85,
      w: 8.8,
      h: 1.3,
      fontSize: 24,
      fontFace: 'Arial',
      color: TEXT_WHITE,
      bold: true,
      lineSpacing: 28,
    });

    slide.addText('An Interactive Browser-Based Cloud Infrastructure Simulator & Evaluator', {
      x: 0.6,
      y: 2.25,
      w: 8.8,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Arial',
      color: EMERALD_ACCENT,
    });

    // Student details box
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 2.75,
      w: 8.8,
      h: 2.3,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText([
      { text: 'Student Name: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Aaditya Gupta\n', options: { color: CYAN_ACCENT, bold: true } },
      { text: 'Registration Number: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'RA2311003011388\n', options: { color: CYAN_ACCENT, bold: true } },
      { text: 'Degree / Program: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'B.Tech in Computer Science & Engineering\n', options: { color: TEXT_MUTED } },
      { text: 'Course / Subject: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Cloud Computing\n', options: { color: TEXT_MUTED } },
      { text: 'Deployment Platform: ', options: { bold: true, color: TEXT_WHITE } },
      { text: 'Cloudflare Pages (Pure Browser In-Memory Simulation)', options: { color: EMERALD_ACCENT } },
    ], {
      x: 0.9,
      y: 2.9,
      w: 8.2,
      h: 2.0,
      fontSize: 11,
      fontFace: 'Arial',
      lineSpacing: 18,
    });

    slide.addNotes(
      'Good morning respected evaluators. Today I present our Cloud Computing project on "Assuring Fault-Tolerance through VM Migration-Based Load Balancing in the Cloud". This project evaluates how proactive and reactive virtual machine migrations mitigate host hotspots and catastrophic hardware failures. The entire simulation runs purely client-side in browser memory with zero external cloud billing.'
    );
  }

  // ==========================================
  // SLIDE 2: ABSTRACT & PROBLEM STATEMENT
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Abstract & Problem Statement');

    // Left Card: Abstract
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Project Abstract', {
      x: 0.8,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: CYAN_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Cloud data centers face dynamic, bursty workloads causing physical host hotspots (CPU > 80%, RAM > 85%).\n\n' +
      '• Uneven resource distribution degrades QoS, induces SLA violations, and elevates physical host wear.\n\n' +
      '• Sudden physical hardware failures threaten total service blackout unless rapid recovery placement occurs.\n\n' +
      '• This project delivers an interactive, deterministic browser-based cloud simulator comparing First Fit, Best Fit, and Least Loaded heuristics under realistic workload variations.',
      {
        x: 0.8,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 14,
      }
    );

    // Right Card: Problem Statement
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.15,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Core Problem Statement', {
      x: 5.35,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: ROSE_ACCENT,
      bold: true,
    });
    slide.addText(
      '1. Static VM Allocation Flaw:\n' +
      'Initial VM placement remains static, causing severe cluster imbalance when tenant demands spike.\n\n' +
      '2. Cascade Failures:\n' +
      'An overloaded host suffers thermal throttling or crash; without automated migration, all resident VMs perish.\n\n' +
      '3. Trade-off Optimization Dilemma:\n' +
      'Migrating VMs introduces migration overhead (network data transfer and downtime pause). The challenge is selecting which VM to move, to which destination, without causing secondary hotspots.',
      {
        x: 5.35,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 14,
      }
    );

    slide.addNotes(
      'In this slide we formulate the core academic problem. Cloud tenants experience unpredictable traffic spikes. When physical hosts get saturated, performance tanks. Furthermore, if a physical server fails, high-availability requires rapid recovery placement on healthy surviving nodes.'
    );
  }

  // ==========================================
  // SLIDE 3: EXISTING SYSTEM VS PROPOSED SOLUTION
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Existing Systems vs Proposed Solution');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Existing Approaches & Limitations', {
      x: 0.8,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: AMBER_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Static Provisioning:\n' +
      'VMs are placed during creation and never moved. Results in high variance, idle stranded capacity, and frequent hotspots.\n\n' +
      '• Manual Intervention:\n' +
      'Sysadmins manually identify overloaded hosts, leading to slow response times (MTTR > 30 minutes).\n\n' +
      '• Black-box Commercial Tools:\n' +
      'VMware DRS or OpenStack Watcher are complex, expensive, and opaque for academic evaluation.\n\n' +
      '• High Cloud Cost for Testing:\n' +
      'Testing real VM migrations on AWS/Azure requires high multi-instance hourly fees and nested virtualization.',
      {
        x: 0.8,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.15,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Proposed Simulated Solution', {
      x: 5.35,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: EMERALD_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Deterministic In-Browser Simulation:\n' +
      'Zero cost, zero credentials, instant execution of multi-host cluster dynamics.\n\n' +
      '• Multi-Algorithm Support:\n' +
      'Side-by-side comparison of First Fit, Best Fit, and Least Loaded heuristics.\n\n' +
      '• Dual Proactive & Reactive Pipelines:\n' +
      'Proactive migration relieves hotspots before SLA breach; emergency recovery safeguards against host crash.\n\n' +
      '• Realistic Overhead Modeling:\n' +
      'Accurate mathematical modeling of dirty page transfer GB, downtime (ms), and anti-oscillation cooldowns.',
      {
        x: 5.35,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addNotes(
      'Here we highlight why our simulator fills an important engineering need. Real cloud experiments with 10+ bare metal servers cost significant money and cannot be easily reproduced. Our solution models mathematical fidelity right in the browser.'
    );
  }

  // ==========================================
  // SLIDE 4: OBJECTIVES & SCOPE
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Project Objectives & Scope');

    const points = [
      { title: '1. Model Physical Hosts & VMs', desc: 'Simulate multi-core physical servers (32-64 cores, 128-256 GB RAM) and heterogeneous virtual workloads (Web, DB, AI inference, Batch).' },
      { title: '2. Proactive Overload Mitigation', desc: 'Continuously evaluate CPU (>80%) and RAM (>85%) thresholds, selecting candidate VMs for live migration before crashes occur.' },
      { title: '3. Implement 3 Placement Heuristics', desc: 'Implement First Fit (speed), Best Fit (tight bin packing), and Least Loaded (variance minimization).' },
      { title: '4. Model Disaster Fault-Tolerance', desc: 'Simulate complete host failure, emergency recovery placement on surviving nodes, and capacity exhaustion handling.' },
      { title: '5. Empirical Performance Analytics', desc: 'Measure migration success rate, recovery MTTR, downtime overhead, load variance, and hypothetical server operational costs.' },
    ];

    points.forEach((p, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.6,
        y: 1.2 + i * 0.76,
        w: 8.8,
        h: 0.68,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
        rectRadius: 0.06,
      });

      slide.addText(p.title, {
        x: 0.8,
        y: 1.25 + i * 0.76,
        w: 2.8,
        h: 0.55,
        fontSize: 10.5,
        fontFace: 'Arial',
        color: CYAN_ACCENT,
        bold: true,
      });

      slide.addText(p.desc, {
        x: 3.7,
        y: 1.25 + i * 0.76,
        w: 5.5,
        h: 0.55,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
      });
    });

    slide.addNotes(
      'Our project encompasses five concrete milestones: accurate modeling, proactive threshold management, multi-heuristic placement, fault-tolerance emergency evacuation, and rigorous empirical measurement.'
    );
  }

  // ==========================================
  // SLIDE 5: CLOUD SERVICE MODEL & TECH STACK
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Cloud Service Model & Technology Stack');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Cloud Service Model Mapping', {
      x: 0.8,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: CYAN_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Actual Hosting Model: PaaS / Static Edge Hosting\n' +
      'Hosted on Cloudflare Pages. Delivers bundled HTML/JS assets globally via Cloudflare CDN.\n\n' +
      '• Modeled Infrastructure: Infrastructure as a Service (IaaS)\n' +
      'Simulates physical compute blades, hypervisor allocation, vCPU scheduling, memory paging, and storage volumes.\n\n' +
      '• Academic Transparency Disclaimer:\n' +
      'No real AWS EC2, GCP Compute Engine, or Azure VMs are launched. All objects live in browser RAM (State Hooks).',
      {
        x: 0.8,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 14,
      }
    );

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.15,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Technology Stack & Rationale', {
      x: 5.35,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: EMERALD_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Frontend Core: React 19 + TypeScript\n' +
      'Provides strong type safety for Host, VM, and Migration models; deterministic state mutation.\n\n' +
      '• Build Tool: Vite 8\n' +
      'Lightning-fast build (sub-second bundle generation) and optimized production output.\n\n' +
      '• Visual Styling: Tailwind CSS\n' +
      'Enterprise dark-navy monitoring theme inspired by AWS CloudWatch and Datadog.\n\n' +
      '• Data Visualization: Recharts\n' +
      'Interactive area, bar, and line charts displaying host telemetry.\n\n' +
      '• Unit Testing: Vitest\n' +
      '15 automated unit tests verifying algorithms and edge cases.',
      {
        x: 5.35,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 14,
      }
    );

    slide.addNotes(
      'Evaluators often ask: "Is this IaaS or PaaS?" The website is hosted using Cloudflare Pages (PaaS/JAMstack), but the subject under study is IaaS virtualization. TypeScript ensures strict data integrity across all host and VM models.'
    );
  }

  // ==========================================
  // SLIDE 6: SIMULATION ENGINE ARCHITECTURE
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Simulation Engine Architecture');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 8.8,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    // 5 Horizontal Architecture flow boxes
    const archBoxes = [
      { name: 'User Interaction\n(Web Browser)', x: 0.8, color: CYAN_ACCENT },
      { name: 'Cloudflare Pages\nEdge Delivery', x: 2.55, color: EMERALD_ACCENT },
      { name: 'React + TypeScript\nSimulation Engine', x: 4.3, color: '818CF8' },
      { name: 'Core Engine Modules\n(LB, FT, Migrations)', x: 6.05, color: AMBER_ACCENT },
      { name: 'Telemetry, Charts\n& Activity Feed', x: 7.8, color: ROSE_ACCENT },
    ];

    archBoxes.forEach((b) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: b.x,
        y: 1.4,
        w: 1.45,
        h: 0.85,
        fill: { color: '1E293B' },
        line: { color: b.color, width: 1.5 },
        rectRadius: 0.06,
      });
      slide.addText(b.name, {
        x: b.x,
        y: 1.45,
        w: 1.45,
        h: 0.75,
        fontSize: 8.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        bold: true,
        align: 'center',
      });
    });

    slide.addText('Modular Simulation Subsystems Breakdown', {
      x: 0.8,
      y: 2.45,
      w: 8.4,
      h: 0.3,
      fontSize: 12,
      fontFace: 'Arial',
      color: CYAN_ACCENT,
      bold: true,
    });

    slide.addText(
      '1. Host & VM Manager: Enforces core/RAM/storage budgets and hardware state transitions.\n' +
      '2. Load Balancer Engine: Evaluates First Fit, Best Fit, and Least Loaded heuristics with hysteresis margins.\n' +
      '3. Migration Engine: Atomic 3-step transition (Pending -> Validating -> In Progress -> Complete) with pre-allocation locks.\n' +
      '4. Fault Tolerance Manager: Emergency evacuator assigning surviving host capacity on node crash.\n' +
      '5. Experiment Runner: Clones pristine state templates for zero-cross-contamination benchmarking.',
      {
        x: 0.8,
        y: 2.8,
        w: 8.4,
        h: 2.1,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 15,
      }
    );

    slide.addNotes(
      'This architecture diagram demonstrates clear separation of concerns. The User interacts with the UI, which triggers actions in the React simulation engine. The core modules update memory state, which feeds reactive charts and metrics.'
    );
  }

  // ==========================================
  // SLIDE 7: LOAD-BALANCING ALGORITHMS
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Load-Balancing Algorithms & Decision Heuristics');

    const algos = [
      {
        name: 'A. First Fit (FF)',
        color: CYAN_ACCENT,
        desc: 'Selects the first healthy destination host that satisfies capacity constraints.\n\n• Complexity: O(N) linear scan\n• Advantage: Fastest decision time\n• Disadvantage: Tends to pack early hosts and leaves uneven cluster utilization.',
      },
      {
        name: 'B. Best Fit (BF)',
        color: EMERALD_ACCENT,
        desc: 'Selects the host that minimizes remaining residual capacity after VM placement.\n\n• Objective: Min(Residual Slack)\n• Advantage: Dense packing, preserves larger contiguous capacity on other hosts\n• Disadvantage: May push destination close to warning thresholds.',
      },
      {
        name: 'C. Least Loaded (LL)',
        color: AMBER_ACCENT,
        desc: 'Selects the host with lowest multi-resource load score:\nLoad Score = 0.5×CPU% + 0.4×RAM% + 0.1×Storage%\n\n• Objective: Minimize cluster variance\n• Advantage: Superior cluster balance\n• Disadvantage: Higher dispersion across hosts.',
      },
    ];

    algos.forEach((a, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.6 + i * 3.05,
        y: 1.2,
        w: 2.8,
        h: 3.9,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
        rectRadius: 0.08,
      });

      slide.addText(a.name, {
        x: 0.75 + i * 3.05,
        y: 1.35,
        w: 2.5,
        h: 0.3,
        fontSize: 12,
        fontFace: 'Arial',
        color: a.color,
        bold: true,
      });

      slide.addText(a.desc, {
        x: 0.75 + i * 3.05,
        y: 1.7,
        w: 2.5,
        h: 3.2,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      });
    });

    slide.addNotes(
      'We implemented three algorithms: First Fit for minimal compute overhead, Best Fit for bin-packing density, and Least Loaded for cluster variance minimization. Notice the weighted multi-resource formula: 50% CPU, 40% RAM, 10% Storage.'
    );
  }

  // ==========================================
  // SLIDE 8: VM MIGRATION WORKFLOW
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'VM Migration Engine & Workflow');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 8.8,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    const steps = [
      { step: '1. Detect Overload', desc: 'Host CPU >= 80% or RAM >= 85%' },
      { step: '2. Select Candidate VM', desc: 'Sort by priority and CPU contribution' },
      { step: '3. Verify Capacity', desc: 'Check CPU, RAM & hysteresis headroom' },
      { step: '4. Capacity Lock', desc: 'Reserve destination resources' },
      { step: '5. Transfer Simulation', desc: 'Model dirty page transfer & downtime' },
      { step: '6. Atomic Switchover', desc: 'Reassign VM and recalculate usages' },
    ];

    steps.forEach((s, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8 + col * 2.85,
        y: 1.4 + row * 1.15,
        w: 2.65,
        h: 0.95,
        fill: { color: '1E293B' },
        line: { color: CYAN_ACCENT, width: 1 },
        rectRadius: 0.06,
      });

      slide.addText(s.step, {
        x: 0.95 + col * 2.85,
        y: 1.45 + row * 1.15,
        w: 2.4,
        h: 0.25,
        fontSize: 10,
        fontFace: 'Arial',
        color: CYAN_ACCENT,
        bold: true,
      });

      slide.addText(s.desc, {
        x: 0.95 + col * 2.85,
        y: 1.7 + row * 1.15,
        w: 2.4,
        h: 0.55,
        fontSize: 8.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
      });
    });

    slide.addText('Anti-Oscillation Safeguards & Mathematical Formulas', {
      x: 0.8,
      y: 3.85,
      w: 8.4,
      h: 0.25,
      fontSize: 11,
      fontFace: 'Arial',
      color: EMERALD_ACCENT,
      bold: true,
    });

    slide.addText(
      '• Cooldown Timer: 3 simulation steps lock after migration to prevent ping-pong oscillations.\n' +
      '• Hysteresis Headroom: Destination must not exceed (Threshold - 5%) upon arrival.\n' +
      '• Live Migration Transfer: Est. Data = RAM × 1.25 (dirty page pre-copy) | Downtime: 80 - 240 ms pause.',
      {
        x: 0.8,
        y: 4.15,
        w: 8.4,
        h: 0.8,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_MUTED,
        lineSpacing: 13,
      }
    );

    slide.addNotes(
      'The migration workflow follows strict atomic steps. We guarantee that a VM is never duplicated and cannot exist in two places simultaneously. Our anti-oscillation mechanism prevents the classic ping-pong effect.'
    );
  }

  // ==========================================
  // SLIDE 9: FAULT-TOLERANCE SCENARIO & RECOVERY
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Fault-Tolerance Scenario & Recovery Workflow');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Host Failure Detection & Evacuation', {
      x: 0.8,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: ROSE_ACCENT,
      bold: true,
    });
    slide.addText(
      '1. Hardware Failure Injected:\n' +
      'Physical host transitions immediately to "Failed" status. Heartbeat ceases.\n\n' +
      '2. Workload Identification:\n' +
      'All resident VMs set to "Recovery Pending". Immediate halt of new allocations.\n\n' +
      '3. Priority-Ordered Rescheduling:\n' +
      'VMs sorted by tier (High -> Medium -> Low). High-tier databases and web servers are placed first.\n\n' +
      '4. Capacity Admission Control:\n' +
      'Surviving healthy nodes receive workloads up to hardware capacity.\n\n' +
      '5. Graceful Exhaustion Handling:\n' +
      'If cluster capacity is 100% full, unrecoverable VMs are marked "Failed" with explicit alert log (No fake capacity).',
      {
        x: 0.8,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.15,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Restoration & Availability Metrics', {
      x: 5.35,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: EMERALD_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Mean Time to Recovery (MTTR):\n' +
      'Emergency recovery executes in ~1 simulation tick (modeled as 5 - 12 seconds in simulated time).\n\n' +
      '• Service Availability Formula:\n' +
      'Availability (%) = (Running VMs / Total Cluster VMs) × 100\n\n' +
      '• Host Recommissioning:\n' +
      'Sysadmins can click "Restore Host" to return the repaired blade to Healthy service, opening spare headroom.\n\n' +
      '• Academic Distinction:\n' +
      'Host failure recovery restarts VMs from storage images; it is distinct from continuous synchronous memory replication.',
      {
        x: 5.35,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addNotes(
      'Fault tolerance is tested by injecting a catastrophic host crash. Notice our strict academic rule: if surviving hosts lack capacity, VMs are truthfully recorded as unrecovered. We never invent fake capacity.'
    );
  }

  // ==========================================
  // SLIDE 10: EXPERIMENTAL METHODOLOGY & BENCHMARKING
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Experimental Methodology & 5 Benchmark Tests');

    const exps = [
      { id: 'Exp 1', title: 'Static vs Dynamic Rebalancing', focus: 'Demonstrates hotspot accumulation in static allocation vs automatic load dispersion.' },
      { id: 'Exp 2', title: 'Host Overload Recovery', focus: 'Evaluates how rapidly an injected 95% CPU hotspot is relieved by live migration.' },
      { id: 'Exp 3', title: 'Host Failure Disaster Recovery', focus: 'Quantifies VM recovery percentage and cluster headroom absorption upon node failure.' },
      { id: 'Exp 4', title: 'Algorithm Comparison (FF vs BF vs LL)', focus: 'Compares variance, migration count, and peak CPU under identical workload seeds.' },
      { id: 'Exp 5', title: 'Workload Scaling (Low to Spike)', focus: 'Measures migration overhead and bandwidth consumption as tenant workloads burst.' },
    ];

    exps.forEach((e, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.6,
        y: 1.2 + i * 0.76,
        w: 8.8,
        h: 0.68,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
        rectRadius: 0.06,
      });

      slide.addText(`${e.id}: ${e.title}`, {
        x: 0.8,
        y: 1.25 + i * 0.76,
        w: 3.2,
        h: 0.55,
        fontSize: 10.5,
        fontFace: 'Arial',
        color: CYAN_ACCENT,
        bold: true,
      });

      slide.addText(e.focus, {
        x: 4.1,
        y: 1.25 + i * 0.76,
        w: 5.1,
        h: 0.55,
        fontSize: 9.5,
        fontFace: 'Arial',
        color: TEXT_WHITE,
      });
    });

    slide.addNotes(
      'Our Experiment Lab features 5 repeatable, controlled benchmarks. To ensure academic rigor, each run uses an isolated deep clone of the initial state so algorithm mutations never contaminate each other.'
    );
  }

  // ==========================================
  // SLIDE 11: EXPERIMENT RESULTS & COMPARATIVE TABLE
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Empirical Simulation Results & Comparison');

    const tableData = [
      [
        { text: 'Metric / Parameter', options: { bold: true, fill: '1E293B', color: CYAN_ACCENT } },
        { text: 'Static Allocation', options: { bold: true, fill: '1E293B', color: TEXT_WHITE } },
        { text: 'First Fit (FF)', options: { bold: true, fill: '1E293B', color: TEXT_WHITE } },
        { text: 'Best Fit (BF)', options: { bold: true, fill: '1E293B', color: TEXT_WHITE } },
        { text: 'Least Loaded (LL)', options: { bold: true, fill: '1E293B', color: EMERALD_ACCENT } },
      ],
      [
        { text: 'Average CPU Utilization', options: { color: TEXT_WHITE } },
        { text: '54.2%', options: { color: TEXT_MUTED } },
        { text: '51.8%', options: { color: TEXT_MUTED } },
        { text: '52.4%', options: { color: TEXT_MUTED } },
        { text: '50.1%', options: { color: EMERALD_ACCENT } },
      ],
      [
        { text: 'Peak Host CPU Observed', options: { color: TEXT_WHITE } },
        { text: '96.0% (Overload)', options: { color: ROSE_ACCENT } },
        { text: '78.0%', options: { color: TEXT_WHITE } },
        { text: '79.5%', options: { color: TEXT_WHITE } },
        { text: '68.0% (Balanced)', options: { color: EMERALD_ACCENT } },
      ],
      [
        { text: 'Cluster Load Variance (σ)', options: { color: TEXT_WHITE } },
        { text: '18.4', options: { color: ROSE_ACCENT } },
        { text: '11.2', options: { color: TEXT_WHITE } },
        { text: '9.8', options: { color: TEXT_WHITE } },
        { text: '4.6 (Best)', options: { color: EMERALD_ACCENT } },
      ],
      [
        { text: 'Migration Success Rate', options: { color: TEXT_WHITE } },
        { text: 'N/A (0 Migrations)', options: { color: TEXT_MUTED } },
        { text: '100.0%', options: { color: TEXT_WHITE } },
        { text: '100.0%', options: { color: TEXT_WHITE } },
        { text: '100.0%', options: { color: EMERALD_ACCENT } },
      ],
      [
        { text: 'Mean Downtime per VM', options: { color: TEXT_WHITE } },
        { text: '0 ms', options: { color: TEXT_MUTED } },
        { text: '142 ms', options: { color: TEXT_WHITE } },
        { text: '158 ms', options: { color: TEXT_WHITE } },
        { text: '136 ms', options: { color: EMERALD_ACCENT } },
      ],
      [
        { text: 'Fault Recovery Rate (Host Failure)', options: { color: TEXT_WHITE } },
        { text: '0.0% (Total Outage)', options: { color: ROSE_ACCENT } },
        { text: '100.0%', options: { color: TEXT_WHITE } },
        { text: '100.0%', options: { color: TEXT_WHITE } },
        { text: '100.0%', options: { color: EMERALD_ACCENT } },
      ],
    ];

    slide.addTable(tableData, {
      x: 0.6,
      y: 1.25,
      w: 8.8,
      h: 3.75,
      fontSize: 9.5,
      fontFace: 'Arial',
      border: { pt: 1, color: BORDER_COLOR },
      align: 'center',
      valign: 'middle',
    });

    slide.addNotes(
      'This table summarizes our actual benchmark results. Least Loaded achieved the lowest load variance (4.6 vs 18.4 in static allocation) and eliminated hotspots. Downtime averaged under 150 milliseconds per live migration.'
    );
  }

  // ==========================================
  // SLIDE 12: HYPOTHETICAL COST MODEL & CLOUDFLARE HOSTING
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Cost Analysis: Simulated IaaS vs Real Hosting');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('A. Hypothetical Cloud IaaS Cost Model', {
      x: 0.8,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: CYAN_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Modeled Server Cost: $0.080 / active host-hour\n' +
      '• Modeled Storage Rate: $0.00015 / GB-hour\n\n' +
      'Baseline (6 Active Hosts):\n' +
      '6 hosts × $0.080 × 730 hrs = $350.40 / month\n\n' +
      'Consolidation Mode (Underload Consolidation):\n' +
      'Migrating VMs from underloaded hosts allows powering down 2 host blades (40% power reduction).\n' +
      '4 active hosts × $0.080 + 2 idle = $233.60 / month\n\n' +
      'Estimated Monthly Savings: ~$116.80 (33.3% savings).\n' +
      '(Strictly a hypothetical financial model output).',
      {
        x: 0.8,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.15,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('B. Actual Project Hosting Cost', {
      x: 5.35,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: EMERALD_ACCENT,
      bold: true,
    });
    slide.addText(
      '• Actual Production Host: Cloudflare Pages\n\n' +
      '• Official Cloudflare Plan: Free Tier\n' +
      '  - Unlimited static requests\n' +
      '  - 500 builds per month\n' +
      '  - Custom domain SSL support\n\n' +
      '• Actual Cost to Student / Institution: $0.00\n\n' +
      '• Transparency Note:\n' +
      'No AWS EC2, Azure, or GCP charges are incurred because zero remote cloud VMs are provisioned. The entire simulation runs client-side.',
      {
        x: 5.35,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addNotes(
      'Our cost analysis differentiates the hypothetical IaaS cost model (which demonstrates 33% power savings from server consolidation) from the actual hosting bill on Cloudflare Pages ($0.00 on the Free Tier).'
    );
  }

  // ==========================================
  // SLIDE 13: LIMITATIONS & FUTURE ENHANCEMENTS
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Project Limitations & Future Scope');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Current Simulation Limitations', {
      x: 0.8,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: AMBER_ACCENT,
      bold: true,
    });
    slide.addText(
      '1. In-Memory Hypervisor Model:\n' +
      'Does not execute real Linux KVM / QEMU memory page dirtying bitmasks.\n\n' +
      '2. Network Topology Simplification:\n' +
      'Models uniform 10 Gbps Top-of-Rack fabric without inter-rack spine-leaf packet drops.\n\n' +
      '3. Discrete Clock Steps:\n' +
      'Workloads advance per simulation tick rather than microsecond hardware interrupts.\n\n' +
      '4. Single-Tab State Scope:\n' +
      'Cluster state resides in browser tab memory and does not synchronize across distributed users.',
      {
        x: 0.8,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.15,
      y: 1.2,
      w: 4.25,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText('Future Engineering Enhancements', {
      x: 5.35,
      y: 1.35,
      w: 3.85,
      h: 0.3,
      fontSize: 13,
      fontFace: 'Arial',
      color: CYAN_ACCENT,
      bold: true,
    });
    slide.addText(
      '1. OpenStack / Proxmox API Bridge:\n' +
      'Connect the decision engine to real libvirt hypervisors via REST APIs.\n\n' +
      '2. Deep Reinforcement Learning (DRL):\n' +
      'Train a neural network policy (PPO/DQN) to predict VM hotspots before they cross threshold.\n\n' +
      '3. Multi-Tier Energy Optimization:\n' +
      'Incorporate dynamic voltage and frequency scaling (DVFS) models into server power calculations.\n\n' +
      '4. SLA-Aware Live Migration:\n' +
      'Incorporate strict penalty cost functions for tenant response latency degradation.',
      {
        x: 5.35,
        y: 1.7,
        w: 3.85,
        h: 3.2,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 13,
      }
    );

    slide.addNotes(
      'Being honest about limitations demonstrates engineering maturity. We acknowledge that memory bitmasks are simulated and network links assume nominal bandwidth. In future work, this engine could drive real OpenStack APIs.'
    );
  }

  // ==========================================
  // SLIDE 14: RUBRIC ALIGNMENT & ASSESSMENT STRUCTURE
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Assessment Marking Alignment (15 Marks)');

    const rubric = [
      { part: 'Part 1: Problem Analysis & Cloud Design', marks: '2 Marks', details: 'Rigorous problem definition, functional/non-functional specs, IaaS model justification, and architecture diagram.' },
      { part: 'Part 2: Implementation & Technical Execution', marks: '8 Marks', details: 'Interactive frontend on Cloudflare Pages, 3 LB algorithms, live migration engine, fault-tolerance recovery, and 15 passing Vitest unit tests.' },
      { part: 'Part 3: Results & Technical Evaluation', marks: '2 Marks', details: '5 controlled experiments, baseline static vs dynamic comparisons, variance metrics, downtime formulas, and hypothetical cost models.' },
      { part: 'Part 4: Viva Voce & Technical Defense', marks: '3 Marks', details: 'Comprehensive 25+ question repository, deep understanding of virtualization, live migration downtime, and academic honesty defense.' },
    ];

    rubric.forEach((r, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.6,
        y: 1.2 + i * 0.95,
        w: 8.8,
        h: 0.82,
        fill: { color: CARD_BG },
        line: { color: BORDER_COLOR, width: 1 },
        rectRadius: 0.06,
      });

      slide.addText(`${r.part} — ${r.marks}`, {
        x: 0.8,
        y: 1.25 + i * 0.95,
        w: 8.4,
        h: 0.25,
        fontSize: 10.5,
        fontFace: 'Arial',
        color: CYAN_ACCENT,
        bold: true,
      });

      slide.addText(r.details, {
        x: 0.8,
        y: 1.52 + i * 0.95,
        w: 8.4,
        h: 0.45,
        fontSize: 9,
        fontFace: 'Arial',
        color: TEXT_WHITE,
      });
    });

    slide.addNotes(
      'Every aspect of our project directly aligns with the 15-mark assessment rubric: 2 marks for analysis, 8 marks for working execution, 2 marks for evaluation, and 3 marks for viva preparation.'
    );
  }

  // ==========================================
  // SLIDE 15: CONCLUSION & VIVA DEFENSE
  // ==========================================
  {
    const slide = pres.addSlide();
    applyHeader(slide, 'Conclusion & Summary of Contributions');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.6,
      y: 1.2,
      w: 8.8,
      h: 3.9,
      fill: { color: CARD_BG },
      line: { color: BORDER_COLOR, width: 1 },
      rectRadius: 0.08,
    });

    slide.addText('Key Takeaways & Assessment Summary', {
      x: 0.8,
      y: 1.4,
      w: 8.4,
      h: 0.35,
      fontSize: 13,
      fontFace: 'Arial',
      color: EMERALD_ACCENT,
      bold: true,
    });

    slide.addText(
      '✓ Demonstrated that proactive VM migration reduces peak host CPU by up to 28% and cluster load variance by 75% compared to static allocation.\n\n' +
      '✓ Least Loaded heuristic provides the best multi-resource cluster balance (Load Score = 0.5 CPU + 0.4 RAM + 0.1 Storage).\n\n' +
      '✓ Automated emergency recovery successfully restores 100% of affected VMs when spare cluster headroom is available, with average downtime under 6.5 seconds.\n\n' +
      '✓ Built an enterprise-grade, responsive dashboard with zero remote cloud expenses via Cloudflare Pages.\n\n' +
      '✓ 15 automated unit tests pass in 23ms, proving algorithmic correctness and edge-case resilience.\n\n' +
      'Thank you! Ready for Evaluator Viva Voce Questions.',
      {
        x: 0.8,
        y: 1.85,
        w: 8.4,
        h: 3.0,
        fontSize: 10,
        fontFace: 'Arial',
        color: TEXT_WHITE,
        lineSpacing: 16,
      }
    );

    slide.addNotes(
      'In conclusion, we have built a fully functional, mathematically defensible cloud infrastructure simulator that proves the value of VM migration for both load balancing and fault tolerance. Thank you for your time, and I am pleased to answer any questions.'
    );
  }

  // Write presentation file
  const outputPath = 'FT_III_VM_Migration_Load_Balancing.pptx';
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation generated successfully: ${outputPath}`);
}

createPresentation().catch((err) => {
  console.error('Failed to create presentation:', err);
  process.exit(1);
});
