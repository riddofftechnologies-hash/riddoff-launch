export type RabosModule = {
  id: string;
  title: string;
  short: string;
  problem: string;
  answer: string;
  capabilities: string[];
  outcome: string;
  href: string;
  image?: string;
  imageLabel?: string;
  imageType?: "capture" | "preview";
  badge?: string;
};
export const rabosModules: RabosModule[] = [
  {
    id: "sales", title: "Sales", short: "From enquiry to quotation.",
    problem: "Sales teams lose context between enquiries, estimates and follow-ups.",
    answer: "Give your team a structured view of the sales journey, with work and customer context in one place.",
    capabilities: ["Lead and order visibility", "Quotation workflows", "Activity and follow-up context", "Sales reporting"],
    outcome: "Fewer disconnected handoffs between conversations and commercial decisions.",
    href: "/products/riddoff-erp/sales", image: "/product-visuals/crm-automation.png",
    imageLabel: "Connected customer workflow interface", imageType: "capture",
  },
  {
    id: "crm", title: "CRM", short: "Relationships, in context.",
    problem: "Conversations, lead ownership and customer history become scattered.",
    answer: "Keep customer interactions, pipeline work and repeatable follow-up workflows visible.",
    capabilities: ["Lead workspaces", "Customer records", "Conversation and activity context", "Workflow design and review"],
    outcome: "Better continuity from a first conversation through ongoing relationships.",
    href: "/products/riddoff-erp/crm", image: "/product-visuals/crm-workflow-builder.png",
    imageLabel: "RABOS CRM workflow builder", imageType: "capture",
  },
  {
    id: "inventory", title: "Inventory", short: "Know what is moving.",
    problem: "Stock changes and purchasing needs are difficult to see across teams.",
    answer: "Organize inventory movement and related actions around a shared operational picture.",
    capabilities: ["Stock visibility", "Inventory movement", "Replenishment context", "Cross-module stock workflows"],
    outcome: "More informed stock and fulfilment decisions.",
    href: "/products/riddoff-erp/inventory",
  },
  {
    id: "procurement", title: "Procurement", short: "Purchasing with structure.",
    problem: "Supplier follow-ups and purchasing decisions can be delayed by fragmented records.",
    answer: "Connect purchasing workflows with the material and operational needs behind them.",
    capabilities: ["Supplier records", "Purchasing requests", "Order tracking", "Receiving handoffs"],
    outcome: "Less uncertainty between purchasing decisions and receiving work.",
    href: "/products/riddoff-erp/procurement",
  },
  {
    id: "manufacturing", title: "Manufacturing", short: "From design to the workshop.",
    problem: "Designs, quantities, material needs and shop-floor work are often managed separately.",
    answer: "Build a shared manufacturing workflow around design, costing, quotations and execution.",
    capabilities: ["Design documents and model builder", "BOM and material planning", "Estimates and quotations", "Production order coordination"],
    outcome: "A clearer handoff from design intent to production planning.",
    href: "/products/riddoff-erp/manufacturing",
    image: "/product-visuals/manufacturing-design-editor.png",
    imageLabel: "Manufacturing design editor review capture", imageType: "capture",
    badge: "Vertical-specific rollout",
  },
  {
    id: "accounts", title: "Finance & accounts", short: "Understand the numbers.",
    problem: "Financial decisions suffer when business context and accounting activity are disconnected.",
    answer: "Connect finance-related work to the operational events that inform it.",
    capabilities: ["Accounting workspace", "Receivables context", "Transaction visibility", "Financial reporting"],
    outcome: "A more connected picture of operational and financial work.",
    href: "/products/riddoff-erp/accounts",
  },
  {
    id: "reports", title: "Reporting", short: "Make the next decision clearer.",
    problem: "Useful information is split between different screens and reports.",
    answer: "Surface structured operational reports and drill into where the numbers come from.",
    capabilities: ["Operational reporting", "Production and costing views", "Management context", "Evidence-based analysis direction"],
    outcome: "Less time assembling context before making a decision.",
    href: "/products/riddoff-erp/reports", image: "/product-visuals/manufacturing-reports.png",
    imageLabel: "Manufacturing BOM costing report review capture", imageType: "capture",
  },
  {
    id: "people", title: "People & payroll", short: "Support everyday team operations.",
    problem: "People-related information and administrative work can become fragmented.",
    answer: "Give teams a consistent place for people and payroll processes.",
    capabilities: ["People workspace", "Attendance context", "Payroll-related workflows", "Team coordination"],
    outcome: "Clearer handoffs for important administrative processes.",
    href: "/products/riddoff-erp/hr-payroll",
  },
  {
    id: "tasks", title: "Tasks & workflows", short: "Make ownership visible.",
    problem: "Work gets lost when responsibilities and approvals are spread across tools.",
    answer: "Bring tasks, handoffs and next steps into a consistent operating rhythm.",
    capabilities: ["Task ownership", "Status tracking", "Approval pathways", "Activity context"],
    outcome: "More accountable follow-through across teams.",
    href: "/products/riddoff-erp/task",
  },
];

export const dotRoles = [
  { id: "master", label: "Master Dot", title: "The operator's coordinating layer", role: "Prioritizes requests, gathers context and proposes tasks or decisions for the founder to review.", examples: ["Summarize what needs attention", "Propose a coordinated task", "Prepare an operator decision"] },
  { id: "engineering", label: "Engineering Dot", title: "Product execution coordination", role: "Routes technical tasks to appropriate specialist agents and gathers implementation and validation evidence.", examples: ["Scope a feature", "Coordinate implementation", "Surface test evidence"] },
  { id: "support", label: "Support Dot", title: "A calmer support operation", role: "Helps triage tickets, gather permitted evidence and draft the next response or escalation.", examples: ["Classify a ticket", "Prepare an evidence-backed draft", "Escalate for review"] },
  { id: "operations", label: "Operations Dot", title: "Keep the company moving", role: "Coordinates recurring operational work and tasks under explicit rules and oversight.", examples: ["Check pending handoffs", "Surface blocked work", "Summarize operational progress"] },
] as const;

export const specialistRoles = [
  "Architect", "Backend", "Frontend", "AI / Reasoning", "Database",
  "Quality assurance", "Security", "DevOps / Release", "Support", "Research", "Release reviewer",
];

export const workflowSteps = [
  { label: "01", title: "Tell the Master Dot", description: "The founder sets a goal or raises a request through the control center." },
  { label: "02", title: "Create a governed plan", description: "The system proposes a scope, role assignment, budget and approval boundary." },
  { label: "03", title: "Let specialists work", description: "Authorized agents work through tasks with a registered runner and validation gates." },
  { label: "04", title: "Review the evidence", description: "The founder sees progress, test outcomes and any unresolved risks before accepting delivery." },
  { label: "05", title: "Approve release", description: "A human approves publishing, changing production or taking consequential action." },
] as const;

export const industryProblems = [
  { id: "manufacturing", title: "Manufacturing", pressure: "From design to materials to the shop floor", problem: "Quotations, drawings, material needs and production updates rarely move together.", solution: "RABOS connects model/design information to production-focused workflows, helping teams coordinate estimates, BOMs and shop-floor work.", detail: "Windoor aluminium and Azara tailoring are distinct vertical implementations with separate acceptance requirements.", modules: ["Manufacturing", "Inventory", "Procurement", "Reporting"], image: "/product-visuals/manufacturing-quotations.png" },
  { id: "retail", title: "Retail & distribution", pressure: "From sale to stock to replenishment", problem: "A sale affects inventory, purchasing and fulfilment, but the information often sits in separate places.", solution: "A connected operating view helps staff track activity, stock movement and the next operational handoff.", detail: "Industry workflows and specific integrations depend on the customer's deployment.", modules: ["Sales", "Inventory", "Procurement", "Reports"], image: "/product-visuals/rabos-home-config.png" },
  { id: "services", title: "Services", pressure: "From enquiry to ongoing relationship", problem: "When customers interact across channels, follow-ups and ownership can become unclear.", solution: "CRM and structured workspaces help keep relationship context and pending work organized.", detail: "Automation and messaging capabilities should be confirmed against the current release.", modules: ["CRM", "Sales", "Tasks", "Reporting"], image: "/product-visuals/crm-workflow-builder.png" },
] as const;

export const visualGallery = [
  { src: "/product-visuals/crm-workflow-builder.png", label: "CRM workflow builder", tag: "Interface review capture" },
  { src: "/product-visuals/manufacturing-design-editor.png", label: "Manufacturing design editor", tag: "Interface review capture" },
  { src: "/product-visuals/manufacturing-quotations.png", label: "Manufacturing quotations", tag: "Interface review capture" },
  { src: "/product-visuals/manufacturing-production-orders.png", label: "Production order workspace", tag: "Interface review capture" },
  { src: "/product-visuals/manufacturing-reports.png", label: "BOM costing report", tag: "Interface review capture" },
  { src: "/product-visuals/rabos-home-config.png", label: "Configurable dashboard", tag: "Internal design review" },
] as const;
