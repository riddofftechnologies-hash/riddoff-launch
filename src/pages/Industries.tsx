import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { IndustrySolutions } from "@/components/RabosInteractive";
import { ActionLink, Reveal } from "@/components/ShowcaseMotion";
import "./ShowcaseExperience.css";

export default function Industries(){
  return <div className="rx-exp">
    <section className="rx-rabos-hero" style={{paddingBottom:80}}>
      <div className="rx-container">
        <Reveal><span className="rx-eyebrow">INDUSTRIES / WORK THAT MATTERS</span><h1 style={{fontSize:"clamp(48px,6vw,83px)",maxWidth:900,fontWeight:600,lineHeight:1.1,margin:"27px 0"}}>Every industry has its own operating reality.</h1><p className="rx-lead">Start with the work. Build the right system around it.</p><p className="rx-secondary">Our product direction supports manufacturing, retail, distribution and service workflows, with specialist implementations where the needs differ.</p></Reveal>
      </div>
    </section>
    <IndustrySolutions/>
    <section className="rx-home-future"><div className="rx-container rx-editorial-split"><Reveal><span className="rx-eyebrow">COMMON FOUNDATION / DISTINCT WORKFLOWS</span><h2>A shared backbone. Room for the details.</h2></Reveal><Reveal><p>Inventory, sales and finance are connected concerns across industries. Manufacturing adds specific needs such as design documents, material planning, estimates and production orders.</p><p>The Windoor aluminium and Azara tailoring programmes are designed with independent acceptance gates; progress in one cannot substitute for acceptance in the other.</p><Link to="/products/riddoff-erp#modules" className="rx-inline-link">Explore the RABOS modules <ArrowUpRight size={16}/></Link></Reveal></div></section>
    <section className="rx-end-cta"><div className="rx-container rx-end-cta-inner"><Reveal><span className="rx-eyebrow">WORKFLOW DISCOVERY</span><h2>Tell us how your business works.</h2><p>We'll discuss which capabilities fit today and what would require a tailored rollout.</p></Reveal><ActionLink to="/contact">Start a conversation</ActionLink></div></section>
  </div>;
}
