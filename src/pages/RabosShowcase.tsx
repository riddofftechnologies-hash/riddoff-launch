import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BrainCircuit, CheckCircle2, Layers3, Network, ShieldCheck } from "lucide-react";
import { ModuleExplorer, IndustrySolutions, ProductGallery } from "@/components/RabosInteractive";
import { ActionLink, DrawRule, KineticWords, Reveal, VisualFrame } from "@/components/ShowcaseMotion";
import "./ShowcaseExperience.css";

const capabilities = [
  { icon: Network, title: "Connected operations", text: "Bring related business functions into the same operational context instead of making teams reconcile separate records." },
  { icon: BrainCircuit, title: "Reasoning and context", text: "A reasoning layer is being developed to work from business facts, identify gaps and support grounded operational questions." },
  { icon: ShieldCheck, title: "Governed action paths", text: "Important actions need clearly defined authority, evidence and approval. Intelligence should strengthen accountability, not bypass it." },
  { icon: Layers3, title: "Vertical adaptability", text: "A shared platform can support distinct workflows, including aluminium fabrication and tailoring, without treating both industries as identical." },
];

export default function RabosShowcase() {
  return <div className="rx-exp rx-rabos-page">
    <section className="rx-rabos-hero">
      <div className="rx-container rx-rabos-hero-grid">
        <div className="rx-rabos-hero-copy">
          <Reveal><span className="rx-eyebrow"><span className="rx-signal-dot"/> RABOS / BUSINESS OPERATING SYSTEM</span></Reveal>
          <h1><KineticWords>One business. One connected picture.</KineticWords></h1>
          <Reveal delay={.16}><p className="rx-lead">When the right information meets the right people, work moves differently.</p><p className="rx-secondary">RABOS connects business processes, operational visibility and the beginnings of an intelligence layer—built for the reality of running a company.</p>
            <div className="rx-actions"><ActionLink to="/contact">Book a RABOS walkthrough</ActionLink><a className="rx-action rx-action-quiet" href="https://erp.riddoff.com" target="_blank" rel="noopener noreferrer">Existing customer login <ArrowUpRight size={17}/></a></div>
          </Reveal>
        </div>
        <Reveal className="rx-rabos-hero-art" delay={.1}>
          <VisualFrame src="/product-visuals/rabos-home-config.png" alt="RABOS configurable dashboard layout captured for internal review" caption="RABOS dashboard configuration · Internal UI review capture" label="RABOS INTERFACE REVIEW"/>
        </Reveal>
      </div>
      <div className="rx-container"><DrawRule/></div>
    </section>

    <div className="rx-proofbar"><div className="rx-container"><span>Sales & CRM</span><span>Inventory & procurement</span><span>Manufacturing</span><span>Reporting & intelligence</span><span>People & workflows</span></div></div>

    <section className="rx-editorial-section rx-overview" aria-labelledby="rx-rabos-overview">
      <div className="rx-container rx-editorial-split">
        <Reveal><span className="rx-eyebrow">WHY IT MATTERS</span><h2 id="rx-rabos-overview">Your software should understand the connections.</h2></Reveal>
        <Reveal><p>An order affects inventory. Inventory affects procurement. Materials affect production. Every decision touches another part of the business.</p><p>RABOS is being built around those relationships, giving teams a clearer way to work across functions, rather than adding another disconnected dashboard.</p></Reveal>
      </div>
    </section>

    <ModuleExplorer/>
    <section className="rx-editorial-section rx-intelligence" id="intelligence" aria-labelledby="rx-intelligence-heading">
      <div className="rx-container">
        <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">BUILT FOR MORE THAN RECORDS</span><h2 id="rx-intelligence-heading">A thoughtful intelligence layer.</h2></div><p>A connected system is the foundation. Reasoning, governed actions and adaptable workflows define the direction.</p></Reveal>
        <div className="rx-capability-grid">{capabilities.map((feature,i)=><Reveal className="rx-capability-card" key={feature.title} delay={i*.05}><feature.icon size={24} strokeWidth={1.5} aria-hidden="true"/><h3>{feature.title}</h3><p>{feature.text}</p></Reveal>)}</div>
        <p className="rx-section-disclosure"><CheckCircle2 size={15} aria-hidden="true"/> Feature availability, data coverage and permitted actions are tenant- and release-dependent. Future autonomy is a product direction, not a blanket live capability claim.</p>
      </div>
    </section>

    <IndustrySolutions/>
    <section className="rx-factory-section" aria-labelledby="rx-factory-title">
      <div className="rx-container">
        <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">MANUFACTURING / REAL-WORLD COMPLEXITY</span><h2 id="rx-factory-title">From the drawing to the delivery.</h2></div><p>Manufacturing requires a particularly clear chain from design intent through costing, materials and execution.</p></Reveal>
        <div className="rx-factory-story"><Reveal><VisualFrame src="/product-visuals/manufacturing-design-editor.png" alt="RABOS manufacturing design editor interface capture" caption="Design editor · Internal interface review"/></Reveal><Reveal className="rx-factory-copy"><span className="rx-eyebrow">01 / DESIGN</span><h3>Define it precisely.</h3><p>Model and design information can become the foundation for estimates, quantities and production plans.</p><ul><li>Structured design documents</li><li>Furniture and aluminium plugin architecture</li><li>Materials and dimension context</li></ul></Reveal></div>
        <div className="rx-factory-story reverse"><Reveal><VisualFrame src="/product-visuals/manufacturing-production-orders.png" alt="RABOS manufacturing production order interface capture" caption="Production order workspace · Internal interface review"/></Reveal><Reveal className="rx-factory-copy"><span className="rx-eyebrow">02 / DELIVERY</span><h3>Make the handoff visible.</h3><p>Quotes, BOMs, routing and production orders need a coherent journey, rather than unrelated spreadsheets.</p><ul><li>Quotation and BOM views</li><li>Production order coordination</li><li>Shop-floor workflow direction</li></ul></Reveal></div>
        <div className="rx-vertical-note"><span>VERTICALS IN DEVELOPMENT</span><strong>Windoor / aluminium fabrication</strong><strong>Azara Boutique / tailoring</strong><p>Each vertical has independent implementation and acceptance gates. Some design-to-quote and shop-floor functionality remains staged rather than generally available.</p></div>
      </div>
    </section>
    <ProductGallery/>
    <section className="rx-end-cta"><div className="rx-container rx-end-cta-inner"><Reveal><span className="rx-eyebrow">MOVE BEYOND DISCONNECTED WORK</span><h2>See what RABOS could change for your team.</h2><p>We'll walk through your current challenges and the workflows that matter most to your business.</p></Reveal><ActionLink to="/contact">Talk with Riddoff</ActionLink></div></section>
  </div>;
}
