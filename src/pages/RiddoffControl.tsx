import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Command, Eye, GitBranch, Headphones, ShieldCheck, Sparkles } from "lucide-react";
import { ControlGuardrails, DotNetwork, ExecutionTimeline } from "@/components/ControlInteractive";
import { ActionLink, DrawRule, KineticWords, Reveal } from "@/components/ShowcaseMotion";
import "./ShowcaseExperience.css";

const useCases = [
  { index: "01", title: "Founder-led software companies", value: "More focused execution", description: "Give a lean team a single place to coordinate product work, reviews and operational follow-through." },
  { index: "02", title: "Engineering & product teams", value: "More visible delivery", description: "Break a request into governed tasks, validations and reviewable handoffs." },
  { index: "03", title: "Support & internal operations", value: "Less work falling through", description: "Bring ticket triage, drafts, ownership and escalation into a shared operator view." },
];

export default function RiddoffControl() {
  return <div className="rx-exp rx-control-page">
    <section className="rx-control-hero">
      <div className="rx-control-hero-hatch" aria-hidden="true"/>
      <div className="rx-container rx-control-hero-grid">
        <div className="rx-control-hero-copy">
          <Reveal><span className="rx-eyebrow"><span className="rx-signal-dot"/> RIDDOFF CONTROL / AI WORKFORCE OPERATIONS</span></Reveal>
          <h1><KineticWords>Run the work. Keep the decisions.</KineticWords></h1>
          <Reveal delay={.14}><p className="rx-lead">One founder. A coordinated team of Dots and specialist agents. Clear human oversight at every important boundary.</p><p className="rx-secondary">Riddoff Control is a company operating layer being developed for lean software teams—bringing engineering, support and operations into a single coordinated workflow.</p>
            <div className="rx-actions"><ActionLink to="/contact">Discuss early access</ActionLink><a className="rx-action rx-action-quiet" href="#dots">Meet the Dots <ArrowRight size={17} aria-hidden="true"/></a></div>
            <p className="rx-hero-status">PRODUCT DEVELOPMENT / STAGED ACTIVATION / AVAILABILITY BY ENQUIRY</p>
          </Reveal>
        </div>
        <Reveal delay={.09} className="rx-control-hero-diagram"><div className="rx-control-small-heading"><span>CONTROL / ORCHESTRATION</span><span>INTERACTIVE ARCHITECTURE</span></div><DotNetwork compact/><div className="rx-control-hero-caption">A guided conceptual view of the operating model, not a live task execution feed.</div></Reveal>
      </div>
      <div className="rx-container"><DrawRule/></div>
    </section>
    <section className="rx-editorial-section rx-overview" aria-labelledby="rx-control-why"><div className="rx-container rx-editorial-split"><Reveal><span className="rx-eyebrow">THE PROBLEM</span><h2 id="rx-control-why">A founder can't be everywhere. The work still has to move.</h2></Reveal><Reveal><p>A growing product company depends on engineering decisions, support resolution, product feedback, release checks and countless small handoffs.</p><p>Riddoff Control's aim is to make that work more visible, coordinated and reviewable—without pretending an AI agent replaces founder accountability.</p></Reveal></div></section>
    <section id="dots" className="rx-dots-section" aria-labelledby="rx-dots-title"><div className="rx-container"><Reveal className="rx-section-heading"><div><span className="rx-eyebrow">THE DOTS</span><h2 id="rx-dots-title">Different roles. One shared direction.</h2></div><p>Choose a Dot to see how each function contributes to the company's operating rhythm.</p></Reveal><DotNetwork/></div></section>
    <ExecutionTimeline/>
    <ControlGuardrails/>
    <section id="founder-company" className="rx-founder-section" aria-labelledby="rx-founder-title"><div className="rx-container">
      <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">THE ONE-FOUNDER COMPANY</span><h2 id="rx-founder-title">Build a company around leverage, not chaos.</h2></div><p>Founder-led does not mean unattended. The founder sets the direction; Dots coordinate bounded work; agents generate reviewable outputs.</p></Reveal>
      <div className="rx-founder-grid">
        <Reveal className="rx-founder-problem"><span>WITHOUT A COORDINATING LAYER</span><h3>Everything comes back to the founder.</h3><ul><li>Context scattered across tools</li><li>Repeated status chasing</li><li>Handoffs with unclear ownership</li><li>Reviews arriving without enough evidence</li></ul></Reveal>
        <Reveal className="rx-founder-solution"><span>WITH RIDDOFF CONTROL / THE DIRECTION</span><h3>One place to direct and review the work.</h3><ul>{["A Master Dot to coordinate requests", "Specialized Dots for functional work", "Bounded roles and validation gates", "Human acceptance before consequential actions"].map(x=><li key={x}><Check size={17} aria-hidden="true"/>{x}</li>)}</ul></Reveal>
      </div>
    </div></section>
    <section id="commercialization" className="rx-commercial" aria-labelledby="rx-commercial-title"><div className="rx-container"><Reveal className="rx-section-heading"><div><span className="rx-eyebrow">WHERE IT FITS</span><h2 id="rx-commercial-title">Built for companies that build.</h2></div><p>Riddoff Control is being developed first around software product companies, where execution quality and speed both matter.</p></Reveal>
    <div className="rx-commercial-grid">{useCases.map((x,i)=><Reveal key={x.index} delay={i*.05} className="rx-commercial-card"><span>{x.index} / USE CASE</span><h3>{x.title}</h3><strong>{x.value}</strong><p>{x.description}</p><Link to="/contact">Start a conversation <ArrowUpRight size={16} aria-hidden="true"/></Link></Reveal>)}</div>
    <div className="rx-commercial-disclosure"><span>COMMERCIAL STATUS</span><p>Riddoff Control is a developing offering with internal implementation evidence and staged activation requirements. Pricing, hosting, integrations, autonomous functions and commercial availability are discussed case by case; this page is not a guarantee of an active self-service product.</p></div>
    </div></section>
    <section className="rx-control-future" id="vision"><div className="rx-container rx-editorial-split"><Reveal><span className="rx-eyebrow">THE LONG VIEW</span><h2>From software that records work to systems that help move it forward.</h2></Reveal><Reveal><p>RABOS is Riddoff's proof of a connected business operating platform. Riddoff Control extends that thinking into the company building and operating software itself.</p><p>Our ambition is a future in which one founder can coordinate a remarkably capable organization—supported by specialist agents, strong governance and real-world evidence.</p><Link className="rx-inline-link" to="/products/riddoff-erp">See RABOS <ArrowUpRight size={16} aria-hidden="true"/></Link></Reveal></div></section>
    <section className="rx-end-cta"><div className="rx-container rx-end-cta-inner"><Reveal><span className="rx-eyebrow">EARLY COMMERCIAL CONVERSATIONS</span><h2>See how Control could fit your company.</h2><p>We're discussing pilots and commercialization pathways with founder-led and product organizations.</p></Reveal><ActionLink to="/contact">Enquire about Riddoff Control</ActionLink></div></section>
  </div>;
}
