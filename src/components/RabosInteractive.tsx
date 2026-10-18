import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, Layers3 } from "lucide-react";
import { industryProblems, rabosModules, visualGallery } from "@/data/productShowcase";
import { Reveal, VisualFrame } from "@/components/ShowcaseMotion";

export function ModuleExplorer({ compact = false }: { compact?: boolean }) {
  const [current, setCurrent] = useState(0);
  const reduced = useReducedMotion();
  const item = rabosModules[current];
  return (
    <section id="modules" className={compact ? "rx-modules rx-modules-compact" : "rx-modules"} aria-labelledby="rx-modules-title">
      <div className="rx-container">
        <Reveal className="rx-section-heading">
          <div><span className="rx-eyebrow">A CONNECTED PLATFORM / 09 AREAS</span><h2 id="rx-modules-title">Explore the work behind the business.</h2></div>
          <p>Select a module to see the problem, the relevant capabilities, and the intended operational benefit.</p>
        </Reveal>
        <div className="rx-module-layout">
          <div className="rx-module-nav" aria-label="RABOS module selection">
            {rabosModules.map((module, index) => (
              <button type="button" aria-pressed={current === index} key={module.id} className={current === index ? "rx-module-nav-item active" : "rx-module-nav-item"} onClick={() => setCurrent(index)}>
                <span className="rx-number">{String(index+1).padStart(2, "0")}</span><span>{module.title}</span><ChevronRight size={17} aria-hidden="true"/>
              </button>
            ))}
          </div>
          <div className="rx-module-detail">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={item.id} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .26 }}>
                <div className="rx-module-label"><span>MODULE {String(current+1).padStart(2, "0")}</span><span>{item.badge || "Operational workspace"}</span></div>
                <h3>{item.title}<span>.</span></h3>
                <p className="rx-module-subtitle">{item.short}</p>
                <div className="rx-module-stories">
                  <div><span className="rx-mini-heading">THE BUSINESS PROBLEM</span><p>{item.problem}</p></div>
                  <div><span className="rx-mini-heading">HOW RABOS APPROACHES IT</span><p>{item.answer}</p></div>
                </div>
                {item.image ? (
                  <VisualFrame src={item.image} alt={item.imageLabel || item.title + " interface"} caption={item.imageType === "capture" ? "Internal interface review capture — not a live tenant dashboard." : "Illustrative RABOS product design."} label={item.imageLabel || item.title + " review"} className="rx-module-screenshot"/>
                ) : (
                  <div className="rx-capability-art" aria-label="Illustrative connected capabilities diagram">
                    <div className="rx-capability-art-heading"><Layers3 size={17} aria-hidden="true"/> WORKFLOW VIEW <span>ILLUSTRATIVE</span></div>
                    <div className="rx-capability-art-flow">
                      <span>{item.title}</span><span className="rx-connector-track" aria-hidden="true"/><span>Shared context</span><span className="rx-connector-track" aria-hidden="true"/><span>Next action</span>
                    </div>
                    <p>A conceptual diagram, not a screenshot from a production tenant.</p>
                  </div>
                )}
                <div className="rx-module-lower">
                  <div><span className="rx-mini-heading">CAPABILITIES</span><ul>{item.capabilities.map(x=><li key={x}><Check size={14} aria-hidden="true"/>{x}</li>)}</ul></div>
                  <div><span className="rx-mini-heading">WHAT IT HELPS ENABLE</span><p>{item.outcome}</p><Link to={item.href} className="rx-inline-link">Explore module interface <ArrowUpRight size={16} aria-hidden="true"/></Link></div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="rx-module-controls"><span>{String(current+1).padStart(2,"0")} <span>/ {String(rabosModules.length).padStart(2,"0")}</span></span><div><button type="button" aria-label="Previous RABOS module" onClick={()=>setCurrent((current + rabosModules.length - 1) % rabosModules.length)}><ArrowLeft size={17}/></button><button type="button" aria-label="Next RABOS module" onClick={()=>setCurrent((current + 1) % rabosModules.length)}><ArrowRight size={17}/></button></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IndustrySolutions() {
  const [current, setCurrent] = useState(0);
  const item=industryProblems[current];
  return (
    <section id="solutions" className="rx-industry" aria-labelledby="rx-industry-heading">
      <div className="rx-container">
        <Reveal className="rx-section-heading">
          <div><span className="rx-eyebrow">FROM THE REAL WORLD</span><h2 id="rx-industry-heading">Start with the problem.</h2></div>
          <p>Explore how connected modules can bring clarity to different kinds of work.</p>
        </Reveal>
        <div className="rx-industry-switch">{industryProblems.map((x,i)=><button key={x.id} type="button" aria-pressed={current===i} className={current===i?"selected":""} onClick={()=>setCurrent(i)}>{x.title}</button>)}</div>
        <div className="rx-industry-grid">
          <div className="rx-industry-copy">
            <span className="rx-mini-heading">{item.pressure}</span>
            <h3>{item.problem}</h3>
            <p>{item.solution}</p>
            <div className="rx-industry-tags">{item.modules.map(m=><span key={m}>{m}</span>)}</div>
            <div className="rx-disclosure">{item.detail}</div>
            <Link to="/contact" className="rx-inline-link">Discuss your workflow <ArrowUpRight size={16} aria-hidden="true"/></Link>
          </div>
          <VisualFrame src={item.image} alt={item.title+" related interface review"} caption={item.id==="manufacturing"?"Manufacturing quotation screen from an internal interface review.":item.id==="retail"?"Dashboard configuration design review.":"CRM workflow interface review."} />
        </div>
      </div>
    </section>
  );
}

export function ProductGallery() {
  const [selected, setSelected] = useState(0);
  const item=visualGallery[selected];
  return (
    <section className="rx-gallery" id="gallery" aria-labelledby="rx-gallery-title">
      <div className="rx-container">
        <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">A CLOSER LOOK</span><h2 id="rx-gallery-title">Screens from the work.</h2></div><p>Actual images from Riddoff's private RABOS interface-review materials, brought into this website with transparent labels. They are not live tenant screens.</p></Reveal>
        <VisualFrame key={item.src} src={item.src} alt={item.label} caption={item.tag+" · Review artifact; functionality and readiness may vary by release."} className="rx-gallery-main"/>
        <div className="rx-gallery-tabs" aria-label="Choose an interface image">{visualGallery.map((x,i)=><button key={x.src} type="button" aria-pressed={selected===i} className={selected===i?"selected":""} onClick={()=>setSelected(i)}><span>{String(i+1).padStart(2,"0")}</span>{x.label}</button>)}</div>
      </div>
    </section>
  );
}
