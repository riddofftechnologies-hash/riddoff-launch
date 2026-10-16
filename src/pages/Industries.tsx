import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, PageCTA } from "@/components/MarketingBlocks";

const industries = [
  { title: "Manufacturing", description: "Coordinate materials, production activity and the operational work that keeps orders moving." },
  { title: "Retail & distribution", description: "Make day-to-day visibility across sales, stock and fulfillment easier for teams." },
  { title: "Service businesses", description: "Bring customer requests, follow-ups and internal work into a more connected view." },
  { title: "Growing organizations", description: "Create consistent operating practices as teams, locations and responsibilities evolve." },
];

const Industries = () => (
  <div className="mp-page">
    <PageIntro eyebrow="RIDDOFF / INDUSTRIES" title="Built around real business." description="Different industries need different workflows. We begin with practical needs, rather than treating every company the same."/>
    <section className="mp-section">
      <div className="mp-wrap">
        <div className="mp-section-label">WHERE WE FOCUS</div>
        <h2 className="mp-section-title">Different work. Shared need for clarity.</h2>
        <div className="mp-link-list">
          {industries.map((item,i) => (
            <Link className="mp-link-row" key={item.title} to="/contact">
              <span className="mp-link-row-number">0{i+1}</span><strong>{item.title}</strong><span>{item.description}</span><ArrowUpRight size={18} aria-hidden="true"/>
            </Link>
          ))}
        </div>
        <p className="mp-disclosure">Illustrative use cases. Industry-specific fit and product readiness should be confirmed in a discussion with our team.</p>
      </div>
    </section>
    <PageCTA title="Let's understand your industry." description="Show us the details of your workflow. We'll explore what's appropriate for your business."/>
  </div>
);
export default Industries;
