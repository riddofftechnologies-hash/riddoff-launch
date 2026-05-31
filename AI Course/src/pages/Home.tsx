import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  Hammer,
  Rocket,
  Crown,
  KeyRound,
  Users2,
  Send,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PRINCIPLES = [
  { icon: Hammer, title: "Build real products", desc: "Production software for real users — not assignments graded on a rubric." },
  { icon: Users2, title: "Work with the principals", desc: "Build alongside the engineers who actually run Riddoff Technologies." },
  { icon: Send, title: "Ship to real users", desc: "Every project goes live. You leave with things people use, not demos." },
  { icon: KeyRound, title: "Own what you make", desc: "Keep your code, your product, and — for founders — equity. Not a certificate." },
];

const TRACKS = [
  { icon: Hammer, name: "Builder", price: "$49/mo", desc: "Join a build team and ship real projects.", to: "/pricing" },
  { icon: Rocket, name: "Founder Member", price: "$199/mo", desc: "Build a team around your own idea.", to: "/pricing", highlight: true },
  { icon: Crown, name: "Equity Partner", price: "Apply", desc: "Build with Riddoff — for equity.", to: "/waitlist" },
];

const STEPS = [
  { n: "01", title: "Join", desc: "Pick your track or join the waitlist. We onboard the founding cohort by hand." },
  { n: "02", title: "Get placed", desc: "Match to a build team — or, as a founder, build a team around your idea." },
  { n: "03", title: "Build & ship", desc: "Ship production software for real users, alongside Riddoff principals." },
  { n: "04", title: "Own it", desc: "Walk away owning your code, your product, and your equity." },
];

const COMPARE = [
  { label: "What you leave with", old: "A certificate", neu: "A shipped product + equity" },
  { label: "Projects", old: "Toy assignments", neu: "Real products, real users" },
  { label: "Who teaches", old: "Lecturers", neu: "Riddoff principal engineers" },
  { label: "After the program", old: "Start the job hunt", neu: "You own what you built" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-[#F0F7FF] py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider">
              Founding cohort · Now open
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] tracking-tight">
              Build. Ship. <span className="text-primary">Own.</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
              Riddoff Ed isn't a course platform. It's where builders and founders
              ship real products alongside the engineers behind{" "}
              <span className="text-foreground font-medium">Riddoff Technologies</span>{" "}
              — and walk away owning what they make.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                to="/waitlist"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors no-underline"
              >
                Claim your founding spot <ArrowRight size={16} />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-foreground text-sm font-semibold rounded-lg border border-[#E0E0E0] hover:border-primary/40 transition-colors no-underline"
              >
                See the tracks
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ── Principles ───────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">A founder-first program</h2>
            <p className="text-muted-foreground mb-10">Not another course platform.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PRINCIPLES.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white rounded-xl p-5 border border-[#E0E0E0] shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <p.icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Three ways to build</h2>
                <p className="text-muted-foreground">From joining a team to building your own company.</p>
              </div>
              <Link to="/pricing" className="text-sm font-semibold text-primary no-underline hover:underline shrink-0">
                Compare full pricing →
              </Link>
            </div>
            <div className="grid lg:grid-cols-3 gap-5">
              {TRACKS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`rounded-2xl bg-white p-6 flex flex-col ${
                    t.highlight ? "border-2 border-primary shadow-md" : "border border-[#E0E0E0] shadow-sm"
                  }`}
                >
                  <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center">
                    <t.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground flex-1">{t.desc}</p>
                  <p className="mt-4 text-2xl font-extrabold tracking-tight">{t.price}</p>
                  <Link
                    to={t.to}
                    className={`mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold no-underline transition-colors ${
                      t.highlight
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-white text-foreground border border-[#E0E0E0] hover:border-primary/40"
                    }`}
                  >
                    Learn more <ArrowRight size={15} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">How it works</h2>
            <p className="text-muted-foreground mb-10">From day one to owning what you ship.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="text-primary font-extrabold text-3xl tracking-tight">{s.n}</div>
                  <h3 className="mt-3 font-semibold text-lg">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ───────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Why this isn't a bootcamp</h2>
            <p className="text-muted-foreground mb-10">The difference is what you walk away with.</p>
            <div className="rounded-2xl border border-[#E0E0E0] bg-white overflow-hidden">
              <div className="grid grid-cols-3 bg-[#F0F0F0] text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <div className="px-5 py-3" />
                <div className="px-5 py-3">Traditional bootcamp</div>
                <div className="px-5 py-3 text-primary">Riddoff Ed</div>
              </div>
              {COMPARE.map((row) => (
                <div key={row.label} className="grid grid-cols-3 border-t border-[#E0E0E0] text-sm">
                  <div className="px-5 py-4 font-semibold">{row.label}</div>
                  <div className="px-5 py-4 text-muted-foreground flex items-start gap-2">
                    <X size={16} className="text-muted-foreground/60 mt-0.5 shrink-0" />
                    {row.old}
                  </div>
                  <div className="px-5 py-4 flex items-start gap-2">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    {row.neu}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Credibility ──────────────────────────────────────────────── */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Powered by</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold">Built by the team behind Riddoff Technologies</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              You're not learning from people who talk about shipping software. You're
              building next to the engineers who run a production automation platform
              every day — and the products you ship are real.
            </p>
            <a
              href="https://www.riddoff.com"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline hover:gap-3 transition-all"
            >
              Explore Riddoff Technologies <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-6xl mx-auto rounded-3xl bg-primary text-white px-6 py-14 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to build something you own?</h2>
            <p className="mt-3 text-white/80 max-w-xl mx-auto">
              We're admitting a small founding cohort before public launch. Claim your place.
            </p>
            <Link
              to="/waitlist"
              className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors no-underline"
            >
              Join the waitlist <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
