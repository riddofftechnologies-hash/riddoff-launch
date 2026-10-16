import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Boxes, ChartNoAxesCombined, Command, Fingerprint, Layers3, MoveUpRight, ShieldCheck, Workflow, Zap } from "lucide-react";
import "./IndexCinematic.css";

const easing = [0.22, 1, 0.36, 1] as const;
const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .85, delay, ease: easing }}>{children}</motion.div>;
};

const OrbitalCore = () => {
  const reduce = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  return <div className="rd-orbit-stage" aria-label="Abstract 3D visualization of connected business intelligence" role="img" onPointerMove={e => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setPointer({ x: ((e.clientX - r.left) / r.width - .5) * 15, y: ((e.clientY - r.top) / r.height - .5) * -15 });
  }} onPointerLeave={() => setPointer({ x: 0, y: 0 })}>
    <motion.div className="rd-orbit-camera" animate={reduce ? undefined : { rotateX: pointer.y, rotateY: pointer.x }} transition={{ type: "spring", stiffness: 42, damping: 18 }}>
      <div className="rd-orbit-halo rd-halo-1" /><div className="rd-orbit-halo rd-halo-2" />
      <div className="rd-orbit-ring rd-ring-a" /><div className="rd-orbit-ring rd-ring-b" /><div className="rd-orbit-ring rd-ring-c" />
      <div className="rd-orbit-core"><span className="rd-orbit-core-inner" /></div>
      <div className="rd-satellite rd-sat-a" /><div className="rd-satellite rd-sat-b" /><div className="rd-satellite rd-sat-c" /><div className="rd-satellite rd-sat-d" />
    </motion.div>
    <span className="rd-orbit-label rd-label-one"><span className="rd-pulse-dot" /> Signals connected</span>
    <span className="rd-orbit-label rd-label-two">INTELLIGENCE / 001</span>
    <span className="rd-orbit-cross rd-cross-a">+</span><span className="rd-orbit-cross rd-cross-b">+</span>
  </div>;
};
const modules = [
  { icon: ChartNoAxesCombined, index: "01", title: "A clearer picture.", description: "Bring your data and decisions into a single, meaningful view.", className: "rd-feature-analytics", tag: "INTELLIGENCE" },
  { icon: Workflow, index: "02", title: "Work that flows.", description: "Connect handoffs, tasks and teams across your operations.", className: "rd-feature-workflows", tag: "OPERATIONS" },
  { icon: Boxes, index: "03", title: "Everything connected.", description: "From sales and customer relationships to inventory and beyond.", className: "rd-feature-connected", tag: "BUSINESS SYSTEMS" },
];
const steps = [
  { number: "01", title: "A signal arrives", description: "A business event, request or change enters the operating system." },
  { number: "02", title: "Context comes together", description: "Relevant information is surfaced in the right operational context." },
  { number: "03", title: "People stay in control", description: "Teams can review, decide and act—with room for progressively smarter automation." },
];
const CinematicIndex = () => {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    document.title = "Riddoff — An intelligent way to run your business";
    return () => { document.title = "Riddoff"; };
  }, []);
  return <main className="rd-site">
    <motion.div className="rd-reading-line" style={{ scaleX: lineScale }} />
    <section className="rd-hero" id="top">
      <div className="rd-hero-grid" aria-hidden="true" />
      <div className="rd-hero-noise" aria-hidden="true" />
      <div className="rd-hero-inner">
        <Reveal className="rd-hero-copy">
          <div className="rd-eyebrow"><span className="rd-eyebrow-led" /> INTRODUCING THE RABOS EXPERIENCE <span className="rd-eyebrow-line" /></div>
          <h1>Complexity,<br/><span className="rd-gradient-type">meet clarity.</span></h1>
          <p className="rd-hero-lede">Your business has a thousand moving parts. Imagine them working as one.</p>
          <p className="rd-hero-sub">Meet RABOS, an intelligent business operating system from Riddoff. Designed to bring your operations, information and people into focus.</p>
          <div className="rd-hero-actions"><Link className="rd-button rd-button-light" to="/products/riddoff-erp">Explore RABOS <ArrowUpRight size={17}/></Link><Link className="rd-button rd-button-outline" to="/contact">Talk to our team <ArrowRight size={17}/></Link></div>
          <span className="rd-hero-caption">MADE FOR THE WAY BUSINESS REALLY WORKS.</span>
        </Reveal>
        <OrbitalCore />
      </div>
      <a className="rd-scroll-cue" href="#the-shift">SCROLL TO EXPLORE <ArrowDown size={14}/></a>
      <div className="rd-hero-bottom-rule" />
    </section>

    <section className="rd-shift" id="the-shift"><div className="rd-container">
      <Reveal className="rd-section-marker"><span>01 / THE SHIFT</span><span>FROM FRAGMENTED TO CONNECTED</span></Reveal>
      <Reveal><h2 className="rd-editorial-headline">Great businesses shouldn't be held back by <em>disconnected systems.</em></h2></Reveal>
      <div className="rd-shift-bottom"><Reveal><p>Scattered information. Endless handoffs. Decisions made without the full picture. There's a better way to work.</p></Reveal><Reveal><span className="rd-abstract-arrow">↗</span></Reveal></div>
    </div></section>

    <section className="rd-product" id="rabos"><div className="rd-container">
      <Reveal className="rd-centered"><span className="rd-kicker">MEET RABOS</span><h2>One place.<br/><span>More possibilities.</span></h2><p>Designed around how teams actually operate—not how software expects them to.</p></Reveal>
      <Reveal className="rd-product-window">
        <div className="rd-window-top"><span className="rd-window-dots"><i/><i/><i/></span><span>RABOS / OPERATIONS OVERVIEW</span><span>INTERFACE CONCEPT</span></div>
        <div className="rd-window-layout">
          <aside className="rd-window-sidebar"><div className="rd-window-brand"><span className="rd-window-symbol">✳</span> rabos</div>{["Overview","Sales","Customers","Inventory","Workflows","Reports"].map((v,i)=><button key={v} className={activeTab===i ? "rd-sidebar-active":""} onClick={()=>setActiveTab(i)}><span className="rd-sidebar-glyph">{["◈","↗","◎","▤","⌁","▥"][i]}</span>{v}</button>)}<div className="rd-sidebar-bottom"><span className="rd-pulse-dot" /> Connected workspace</div></aside>
          <div className="rd-window-main"><div className="rd-window-main-header"><div><small>YOUR WORKSPACE / {["OVERVIEW","SALES","CUSTOMERS","INVENTORY","WORKFLOWS","REPORTS"][activeTab]}</small><h3>{["Everything in perspective.","Sales, in motion.","Customer relationships.","A clearer inventory.","Work in progress.","Insight at a glance."][activeTab]}</h3></div><span className="rd-window-avatar">R</span></div>
            <div className="rd-preview-metrics"><div><small>VISIBILITY</small><strong>One view</strong><span>Across business operations</span></div><div><small>WORKFLOWS</small><strong>Connected</strong><span>From event to action</span></div><div><small>DECISIONS</small><strong>In context</strong><span>Information where it matters</span></div></div>
            <div className="rd-preview-lower"><div className="rd-preview-chart"><div className="rd-preview-chart-heading"><span>Activity overview</span><span>ILLUSTRATIVE</span></div><div className="rd-chart-bars">{[34,42,38,53,46,65,56,79,64,88,73,97,84,106,93,118].map((height,i)=><span key={i} style={{height:height+"px"}} />)}</div><div className="rd-chart-foot"><span>MON</span><span>WED</span><span>FRI</span><span>SUN</span></div></div><div className="rd-preview-flow"><span>CONNECTED ACTIVITY</span>{[["01","New signal received"],["02","Context organized"],["03","Next action ready"]].map(([n,t])=><div key={n}><span>{n}</span><p>{t}</p><i/></div>)}</div></div>
          </div>
        </div>
        <div className="rd-window-disclosure">Design visualization — not a live customer account or measured product data.</div>
      </Reveal>
      <div className="rd-product-after"><span>ONE CONNECTED EXPERIENCE</span><span>EXPLORE THE SYSTEM <ArrowRight size={16}/></span></div>
    </div></section>

    <section className="rd-capabilities" id="capabilities"><div className="rd-container">
      <Reveal className="rd-section-marker"><span>02 / CAPABILITIES</span><span>BUILT TO WORK TOGETHER</span></Reveal>
      <Reveal className="rd-cap-intro"><h2>Less noise.<br/><em>More momentum.</em></h2><p>Every part of your operation has a story. RABOS helps bring those stories together.</p></Reveal>
      <div className="rd-feature-grid">{modules.map((m,i)=><Reveal delay={i*.08} key={m.title} className={"rd-feature-card "+m.className}><div className="rd-feature-card-top"><span>{m.index} / {m.tag}</span><m.icon size={20} strokeWidth={1.2}/></div><div className={"rd-feature-visual rd-visual-"+i} aria-hidden="true">{i===0?<><span className="rd-v-graph-line" /><div className="rd-v-bars">{[30,58,43,70,54,90,72].map((v,j)=><b key={j} style={{height:v+"%"}} />)}</div></>:i===1?<><div className="rd-flow-node rd-flow-n1">TRIGGER</div><span className="rd-flow-path"/><div className="rd-flow-node rd-flow-n2">CONTEXT</div><span className="rd-flow-path"/><div className="rd-flow-node rd-flow-n3">ACTION</div></>:<><span className="rd-connect-node n1"/><span className="rd-connect-node n2"/><span className="rd-connect-node n3"/><span className="rd-connect-node n4"/><span className="rd-connect-center">R</span></>}</div><h3>{m.title}</h3><p>{m.description}</p></Reveal>)}</div>
    </div></section>

    <section className="rd-flow-section" id="intelligence"><div className="rd-container rd-flow-content"><Reveal><span className="rd-kicker">THE INTELLIGENCE LAYER</span><h2>A smarter way<br/>to move work <span>forward.</span></h2><p>Not automation for its own sake. A clearer path from understanding what happened to deciding what happens next.</p><Link to="/solutions" className="rd-inline-link">Discover the approach <ArrowUpRight size={18}/></Link></Reveal><Reveal className="rd-step-list">{steps.map(s=><div className="rd-step" key={s.number}><span>{s.number}</span><div><h3>{s.title}</h3><p>{s.description}</p></div><ArrowUpRight size={17}/></div>)}</Reveal></div></section>

    <section className="rd-vision"><div className="rd-vision-mesh" aria-hidden="true"/><div className="rd-container rd-vision-content"><Reveal><span className="rd-kicker">BEYOND TODAY</span><h2>Software should do<br/>more than <em>wait.</em></h2><p>Our direction is toward business systems that can observe, assist and increasingly orchestrate work—under meaningful human oversight. Autonomous operations are a long-term vision, not a claim that every workflow runs autonomously today.</p><Link to="/company" className="rd-button rd-button-light">Our vision <ArrowUpRight size={18}/></Link></Reveal><div className="rd-vision-globe" aria-hidden="true"><div className="rd-vision-globe-inner"/><div className="rd-vision-orbit rd-vision-orbit-one"/><div className="rd-vision-orbit rd-vision-orbit-two"/></div></div></section>

    <section className="rd-foundation"><div className="rd-container"><Reveal className="rd-section-marker"><span>03 / OUR FOUNDATION</span><span>THOUGHTFUL BY DESIGN</span></Reveal><div className="rd-foundation-grid">{[{icon:Fingerprint,title:"Designed for clarity",body:"Intuitive experiences shaped around the people doing the work."},{icon:Layers3,title:"Built to connect",body:"An operating experience where business functions can work together."},{icon:ShieldCheck,title:"Human oversight",body:"Clear responsibilities and review moments are central to reliable automation."},{icon:Zap,title:"Made to evolve",body:"A foundation for continuous improvement as operational needs change."}].map(f=><Reveal className="rd-foundation-item" key={f.title}><f.icon size={24} strokeWidth={1.35}/><h3>{f.title}</h3><p>{f.body}</p></Reveal>)}</div></div></section>

    <section className="rd-ending"><div className="rd-container"><Reveal className="rd-ending-content"><span className="rd-kicker">THE NEXT CHAPTER</span><h2>Let's build a<br/><em>better way to work.</em></h2><p>Tell us what you're working on. We'll explore where RABOS could make a difference.</p><Link to="/contact" className="rd-button rd-button-dark">Start a conversation <MoveUpRight size={18}/></Link></Reveal><div className="rd-ending-meta"><span>RIDDOFF TECHNOLOGIES</span><span>INTELLIGENCE, WITH INTENTION.</span></div></div></section>
  </main>;
};
export default CinematicIndex;
