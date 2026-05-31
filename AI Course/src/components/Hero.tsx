import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(query);
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="bg-[#F0F7FF] py-14 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider">
            Founding cohort · Now open
          </span>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.05] tracking-tight">
            Build. Ship. <span className="text-primary">Own.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            Riddoff Ed isn't a course platform. It's where builders and founders
            ship real products alongside the engineers behind{" "}
            <span className="text-foreground font-medium">Riddoff Technologies</span>{" "}
            — and walk away owning what they make.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/waitlist"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors no-underline"
            >
              Claim your founding spot <ArrowRight size={16} />
            </Link>
            <button
              type="button"
              onClick={() =>
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-foreground text-sm font-semibold rounded-lg border border-[#E0E0E0] hover:border-primary/40 transition-colors"
            >
              See what's being built
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 flex gap-2 max-w-lg">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search projects, tracks, or skills…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-sm border border-[#E0E0E0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="px-5 sm:px-6 py-3 bg-white text-foreground text-sm font-semibold rounded-lg border border-[#E0E0E0] hover:border-primary/40 transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
