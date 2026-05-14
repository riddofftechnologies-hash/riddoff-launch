import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const partners = ["Google", "Microsoft", "Amazon", "Meta", "IBM", "Deloitte"];

const stats = [
  { value: "50,500+", label: "Learners" },
  { value: "4.7", label: "Avg rating" },
  { value: "12", label: "Programs" },
  { value: "28", label: "Hiring partners" },
];

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
    <section className="bg-[#F0F7FF] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              Learn AI skills that employers actually hire for
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              Intensive bootcamps and self-paced courses built for professionals.
              Real projects, real instructors, real outcomes.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 mb-10">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search for a course or skill..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-sm border border-[#E0E0E0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="px-5 sm:px-6 py-3 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-6 sm:gap-8 pt-8 border-t border-blue-200">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column — stat cards (desktop only) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Trusted by — full width below grid */}
        <div className="mt-10 lg:mt-14 pt-8 border-t border-blue-200">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-8 items-center">
            {partners.map((p) => (
              <span key={p} className="text-sm sm:text-base font-bold text-muted-foreground/50 tracking-tight">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
