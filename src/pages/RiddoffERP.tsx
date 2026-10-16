import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, PageCTA } from "@/components/MarketingBlocks";

const modules = [
  { title: "Sales", description: "A shared view of sales activity and customer follow-ups.", href: "/products/riddoff-erp/sales" },
  { title: "Customer relationships", description: "Organize customer information and related work.", href: "/products/riddoff-erp/crm" },
  { title: "Inventory", description: "Keep track of stock workflows and operational context.", href: "/products/riddoff-erp/inventory" },
  { title: "Procurement", description: "Bring purchasing needs and handoffs into view.", href: "/products/riddoff-erp/procurement" },
  { title: "Manufacturing", description: "Explore workflows for production-related operations.", href: "/products/riddoff-erp/manufacturing" },
  { title: "Reports", description: "Explore business intelligence and reporting experiences.", href: "/products/riddoff-erp/reports" },
  { title: "Accounts", description: "Understand accounting-related workflows in context.", href: "/products/riddoff-erp/accounts" },
  { title: "Team & payroll", description: "Explore people and payroll workflows.", href: "/products/riddoff-erp/hr-payroll" },
  { title: "Task management", description: "Organize work, ownership and next steps.", href: "/products/riddoff-erp/task" },
];

const RiddoffERP = () => (
  <div className="mp-page">
    <PageIntro eyebrow="THE PLATFORM / RABOS" title="Your business, in one clearer view." description="RABOS is Riddoff's business operating system—a connected approach to the work, information and decisions behind everyday operations.">
      <div className="mp-intro-actions"><Link to="/contact" className="mp-button">Discuss RABOS <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    </PageIntro>
    <section className="mp-section">
      <div className="mp-wrap">
        <div className="mp-section-label">THE IDEA BEHIND RABOS</div>
        <div className="mp-split" style={{alignItems:"start", marginTop:50}}>
          <h2 className="mp-section-title" style={{marginTop:0}}>One system. A more connected way of working.</h2>
          <div>
            <p className="mp-section-description">As businesses grow, their tools often become separated from the work they're meant to support. RABOS is designed to connect operational context across business functions.</p>
            <p className="mp-section-description" style={{marginTop:22}}>Our goal is to make information accessible, responsibilities visible and workflows easier to manage—while evolving toward smarter assistance.</p>
          </div>
        </div>
      </div>
    </section>
    <section className="mp-section mp-section-muted">
      <div className="mp-wrap">
        <div className="mp-section-label">EXPLORE THE AREAS</div>
        <h2 className="mp-section-title">Built for the work that matters.</h2>
        <p className="mp-section-description">Explore interface and workflow concepts across key business functions.</p>
        <div className="mp-link-list">
          {modules.map((item,i) => (
            <Link key={item.href} to={item.href} className="mp-link-row">
              <span className="mp-link-row-number">{String(i+1).padStart(2,"0")}</span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              <ArrowUpRight size={17} aria-hidden="true"/>
            </Link>
          ))}
        </div>
        <p className="mp-disclosure">These module pages can contain illustrative examples. Confirm deployment readiness, integrations and current functionality with the Riddoff team before relying on a feature.</p>
      </div>
    </section>
    <section className="mp-section">
      <div className="mp-wrap">
        <div className="mp-split" style={{alignItems:"start"}}>
          <div><span className="mp-overline">BUILDING RESPONSIBLY</span><h2 className="mp-section-title">Intelligence with people in control.</h2></div>
          <div>
            <p className="mp-section-description">We are building toward systems that can surface information, assist decisions and increasingly coordinate work. Human oversight and accurate product descriptions matter throughout that journey.</p>
            <p className="mp-callout">Autonomous operation is a long-term direction, not a guarantee that all business functions already run autonomously.</p>
          </div>
        </div>
      </div>
    </section>
    <PageCTA title="Let's explore RABOS together." description="Share your business needs and we'll discuss a suitable path forward."/>
  </div>
);
export default RiddoffERP;
