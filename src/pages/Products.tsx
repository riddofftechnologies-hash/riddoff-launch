import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, PageCTA, TextArrowLink } from "@/components/MarketingBlocks";

const Products = () => (
  <div className="mp-page">
    <PageIntro eyebrow="RIDDOFF / PRODUCTS" title="Technology made for the way you work." description="We build business software with one goal: making complex operations easier to understand, connect and manage.">
      <div className="mp-intro-actions"><Link className="mp-button" to="/products/riddoff-erp">Explore RABOS <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    </PageIntro>
    <section className="mp-section">
      <div className="mp-wrap">
        <div className="mp-section-label">01 / FEATURED PLATFORM</div>
        <div className="mp-featured">
          <div>
            <span className="mp-overline">BUSINESS OPERATING SYSTEM</span>
            <h2>Meet RABOS.</h2>
            <p>A connected business workspace designed to bring teams, operational processes and information into focus. Explore the core areas of the platform and the direction we're building toward.</p>
            <TextArrowLink to="/products/riddoff-erp">Explore the platform</TextArrowLink>
            <div className="mp-feature-note">Specific module availability and automation capabilities depend on deployment.</div>
          </div>
          <div className="mp-feature-illustration" aria-label="Illustration of the connected RABOS operating experience">
            <div className="mp-feature-illustration-top"><span>RIDDOFF / RABOS</span><span>WORKSPACE CONCEPT</span></div>
            <div className="mp-feature-illustration-core">
              <span className="mp-feature-illustration-logo">rabos</span>
              <strong>One connected workspace.</strong>
              <p>Designed to bring the work of your business together.</p>
            </div>
            <div className="mp-feature-illustration-tags"><span>SALES</span><span>OPERATIONS</span><span>INVENTORY</span><span>INSIGHTS</span></div>
          </div>
        </div>
      </div>
    </section>
    <section className="mp-section mp-section-muted">
      <div className="mp-wrap">
        <div className="mp-section-label">02 / OTHER INITIATIVES</div>
        <h2 className="mp-section-title">Focused ideas for real industries.</h2>
        <p className="mp-section-description">Riddoff also explores industry-specific software. Contact us for details and current availability.</p>
        <div className="mp-pair-grid">
          <div className="mp-pair"><span className="mp-pair-number">01</span><h3>FleetX</h3><p>Software direction focused on fleet and logistics coordination.</p><TextArrowLink to="/contact">Enquire about FleetX</TextArrowLink></div>
          <div className="mp-pair"><span className="mp-pair-number">02</span><h3>GRYNDUP</h3><p>Software direction focused on fitness businesses and the everyday needs of their teams.</p><TextArrowLink to="/contact">Enquire about GRYNDUP</TextArrowLink></div>
        </div>
      </div>
    </section>
    <PageCTA title="Let's discuss your operations." description="Tell us what you're building and where a connected system could make a meaningful difference."/>
  </div>
);
export default Products;
