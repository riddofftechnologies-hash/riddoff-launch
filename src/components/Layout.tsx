import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Instagram, Linkedin, ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import { Menu, X } from "lucide-react";


const navLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Platforms", href: "/platforms" },
  { label: "Industries", href: "/industries" },
  { label: "Careers", href: "https://ed.riddoff.com", external: true },
  { label: "About", href: "/company" },
  { label: "Contact", href: "/contact" },
];

const springConfig = { stiffness: 90, damping: 20, mass: 0.6 };

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const location = useLocation();

  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setAtTop(v < 40));
    return unsub;
  }, [scrollY]);

  // All values interpolated continuously from scroll position — no binary state snap
  const rawTop      = useTransform(scrollY, [0, 80], [0, 14]);
  const rawRadius   = useTransform(scrollY, [0, 80], [0, 9999]);
  const rawMaxW     = useTransform(scrollY, [0, 80], [9999, 900]);
  const rawPad      = useTransform(scrollY, [0, 80], [0, 6]);
  const rawGlassOp  = useTransform(scrollY, [0, 80], [0, 1]);
  const rawShadowOp = useTransform(scrollY, [0, 80], [0, 1]);
  const rawHeight   = useTransform(scrollY, [0, 80], [64, 48]);
  const rawFontSize = useTransform(scrollY, [0, 80], [22, 18]);
  const rawGap      = useTransform(scrollY, [0, 80], [0, 32]);

  const top      = useSpring(rawTop,      springConfig);
  const radius   = useSpring(rawRadius,   springConfig);
  const maxW     = useSpring(rawMaxW,     springConfig);
  const pad      = useSpring(rawPad,      springConfig);
  const glassOp  = useSpring(rawGlassOp,  springConfig);
  const shadowOp = useSpring(rawShadowOp, springConfig);
  const height   = useSpring(rawHeight,   springConfig);
  const fontSize = useSpring(rawFontSize, springConfig);
  const gap      = useSpring(rawGap,      springConfig);
  const width    = useMotionTemplate`calc(100% - ${gap}px)`;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        className="pointer-events-auto border border-white/20 overflow-hidden"
        style={{
          position: "fixed",
          top,
          left: "50%",
          x: "-50%",
          width,
          maxWidth: maxW,
          borderRadius: radius,
          paddingLeft: pad,
          paddingRight: pad,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          backgroundColor: atTop ? "hsl(206, 97%, 15%)" : "rgba(255,255,255,0)",
        }}
      >
        {/* Glass tint layer — fades in on scroll */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: atTop ? 0 : glassOp,
            background: "rgba(255,255,255,0.22)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.15)",
            borderRadius: "inherit",
          }}
        />
        {/* Shadow layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: shadowOp,
            boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
            borderRadius: "inherit",
          }}
        />

        <motion.div
          className="relative flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 w-full max-w-screen-2xl mx-auto"
          style={{ height }}
        >
          <motion.div style={{ fontSize }} className="flex-shrink-0">
            <Link to="/" className={`font-satoshi font-bold tracking-tight transition-colors duration-300 ${atTop ? "text-white" : "text-foreground"}`}>
              Riddoff
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => {
              const cls = `font-satoshi text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap ${
                atTop
                  ? location.pathname === link.href ? "text-white" : "text-white/65 hover:text-white"
                  : location.pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`;
              const underline = <span className={`absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${atTop ? "bg-white" : "bg-primary"} ${location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />;
              return link.external ? (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {link.label}{underline}
                </a>
              ) : (
                <Link key={link.href} to={link.href} className={cls}>
                  {link.label}{underline}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center flex-shrink-0">
            <Link
              to="/contact"
              className={`font-satoshi px-5 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                atTop ? "bg-white text-[#012a4a] hover:bg-white/90" : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              Start free trial
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden transition-colors ${atTop ? "text-white" : "text-foreground"}`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-background border-t border-border"
            >
              <div className="flex flex-col p-6 gap-4">
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="font-satoshi text-foreground font-medium hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="font-satoshi text-foreground font-medium hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="font-satoshi bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold text-center"
                >
                  Start free trial
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground py-10 sm:py-16">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-8">
        <div className="col-span-2 sm:col-span-3 md:col-span-1">
          <h3 className="font-melodrama text-xl font-bold mb-4">Riddoff</h3>
          <p className="text-secondary-foreground/70 text-sm leading-relaxed">
            Enterprise automation that runs<br />businesses, not just interfaces.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-melodrama font-semibold mb-1.5">Products</h4>
          <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
            <Link to="/products/riddoff-erp" className="font-melodrama hover:text-secondary-foreground transition-colors">Rabos ERP</Link>
            <Link to="/products" className="font-melodrama hover:text-secondary-foreground transition-colors">FleetX</Link>
            <Link to="/products" className="font-melodrama hover:text-secondary-foreground transition-colors">GRYNDUP</Link>
          </div>
        </div>
        <div>
          <h4 className="font-melodrama font-semibold mb-1.5">Solutions</h4>
          <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
            <Link to="/solutions" className="font-melodrama hover:text-secondary-foreground transition-colors">Core Financials</Link>
            <Link to="/solutions" className="font-melodrama hover:text-secondary-foreground transition-colors">Supply-chain</Link>
            <Link to="/solutions" className="font-melodrama hover:text-secondary-foreground transition-colors">HR & Payroll</Link>
            <Link to="/solutions" className="font-melodrama hover:text-secondary-foreground transition-colors">Billing</Link>
            <Link to="/platforms" className="font-melodrama hover:text-secondary-foreground transition-colors">Infrastructure</Link>
          </div>
        </div>
        <div>
          <h4 className="font-melodrama font-semibold mb-1.5">Industries</h4>
          <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
            <Link to="/industries" className="font-melodrama hover:text-secondary-foreground transition-colors">Manufacturing</Link>
            <Link to="/industries" className="font-melodrama hover:text-secondary-foreground transition-colors">Non-profits</Link>
            <Link to="/industries" className="font-melodrama hover:text-secondary-foreground transition-colors">Retail</Link>
            <Link to="/industries" className="font-melodrama hover:text-secondary-foreground transition-colors">Distribution</Link>
          </div>
        </div>
        <div>
          <h4 className="font-melodrama font-semibold mb-1.5">Company</h4>
          <div className="flex flex-col gap-1 text-sm text-secondary-foreground/70">
            <Link to="/company" className="font-melodrama hover:text-secondary-foreground transition-colors">About</Link>
            <Link to="/contact" className="font-melodrama hover:text-secondary-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
      <div className="font-melodrama border-t border-secondary-foreground/10 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-secondary-foreground/50">
        © 2026 Riddoff. All rights reserved.
      </div>
    </div>
  </footer>
);

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 w-10 h-10 sm:w-11 sm:h-11 bg-secondary text-white flex items-center justify-center rounded-lg shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="sm:hidden" />
          <ArrowUp size={20} className="hidden sm:block" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
