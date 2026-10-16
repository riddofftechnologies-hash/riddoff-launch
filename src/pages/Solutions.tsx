import { Link } from "react-router-dom";
import { PageIntro, PageCTA } from "@/components/MarketingBlocks";
import { ArrowUpRight } from "lucide-react";

const solutions = [
  { title: "Operational visibility", description: "Bring important business information into a clearer view, so teams can spend less time finding context." },
  { title: "Connected workflows", description: "Understand how requests, work and decisions move across people and departments." },
  { title: "Customer operations", description: "Keep relationships, enquiries and follow-ups organized around the work that matters." },
  { title: "Thoughtful automation", description: "Explore appropriate assistance and workflow automation with explicit human oversight where needed." },
];

const Solutions = () => (
  <div className="mp-page">
    <PageIntro eyebrow="RIDDOFF / SOLUTIONS" title="Make room for better work." description="Connected systems, clearer responsibilities and useful information. Our approach starts with understanding how your business really works."/>
    <section className="mp-section">
      <div className="mp-wrap">
        <div className="mp-section-label">HOW WE HELP</div>
        <h2 className="mp-section-title">The essentials, thoughtfully connected.</h2>
        <div className="mp-link-list">
          {solutions.map((s,i) => (
            <Link to="/contact" className="mp-link-row" key={s.title}>
              <span className="mp-link-row-number">0{i+1}</span><strong>{s.title}</strong><span>{s.description}</span><ArrowUpRight size={18} aria-hidden="true"/>
            </Link>
          ))}
        </div>
        <p className="mp-disclosure">Capabilities, integrations and deployment options are assessed based on each organization's requirements.</p>
      </div>
    </section>
    <PageCTA title="Bring us your biggest bottleneck." description="We'll talk through your current process and where improved systems could help."/>
  </div>
);
export default Solutions;
