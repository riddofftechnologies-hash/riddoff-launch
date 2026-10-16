import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Menu, X } from "lucide-react";
import "./LayoutMinimal.css";

const navigation = [
  { label: "Platform", to: "/products/riddoff-erp" },
  { label: "Products", to: "/products" },
  { label: "Solutions", to: "/solutions" },
  { label: "Industries", to: "/industries" },
  { label: "Company", to: "/company" },
];

function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  return (
    <header className="r-shell-header">
      <div className="r-shell-nav">
        <Link className="r-shell-logo" to="/" aria-label="Riddoff, home">riddoff<span>.</span></Link>
        <nav className="r-shell-desktop-nav" aria-label="Main navigation">
          {navigation.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "r-shell-nav-link active" : "r-shell-nav-link"}
              aria-current={location.pathname === link.to ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="r-shell-header-actions">
          <Link to="/contact" className="r-shell-demo-link">Book a demo <ArrowUpRight size={16} aria-hidden="true"/></Link>
          <button
            className="r-shell-menu-button"
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="r-shell-mobile-nav"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? <X size={22} aria-hidden="true"/> : <Menu size={22} aria-hidden="true"/>}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="r-shell-mobile-nav" id="r-shell-mobile-nav" aria-label="Mobile navigation">
          {navigation.map(link => (
            <Link to={link.to} key={link.to} className={location.pathname === link.to ? "active" : ""} onClick={() => setMobileOpen(false)}>
              {link.label}<ArrowRight size={17} aria-hidden="true"/>
            </Link>
          ))}
          <Link to="/contact" className="r-shell-mobile-cta" onClick={() => setMobileOpen(false)}>Book a demo <ArrowUpRight size={17} aria-hidden="true"/></Link>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="r-shell-footer">
      <div className="r-shell-footer-grid">
        <div className="r-shell-footer-brand">
          <Link className="r-shell-logo" to="/" aria-label="Riddoff, home">riddoff<span>.</span></Link>
          <p>Thoughtful business technology.<br/>Made for real operations.</p>
        </div>
        <div className="r-shell-footer-column">
          <h2>Explore</h2>
          <Link to="/products/riddoff-erp">RABOS</Link>
          <Link to="/products">Products</Link>
          <Link to="/solutions">Solutions</Link>
          <Link to="/industries">Industries</Link>
        </div>
        <div className="r-shell-footer-column">
          <h2>Company</h2>
          <Link to="/company">About Riddoff</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="r-shell-footer-column r-shell-footer-contact">
          <h2>Start a conversation</h2>
          <a href="mailto:system@riddoff.com">system@riddoff.com <ArrowUpRight size={15} aria-hidden="true"/></a>
          <p>Tell us about the challenge you're trying to solve.</p>
        </div>
      </div>
      <div className="r-shell-footer-bottom"><span>© {new Date().getFullYear()} Riddoff Technologies</span><span>Business systems, simplified.</span></div>
    </footer>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="r-shell">
      <a href="#main-content" className="r-shell-skip">Skip to main content</a>
      <Header/>
      <main className="r-shell-main" id="main-content">{children}</main>
      <Footer/>
    </div>
  );
}
