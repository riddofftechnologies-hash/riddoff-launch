import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import "./MarketingPages.css";

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return (
    <section className="mp-intro">
      <div className="mp-wrap">
        <span className="mp-overline">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}

export function PageCTA({ eyebrow = "LET'S TALK", title, description, text = "Book a conversation" }: { eyebrow?: string; title: string; description: string; text?: string }) {
  return (
    <section className="mp-cta">
      <div className="mp-wrap mp-cta-content">
        <div>
          <span className="mp-overline">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <Link to="/contact" className="mp-button"> {text} <ArrowUpRight size={17} aria-hidden="true"/></Link>
      </div>
    </section>
  );
}

export function TextArrowLink({ to, children }: { to: string; children: ReactNode }) {
  return <Link to={to} className="mp-text-link">{children}<ArrowUpRight size={17} aria-hidden="true"/></Link>;
}
