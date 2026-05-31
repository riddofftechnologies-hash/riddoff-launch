import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

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
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-wider">
            Courses · Launching soon
          </span>

          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            Courses &amp; bootcamps
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
            Self-paced courses and live bootcamps from the Riddoff team. We're
            building the catalog now —{" "}
            <Link to="/waitlist" className="text-primary font-medium no-underline hover:underline">
              join the waitlist
            </Link>{" "}
            for early access, or explore what's coming below.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex gap-2 max-w-lg">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search courses, bootcamps, or skills…"
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
        </motion.div>
      </div>
    </section>
  );
}
