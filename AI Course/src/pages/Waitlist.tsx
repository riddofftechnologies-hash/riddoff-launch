import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Loader2, CheckCircle2, Hammer, Rocket, Crown, HelpCircle } from "lucide-react";
import { createWaitlistEntry, type WaitlistEntry } from "@/lib/firestore";
import Footer from "@/components/Footer";

type Track = WaitlistEntry["track"];
type Background = WaitlistEntry["background"];

const TRACKS: { value: Track; label: string; hint: string; icon: typeof Hammer }[] = [
  { value: "builder", label: "Builder", hint: "Join a team, ship real projects", icon: Hammer },
  { value: "founder", label: "Founder Member", hint: "Build a team around your idea", icon: Rocket },
  { value: "equity", label: "Equity Partner", hint: "Apply to build with Riddoff", icon: Crown },
  { value: "unsure", label: "Not sure yet", hint: "Help me find the right fit", icon: HelpCircle },
];

const BACKGROUNDS: { value: Background; label: string }[] = [
  { value: "working", label: "Working professional" },
  { value: "self-taught", label: "Self-taught" },
  { value: "dropout", label: "Dropout" },
  { value: "student", label: "Student / Grad" },
];

const PRINCIPLES = [
  "You build real products, not assignments.",
  "You own what you ship — equity, not certificates.",
  "You work alongside Riddoff's principal engineers.",
];

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState<Track>("builder");
  const [background, setBackground] = useState<Background>("working");
  const [idea, setIdea] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const canSubmit = name.trim().length > 0 && emailValid && status !== "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setError("");
    try {
      await createWaitlistEntry({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        track,
        background,
        idea: idea.trim(),
      });
      setStatus("done");
    } catch (err) {
      console.error("[Waitlist] submit failed:", err);
      setError("Something went wrong saving your spot. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white text-foreground flex flex-col">
      {/* Minimal top bar */}
      <header className="border-b border-[#E0E0E0]">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">
              Riddoff <span className="text-muted-foreground font-medium">Ed</span>
            </span>
          </a>
          <a
            href="https://www.riddoff.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline"
          >
            Riddoff Technologies →
          </a>
        </div>
      </header>

      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — positioning */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase">
              Founding members · Now open
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Build. Ship. Own.
            </h1>

            <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-md">
              Riddoff Ed isn't a course. It's where builders and founders ship real
              products alongside the engineers behind Riddoff Technologies — and own
              what they make.
            </p>

            <ul className="mt-8 space-y-3">
              {PRINCIPLES.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs text-muted-foreground">
              We're admitting a small founding cohort before public launch. Join the
              waitlist to claim your place.
            </p>
          </motion.div>

          {/* Right — form / success */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-[#E0E0E0] shadow-sm p-6 sm:p-8 bg-white"
          >
            {status === "done" ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} className="text-primary" />
                </div>
                <h2 className="mt-5 text-2xl font-bold">You're on the list.</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Welcome, {name.trim().split(" ")[0]}. We'll reach out to{" "}
                  <span className="font-medium text-foreground">{email.trim().toLowerCase()}</span>{" "}
                  as founding spots open. In the meantime — start thinking about what
                  you want to build.
                </p>
                <a
                  href="https://www.riddoff.com"
                  className="inline-flex items-center gap-2 mt-7 text-sm font-semibold text-primary no-underline"
                >
                  See what Riddoff builds <ArrowRight size={15} />
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-xl font-bold">Join the founding waitlist</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Takes 30 seconds. No commitment yet.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="wl-name" className="text-sm font-semibold">
                    Name
                  </label>
                  <input
                    id="wl-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={120}
                    placeholder="Your name"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E0E0E0] rounded-lg bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="wl-email" className="text-sm font-semibold">
                    Email
                  </label>
                  <input
                    id="wl-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E0E0E0] rounded-lg bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-sm font-semibold mb-1">Which track fits you?</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {TRACKS.map((t) => {
                      const Icon = t.icon;
                      const active = track === t.value;
                      return (
                        <button
                          type="button"
                          key={t.value}
                          onClick={() => setTrack(t.value)}
                          aria-pressed={active}
                          className={`text-left p-3 rounded-lg border transition-colors ${
                            active
                              ? "border-primary bg-accent"
                              : "border-[#E0E0E0] hover:border-primary/40"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={active ? "text-primary" : "text-muted-foreground"}
                          />
                          <div className="mt-1.5 text-sm font-semibold">{t.label}</div>
                          <div className="text-xs text-muted-foreground leading-snug">
                            {t.hint}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="space-y-1.5">
                  <label htmlFor="wl-bg" className="text-sm font-semibold">
                    Where are you coming from?
                  </label>
                  <select
                    id="wl-bg"
                    value={background}
                    onChange={(e) => setBackground(e.target.value as Background)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E0E0E0] rounded-lg bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {BACKGROUNDS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="wl-idea" className="text-sm font-semibold">
                    What do you want to build?{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="wl-idea"
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder="An idea, a problem you care about, or just what you're hoping to ship."
                    className="w-full px-3.5 py-2.5 text-sm border border-[#E0E0E0] rounded-lg bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Saving your spot…
                    </>
                  ) : (
                    <>
                      Claim my founding spot <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By joining you agree to hear from Riddoff Ed. No spam, ever.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
