import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleDot, GitBranch, LockKeyhole, ShieldCheck } from "lucide-react";
import { dotRoles, specialistRoles, workflowSteps } from "@/data/productShowcase";
import { Reveal } from "@/components/ShowcaseMotion";

export function DotNetwork({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<(typeof dotRoles)[number]["id"]>("master");
  const reduced = useReducedMotion();
  const item=dotRoles.find(x=>x.id===active) || dotRoles[0];
  return (
    <div className={compact ? "rx-dot-network compact" : "rx-dot-network"}>
      <div className="rx-dot-diagram" aria-label="Interactive diagram of Master, Engineering, Support and Operations Dots">
        <div className="rx-dot-master-row">
          <button aria-pressed={active==="master"} type="button" className={active==="master"?"rx-dot-node master selected":"rx-dot-node master"} onClick={()=>setActive("master")}>
            <span className="rx-dot-glyph">M</span><span><strong>Master Dot</strong><small>Founder interface</small></span>
          </button>
        </div>
        <div className="rx-dot-trunk" aria-hidden="true"><span/></div>
        <div className="rx-dot-branches">
          {dotRoles.slice(1).map((dot,index)=>(
            <div className="rx-dot-branch" key={dot.id}>
              <span className="rx-dot-branch-line" aria-hidden="true"/>
              <button type="button" aria-pressed={active===dot.id} className={active===dot.id?"rx-dot-node selected":"rx-dot-node"} onClick={()=>setActive(dot.id)}>
                <span className="rx-dot-glyph">{dot.label.slice(0,1)}</span><span><strong>{dot.label}</strong><small>{["Build and validate","Triage and respond","Keep work moving"][index]}</small></span>
              </button>
            </div>
          ))}
        </div>
        <div className="rx-dot-specialists"><span>SPECIALIST AGENTS / GOVERNED TASKS</span><div>{["Architect","Builder","QA","Security","Release"].map(x=><span key={x}>{x}</span>)}</div></div>
      </div>
      {!compact && <div className="rx-dot-detail" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={item.id} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={reduced?undefined:{opacity:0,y:-8}} transition={{duration:.23}}>
            <span className="rx-eyebrow">SELECT A DOT TO EXPLORE</span>
            <h3>{item.label}</h3>
            <h4>{item.title}</h4>
            <p>{item.role}</p>
            <ul>{item.examples.map(example=><li key={example}><CheckCircle2 size={16} aria-hidden="true"/>{example}</li>)}</ul>
          </motion.div>
        </AnimatePresence>
      </div>}
    </div>
  );
}

export function ExecutionTimeline() {
  const [active,setActive] = useState(0);
  const step = workflowSteps[active];
  return <section id="how-it-works" className="rx-flow-timeline" aria-labelledby="rx-flow-title">
    <div className="rx-container">
      <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">FROM INTENT TO DELIVERY</span><h2 id="rx-flow-title">One request. A visible path.</h2></div><p>A representative workflow based on the Control Center architecture. Every deployment must meet its own authorization and runtime gates.</p></Reveal>
      <div className="rx-flow-grid">
        <div className="rx-flow-steps">{workflowSteps.map((x,i)=><button type="button" key={x.label} className={active===i?"rx-flow-step selected":"rx-flow-step"} aria-pressed={active===i} onClick={()=>setActive(i)}><span>{x.label}</span><strong>{x.title}</strong><ArrowRight size={16} aria-hidden="true"/></button>)}</div>
        <div className="rx-flow-demo">
          <div className="rx-console-bar"><span><CircleDot size={14} aria-hidden="true"/> CONTROL CENTER / WORKFLOW CONCEPT</span><span>INTERACTIVE WALKTHROUGH</span></div>
          <div className="rx-console-body">
            <div className="rx-console-index">STEP {step.label} / 05</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <div className="rx-flow-progress" aria-label={`Step ${active+1} of 5`}>{workflowSteps.map((_,i)=><span key={i} className={i<=active?"filled":""}/>)}</div>
            <div className="rx-console-pill"><ShieldCheck size={16} aria-hidden="true"/> Founder oversight remains central</div>
            <button type="button" className="rx-console-next" onClick={()=>setActive((active+1)%workflowSteps.length)}>{active===workflowSteps.length-1?"Return to the start":"Explore next step"} <ArrowRight size={17} aria-hidden="true"/></button>
          </div>
          <div className="rx-console-foot">Illustrative interaction · Does not start agents or change production</div>
        </div>
      </div>
    </div>
  </section>;
}

export function ControlGuardrails() {
  const controls = [
    { icon: LockKeyhole, title: "Approve before execution", text: "Requests are proposed under explicit decisions, policies and operator authority." },
    { icon: GitBranch, title: "Work away from main", text: "Engineering work uses isolated branches and review gates rather than autonomously pushing production code." },
    { icon: ShieldCheck, title: "Evidence before acceptance", text: "Validation, human review and audit context remain part of the delivery path." },
  ];
  return <section className="rx-guardrails" id="governance" aria-labelledby="rx-guardrails-heading"><div className="rx-container">
    <Reveal className="rx-section-heading"><div><span className="rx-eyebrow">CONTROL IS A FEATURE</span><h2 id="rx-guardrails-heading">Powerful tools. Clear boundaries.</h2></div><p>Built around a simple principle: agents assist and execute only when the right person has authorized the work.</p></Reveal>
    <div className="rx-guardrail-grid">{controls.map((x,i)=><Reveal delay={i*.06} className="rx-guardrail-card" key={x.title}><x.icon size={25} strokeWidth={1.5} aria-hidden="true"/><h3>{x.title}</h3><p>{x.text}</p></Reveal>)}</div>
    <div className="rx-role-list"><span className="rx-mini-heading">SPECIALIST AGENT ROLES</span><div>{specialistRoles.map(x=><span key={x}>{x}</span>)}</div><p>These are role definitions in the Control architecture. Live availability depends on staged activation and permitted runner access.</p></div>
  </div></section>;
}
