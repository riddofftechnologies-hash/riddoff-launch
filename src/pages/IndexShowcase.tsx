import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, CircleDot, Layers3, Network, ShieldCheck } from "lucide-react";
import { DotNetwork } from "@/components/ControlInteractive";
import { ActionLink, DrawRule, KineticWords, Reveal, VisualFrame } from "@/components/ShowcaseMotion";
import "./ShowcaseExperience.css";

export default function IndexShowcase(){
  const [product, setProduct] = useState<"rabos"|"control">("rabos");
  const reduce=useReducedMotion();
  const {scrollY}=useScroll();
  const shift=useTransform(scrollY,[0,700],[0,-36]);
  return <div className="rx-exp rx-homepage">
    <section className="rx-home-hero" aria-labelledby="rx-home-heading">
      <div className="rx-home-hero-grid rx-container">
        <div className="rx-home-hero-copy">
          <Reveal><span className="rx-eyebrow"><span className="rx-signal-dot"/> RIDDOFF TECHNOLOGIES</span></Reveal>
          <h1 id="rx-home-heading"><KineticWords>Making complex work feel connected.</KineticWords></h1>
          <Reveal delay={.12}><p className="rx-lead">Two operating platforms. One belief: technology should move meaningful work forward.</p><p className="rx-secondary">Meet RABOS, our business operating system, and Riddoff Control, our developing control layer for founder-led software companies and their AI workforce.</p><div className="rx-actions"><ActionLink to="/products">Explore our products</ActionLink><ActionLink to="/contact" quiet>Talk with Riddoff</ActionLink></div></Reveal>
        </div>
        <motion.div className="rx-home-hero-art" style={reduce?undefined:{y:shift}}>
          <div className="rx-home-art-bar"><span><span className="rx-signal-dot"/> TWO PRODUCTS / ONE DIRECTION</span><span>01 — 02</span></div>
          <div className="rx-home-art-body">
            <div className="rx-home-art-product"><span className="rx-home-art-icon">R</span><div><small>OPERATE THE BUSINESS</small><strong>RABOS</strong></div><ArrowUpRight size={18}/></div>
            <div className="rx-home-art-junction"><span/><i/><span/></div>
            <div className="rx-home-art-product second"><span className="rx-home-art-icon">C</span><div><small>COORDINATE THE COMPANY</small><strong>Riddoff Control</strong></div><ArrowUpRight size={18}/></div>
            <div className="rx-home-art-note"><CheckCircle2 size={16}/> Connected systems. Context. Human decisions.</div>
          </div>
          <div className="rx-home-art-foot">A SIMPLE VIEW OF THE RIDDOFF PRODUCT DIRECTION</div>
        </motion.div>
      </div>
      <div className="rx-container rx-home-hero-rule"><DrawRule/><div><span>INDIA / BUILDING FOR GLOBAL TEAMS</span><a href="#products">SCROLL TO EXPLORE ↓</a></div></div>
    </section>

    <section id="products" className="rx-home-products" aria-labelledby="rx-products-title"><div className="rx-container">
      <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">OUR PRODUCTS</span><h2 id="rx-products-title">Made for two kinds of work.</h2></div><p>Running a business and building the company behind it demand different systems. We make room for both.</p></Reveal>
      <div className="rx-products-grid">
        <Reveal className="rx-product-card">
          <div className="rx-product-card-top"><span>01 / RABOS</span><Layers3 size={22} strokeWidth={1.5}/></div>
          <h3>Run your business<br/>with more clarity.</h3><p>Connect customers, sales, inventory, manufacturing, accounts and insight in one operating experience.</p>
          <img className="rx-product-card-shot" src="/product-visuals/rabos-home-config.png" loading="lazy" decoding="async" alt="RABOS dashboard configuration interface review"/>
          <div className="rx-product-card-foot"><span>BUSINESS OPERATING SYSTEM</span><Link to="/products/riddoff-erp">Explore RABOS <ArrowUpRight size={17}/></Link></div>
        </Reveal>
        <Reveal className="rx-product-card rx-product-card-control" delay={.09}>
          <div className="rx-product-card-top"><span>02 / RIDDOFF CONTROL</span><Network size={22} strokeWidth={1.5}/></div>
          <h3>Coordinate the work<br/>behind the company.</h3><p>One founder-directed control layer for Dots, specialist agents, engineering, support and operations.</p>
          <div className="rx-product-dot-thumb" aria-label="Conceptual Master Dot coordinating Engineering, Support and Operations">
            <div className="rx-product-dot-master"><span>M</span> MASTER DOT</div><div className="rx-product-dot-line" /><div className="rx-product-dot-roles"><span>ENGINEERING</span><span>SUPPORT</span><span>OPERATIONS</span></div><small>Human approval remains in control</small>
          </div>
          <div className="rx-product-card-foot"><span>AI WORKFORCE CONTROL / DEVELOPING</span><Link to="/products/riddoff-control">Explore Control <ArrowUpRight size={17}/></Link></div>
        </Reveal>
      </div>
    </div></section>

    <section className="rx-home-interactive" aria-labelledby="rx-home-interactive-title"><div className="rx-container">
      <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">SEE THE DIFFERENCE</span><h2 id="rx-home-interactive-title">Explore the operating experiences.</h2></div><p>Switch between a RABOS interface capture and a conceptual view of Control's coordinated Dots.</p></Reveal>
      <div className="rx-switch-tabs" aria-label="Choose product preview"><button type="button" onClick={()=>setProduct("rabos")} aria-pressed={product==="rabos"} className={product==="rabos"?"selected":""}>RABOS <span>Business OS</span></button><button type="button" onClick={()=>setProduct("control")} aria-pressed={product==="control"} className={product==="control"?"selected":""}>Riddoff Control <span>AI workforce</span></button></div>
      <div className="rx-home-switch-panel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={product} initial={reduce?false:{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={reduce?undefined:{opacity:0,y:-10}} transition={{duration:.28}} className="rx-home-switch-grid">
            <div className="rx-home-switch-copy"><span className="rx-eyebrow">{product==="rabos"?"ONE CONNECTED BUSINESS":"A COORDINATED AI WORKFORCE"}</span><h3>{product==="rabos"?"Make room for better decisions.":"Build with the founder in control."}</h3><p>{product==="rabos"?"Explore workflows across customer relationships, operations, manufacturing and reporting—with growing intelligence capabilities.":"See how the Master Dot can propose and coordinate tasks across Engineering, Support and Operations Dots, with governed specialist roles."}</p><Link className="rx-inline-link" to={product==="rabos"?"/products/riddoff-erp":"/products/riddoff-control"}>Explore {product==="rabos"?"RABOS":"Riddoff Control"} <ArrowUpRight size={16}/></Link></div>
            <div className="rx-home-switch-visual">{product==="rabos"?<VisualFrame src="/product-visuals/manufacturing-design-editor.png" alt="RABOS manufacturing design interface" caption="Manufacturing design editor · Internal interface capture"/>:<div className="rx-switch-dot-frame"><div className="rx-control-small-heading"><span>MASTER / SPECIALIST DOTS</span><span>CONCEPT</span></div><DotNetwork compact/></div>}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div></section>

    <section className="rx-home-problem"><div className="rx-container rx-editorial-split"><Reveal><span className="rx-eyebrow">WHAT WE BELIEVE</span><h2>Less time connecting dots.<br/>More time moving forward.</h2></Reveal><Reveal><p>Growing organizations rarely struggle because people aren't working hard enough. They struggle because information, work and decisions aren't connected.</p><p>Riddoff builds technology to close that gap, starting with RABOS as an operating system for business and expanding into Riddoff Control for software company coordination.</p><Link to="/solutions" className="rx-inline-link">Explore solutions <ArrowUpRight size={16}/></Link></Reveal></div></section>

    <section className="rx-home-evidence"><div className="rx-container">
      <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">FROM OUR PRODUCT WORK</span><h2>Real interfaces. Real complexity.</h2></div><p>These are internal RABOS interface captures, not fabricated financial results or screenshots of your production tenant.</p></Reveal>
      <div className="rx-home-evidence-grid"><Reveal><VisualFrame src="/product-visuals/crm-workflow-builder.png" alt="CRM workflow designer review capture" caption="CRM workflow builder · Internal review capture"/></Reveal><Reveal delay={.08}><VisualFrame src="/product-visuals/manufacturing-quotations.png" alt="RABOS manufacturing quotation screen" caption="Manufacturing quotations · Internal review capture"/></Reveal></div>
      <div className="rx-home-evidence-foot"><Link to="/products/riddoff-erp#gallery" className="rx-inline-link">View product gallery <ArrowUpRight size={16}/></Link></div>
    </div></section>

    <section className="rx-home-future"><div className="rx-container rx-editorial-split">
      <Reveal><span className="rx-eyebrow">OUR DIRECTION</span><h2>From connected operations to AI-assisted execution.</h2></Reveal>
      <Reveal><p>RABOS brings business activity together. Riddoff Control extends the model to coordinating the company that builds and runs software.</p><p>Our long-term ambition is a one-founder company supported by a coordinated AI workforce—with explicit human control for important actions.</p><div className="rx-home-future-pills"><span><ShieldCheck size={15}/> Governed execution</span><span><CircleDot size={15}/> Visible evidence</span><span><CheckCircle2 size={15}/> Human acceptance</span></div><Link to="/products/riddoff-control" className="rx-inline-link">Discover Riddoff Control <ArrowUpRight size={16}/></Link></Reveal>
    </div></section>
    <section className="rx-end-cta"><div className="rx-container rx-end-cta-inner"><Reveal><span className="rx-eyebrow">LET'S BUILD WITH PURPOSE</span><h2>What would clearer work change for you?</h2><p>Explore our products, discuss your operations or start a commercialization conversation.</p></Reveal><ActionLink to="/contact">Start a conversation</ActionLink></div></section>
  </div>;
}
