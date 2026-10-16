import { useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Layers3 } from "lucide-react";
import "./IndexMinimal.css";

type PreviewTab = "Overview" | "Sales" | "Inventory";
type PreviewItem = { label: string; group: string; status: string };
const previewContent: Record<PreviewTab, { heading: string; description: string; items: PreviewItem[] }> = {
  Overview: {
    heading: "Your work, in focus.",
    description: "A clearer place to see what needs your attention.",
    items: [
      { label: "Review new customer requests", group: "Customer operations", status: "To review" },
      { label: "Check outstanding orders", group: "Sales", status: "In progress" },
      { label: "Confirm stock availability", group: "Inventory", status: "Upcoming" },
    ],
  },
  Sales: {
    heading: "Every conversation counts.",
    description: "Give your team a shared view of the sales process.",
    items: [
      { label: "Review new enquiries", group: "Leads", status: "To review" },
      { label: "Prepare customer quotation", group: "Sales", status: "In progress" },
      { label: "Plan proposal follow-ups", group: "Pipeline", status: "Upcoming" },
    ],
  },
  Inventory: {
    heading: "Know what comes next.",
    description: "Keep important inventory work visible and organized.",
    items: [
      { label: "Check inventory movement", group: "Stock", status: "To review" },
      { label: "Review purchase requirements", group: "Procurement", status: "In progress" },
      { label: "Follow up with suppliers", group: "Purchasing", status: "Upcoming" },
    ],
  },
};

function SectionReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProductPreview() {
  const [active, setActive] = useState<PreviewTab>("Overview");
  const content = previewContent[active];
  return (
    <div className="rm-preview" aria-label="Illustrative RABOS interface preview">
      <div className="rm-preview-top">
        <div className="rm-preview-logo"><span className="rm-preview-logo-mark" aria-hidden="true">r</span> rabos</div>
        <div className="rm-preview-top-right"><span className="rm-preview-connected" aria-hidden="true" /> WORKSPACE PREVIEW</div>
      </div>
      <div className="rm-preview-layout">
        <div className="rm-preview-rail" aria-hidden="true">
          <span className="rm-rail-selected">▦</span>
          <span>◫</span><span>≡</span><span>◈</span>
        </div>
        <div className="rm-preview-body">
          <p className="rm-preview-kicker">WORKSPACE / {active.toUpperCase()}</p>
          <h2>{content.heading}</h2>
          <p className="rm-preview-description">{content.description}</p>
          <div className="rm-preview-tabs" role="tablist" aria-label="Explore RABOS modules">
            {(["Overview", "Sales", "Inventory"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active === tab}
                aria-controls="rm-preview-panel"
                id={`rm-tab-${tab.toLowerCase()}`}
                className={active === tab ? "rm-preview-tab active" : "rm-preview-tab"}
                onClick={() => setActive(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="rm-preview-table" role="tabpanel" id="rm-preview-panel" aria-labelledby={`rm-tab-${active.toLowerCase()}`}>
            <div className="rm-preview-table-header"><span>WORK IN VIEW</span><span>STATUS</span></div>
            {content.items.map((item) => (
              <div className="rm-preview-row" key={item.label}>
                <span className="rm-preview-task-symbol" aria-hidden="true"><Check size={13} strokeWidth={2}/></span>
                <div className="rm-preview-task"><strong>{item.label}</strong><small>{item.group}</small></div>
                <span className={`rm-preview-status ${item.status === "In progress" ? "progress" : ""}`}>{item.status}</span>
              </div>
            ))}
          </div>
          <div className="rm-preview-bottom"><span><span className="rm-preview-bottom-dot" /> A connected place for your operations</span><span>01 / 03</span></div>
        </div>
      </div>
      <div className="rm-preview-disclaimer">Illustrative product concept · Not live customer data</div>
    </div>
  );
}

const pillars = [
  {
    number: "01",
    title: "See the whole picture",
    description: "Bring important information together so your team can see what matters without jumping between disconnected tools.",
  },
  {
    number: "02",
    title: "Keep work moving",
    description: "Make tasks, handoffs and responsibilities easier to follow—from the first request to the next decision.",
  },
  {
    number: "03",
    title: "Build with confidence",
    description: "Create more consistent ways of working, with human oversight where decisions and approvals matter.",
  },
];

const operatingAreas = [
  { number: "01", title: "Customer relationships", description: "Keep conversations, enquiries and follow-ups in context." },
  { number: "02", title: "Sales & operations", description: "Make connected work visible from planning to execution." },
  { number: "03", title: "Inventory & procurement", description: "Understand stock activity and coordinate what happens next." },
  { number: "04", title: "Business intelligence", description: "Turn scattered operational information into clearer decisions." },
];

const IndexMinimal = () => (
  <div className="rm-home">
    <section className="rm-hero" aria-labelledby="rm-hero-heading">
      <div className="rm-wrap rm-hero-grid">
        <div className="rm-hero-content">
          <div className="rm-eyebrow"><span className="rm-eyebrow-line" /> INTRODUCING RABOS</div>
          <h1 id="rm-hero-heading">A clearer way<br/>to run your <span>business.</span></h1>
          <p className="rm-hero-lead">Good business needs good systems.</p>
          <p className="rm-hero-description">Meet RABOS, the business operating system from Riddoff. A more thoughtful way to bring your people, information and daily operations together.</p>
          <div className="rm-actions">
            <Link className="rm-btn rm-btn-primary" to="/products/riddoff-erp">Explore RABOS <ArrowUpRight size={17} aria-hidden="true"/></Link>
            <Link className="rm-btn rm-btn-secondary" to="/contact">Book a conversation <ArrowRight size={17} aria-hidden="true"/></Link>
          </div>
        </div>
        <SectionReveal className="rm-hero-preview"><ProductPreview /></SectionReveal>
      </div>
      <div className="rm-wrap rm-hero-meta"><span>RIDDOFF TECHNOLOGIES</span><span>BUSINESS SYSTEMS, SIMPLIFIED</span></div>
    </section>

    <section className="rm-statement" aria-labelledby="rm-statement-heading">
      <div className="rm-wrap">
        <div className="rm-section-label">WHY RIDDOFF <span>01 / 04</span></div>
        <SectionReveal className="rm-statement-grid">
          <h2 id="rm-statement-heading">Less complexity.<br/><span>More clarity.</span></h2>
          <div><p>Businesses don't need more software to manage. They need better ways for their work to come together.</p><Link to="/company" className="rm-text-link">Our approach <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
        </SectionReveal>
      </div>
    </section>

    <section className="rm-principles" aria-label="Why teams choose connected business systems">
      <div className="rm-wrap">
        <div className="rm-principles-grid">
          {pillars.map(p => (
            <SectionReveal key={p.number} className="rm-principle">
              <span className="rm-item-number">{p.number}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>

    <section className="rm-platform" aria-labelledby="rm-platform-heading">
      <div className="rm-wrap">
        <div className="rm-section-label">THE PLATFORM <span>02 / 04</span></div>
        <SectionReveal className="rm-platform-heading">
          <div>
            <span className="rm-small-label">ONE CONNECTED WORKSPACE</span>
            <h2 id="rm-platform-heading">Built around the<br/>way work happens.</h2>
          </div>
          <p>From managing relationships to coordinating day-to-day operations, RABOS is designed to keep your business in context.</p>
        </SectionReveal>
        <div className="rm-platform-grid">
          <SectionReveal className="rm-platform-list">
            {operatingAreas.map(area => (
              <Link to="/products/riddoff-erp" className="rm-platform-row" key={area.number}>
                <span className="rm-item-number">{area.number}</span>
                <span className="rm-platform-row-text"><strong>{area.title}</strong><small>{area.description}</small></span>
                <ArrowUpRight size={18} aria-hidden="true"/>
              </Link>
            ))}
          </SectionReveal>
          <SectionReveal className="rm-system-visual">
            <div className="rm-system-visual-top"><Layers3 size={18} strokeWidth={1.7}/><span>THE RABOS APPROACH</span></div>
            <div className="rm-system-center"><span className="rm-system-mark">r</span><strong>One connected view</strong><p>For the people and processes behind your business.</p></div>
            <div className="rm-system-chips"><span>Customers</span><span>Workflows</span><span>Operations</span><span>Insights</span></div>
            <span className="rm-system-note">A simplified illustration of the platform's purpose.</span>
          </SectionReveal>
        </div>
        <Link className="rm-text-link rm-platform-all" to="/products/riddoff-erp">Discover the platform <ArrowRight size={17} aria-hidden="true"/></Link>
      </div>
    </section>

    <section className="rm-industries" aria-labelledby="rm-industries-heading">
      <div className="rm-wrap">
        <div className="rm-section-label">REAL-WORLD WORK <span>03 / 04</span></div>
        <SectionReveal className="rm-industries-intro">
          <h2 id="rm-industries-heading">Made for the details<br/>that matter.</h2>
          <p>Every business has its own pace, people and processes. We focus on practical operational problems—not one-size-fits-all promises.</p>
        </SectionReveal>
        <div className="rm-industries-list">
          {[
            { name: "Manufacturing", note: "Keep production and operations coordinated." },
            { name: "Retail & distribution", note: "Connect stock, sales and day-to-day work." },
            { name: "Growing teams", note: "Give teams a clearer way to manage responsibilities." },
          ].map((industry, index) => (
            <Link to="/industries" key={industry.name} className="rm-industry-row">
              <span className="rm-item-number">0{index + 1}</span><strong>{industry.name}</strong><span>{industry.note}</span><ChevronRight size={20} aria-hidden="true"/>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className="rm-vision" aria-labelledby="rm-vision-heading">
      <div className="rm-wrap rm-vision-grid">
        <SectionReveal>
          <span className="rm-small-label">LOOKING AHEAD</span>
          <h2 id="rm-vision-heading">Technology that<br/>works with you.</h2>
        </SectionReveal>
        <SectionReveal className="rm-vision-description">
          <p>We believe business software should do more than store information. Our direction is toward smarter assistance and increasingly coordinated workflows, while keeping people accountable for important decisions.</p>
          <p className="rm-vision-caption">Autonomous operations are a long-term product direction, not a claim that every workflow is autonomous today.</p>
          <Link className="rm-text-link" to="/company">More about Riddoff <ArrowUpRight size={17} aria-hidden="true"/></Link>
        </SectionReveal>
      </div>
    </section>

    <section className="rm-contact" aria-labelledby="rm-contact-heading">
      <div className="rm-wrap">
        <div className="rm-section-label">LET'S TALK <span>04 / 04</span></div>
        <SectionReveal className="rm-contact-grid">
          <div><h2 id="rm-contact-heading">Let's make work<br/>a little simpler.</h2><p>Tell us about your business and the systems you're trying to improve.</p></div>
          <Link to="/contact" className="rm-btn rm-btn-primary">Start a conversation <ArrowUpRight size={18} aria-hidden="true"/></Link>
        </SectionReveal>
      </div>
    </section>
  </div>
);

export default IndexMinimal;
