import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, PageCTA } from "@/components/MarketingBlocks";

const principles = [
  { title: "Clarity before complexity", description: "Technology should help people understand their work, not bury them under another layer of software." },
  { title: "Practical by design", description: "We start with real operational needs, from daily handoffs to the information behind important decisions." },
  { title: "Ambitious, responsibly", description: "Smarter systems can create more capable businesses—but meaningful oversight and trust remain essential." },
];

const Company = () => (
  <div className="mp-page">
    <PageIntro eyebrow="ABOUT / RIDDOFF TECHNOLOGIES" title="Building a more thoughtful kind of business software." description="Riddoff is focused on connected operating experiences that help teams do good work with less friction."/>
    <section className="mp-section">
      <div className="mp-wrap">
        <div className="mp-section-label">OUR PERSPECTIVE</div>
        <div className="mp-split" style={{alignItems:"start", marginTop:48}}>
          <h2 className="mp-section-title" style={{marginTop:0}}>Work should feel more connected.</h2>
          <div>
            <p className="mp-section-description">Business systems are often built around separate functions. We believe the better approach is to understand how information, decisions and people move across those boundaries.</p>
            <p className="mp-section-description" style={{marginTop:20}}>RABOS represents that direction: one more coherent place to understand and run everyday operations.</p>
          </div>
        </div>
      </div>
    </section>
    <section className="mp-section mp-section-muted">
      <div className="mp-wrap">
        <div className="mp-section-label">WHAT GUIDES US</div>
        <div className="mp-pair-grid">
          {principles.map((item,i)=><div className="mp-pair" key={item.title}><span className="mp-pair-number">0{i+1}</span><h3>{item.title}</h3><p>{item.description}</p></div>)}
        </div>
      </div>
    </section>
    <section className="mp-section">
      <div className="mp-wrap">
        <div className="mp-split" style={{alignItems:"start"}}>
          <div><span className="mp-overline">LOOKING AHEAD</span><h2 className="mp-section-title">Toward more intelligent operations.</h2></div>
          <div>
            <p className="mp-section-description">Our long-term vision is for systems that can assist teams and increasingly coordinate work across a business. Those capabilities should be introduced transparently, with human review where it matters.</p>
            <p className="mp-callout">Autonomous operation is a forward-looking product direction, not a claim that RABOS currently operates every business process independently.</p>
            <Link to="/products/riddoff-erp" className="mp-text-link" style={{marginTop:25}}>Explore RABOS <ArrowUpRight size={17} aria-hidden="true"/></Link>
          </div>
        </div>
      </div>
    </section>
    <PageCTA title="Build the next chapter with us." description="Whether you're exploring RABOS or a complex operational challenge, we'd like to hear what you're working on."/>
  </div>
);
export default Company;
