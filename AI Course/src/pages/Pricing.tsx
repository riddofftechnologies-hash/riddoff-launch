import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Hammer, Rocket, Crown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Billing = "monthly" | "annual";

interface Tier {
  id: string;
  name: string;
  icon: typeof Hammer;
  tagline: string;
  monthly: number | null; // null = custom / application-only
  highlight?: boolean;
  cta: string;
  ctaTo: string;
  features: string[];
}

const TIERS: Tier[] = [
  {
    id: "builder",
    name: "Builder",
    icon: Hammer,
    tagline: "Join a team and ship real projects.",
    monthly: 49,
    cta: "Join the waitlist",
    ctaTo: "/waitlist",
    features: [
      "Placement on a live build team",
      "Access to real, shipping projects",
      "Builder community",
      "Monthly or annual billing",
    ],
  },
  {
    id: "founder",
    name: "Founder Member",
    icon: Rocket,
    tagline: "Build a team around your own idea.",
    monthly: 199,
    highlight: true,
    cta: "Join the waitlist",
    ctaTo: "/waitlist",
    features: [
      "Everything in Builder",
      "Submit your idea and build a team around it",
      "Direct line to Riddoff principal engineers",
      "Priority project queue",
    ],
  },
  {
    id: "equity",
    name: "Equity Partner",
    icon: Crown,
    tagline: "Build with Riddoff — for equity.",
    monthly: null,
    cta: "Apply for the equity track",
    ctaTo: "/waitlist",
    features: [
      "Application and manual review",
      "Custom arrangement — no automatic billing",
      "Build alongside the Riddoff core team",
      "Equity in what you build",
    ],
  },
];

function priceLabel(tier: Tier, billing: Billing) {
  if (tier.monthly === null) return { big: "Apply", small: "by application only" };
  if (billing === "monthly") return { big: `$${tier.monthly}`, small: "per month" };
  // Annual: 2 months free → 10× monthly, shown as effective monthly.
  const perMonth = Math.round((tier.monthly * 10) / 12);
  return { big: `$${perMonth}`, small: `per month · billed annually ($${tier.monthly * 10}/yr)` };
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#F0F7FF] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider">
              Founding cohort pricing
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Choose how you build
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Three ways to build with Riddoff — from joining a team to building your
              own company. No certificates. Real products you own.
            </p>

            {/* Billing toggle */}
            <div className="mt-8 inline-flex items-center bg-white border border-[#E0E0E0] rounded-full p-1">
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    billing === b ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b === "monthly" ? "Monthly" : "Annual"}
                  {b === "annual" && (
                    <span className={`ml-2 text-xs ${billing === b ? "text-white/80" : "text-primary"}`}>
                      2 months free
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Tiers */}
        <section className="px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              const price = priceLabel(tier, billing);
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`relative rounded-2xl bg-white p-7 flex flex-col ${
                    tier.highlight
                      ? "border-2 border-primary shadow-lg"
                      : "border border-[#E0E0E0] shadow-sm"
                  }`}
                >
                  {tier.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wider">
                      Most popular
                    </span>
                  )}

                  <div className="w-11 h-11 rounded-lg bg-accent flex items-center justify-center">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{tier.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>

                  <div className="mt-6">
                    <span className="text-4xl font-extrabold tracking-tight">{price.big}</span>
                    <p className="mt-1 text-xs text-muted-foreground">{price.small}</p>
                  </div>

                  <ul className="mt-6 space-y-3 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Check size={13} className="text-primary" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={tier.ctaTo}
                    className={`mt-7 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold no-underline transition-colors ${
                      tier.highlight
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "bg-white text-foreground border border-[#E0E0E0] hover:border-primary/40"
                    }`}
                  >
                    {tier.cta} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Not sure which fits?{" "}
            <Link to="/waitlist" className="text-primary font-semibold no-underline hover:underline">
              Join the waitlist
            </Link>{" "}
            and we'll help you choose.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
