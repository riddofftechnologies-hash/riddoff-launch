import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink } from "lucide-react";
import type { FirestorePath, PathFormat } from "@/types/firestore";

function formatBadge(format: PathFormat) {
  switch (format) {
    case "live-cohort":
      return { label: "⚡ Live Cohort", cls: "bg-amber-400 text-amber-900" };
    case "self-paced":
      return { label: "📖 Self-Paced", cls: "bg-white/90 text-primary border border-primary/20" };
    case "self-paced-group-call":
      return { label: "🎯 Self-Paced + Group Calls", cls: "bg-purple-100 text-purple-800" };
    case "ala-carte":
      return { label: "🧩 Custom Bundle", cls: "bg-emerald-100 text-emerald-800" };
  }
}

interface Props {
  path: FirestorePath & { id: string };
  index?: number;
}

export default function PathCard({ path, index = 0 }: Props) {
  const badge = formatBadge(path.format);
  const oldPrice = path.price > 0 ? Math.round(path.price * 1.4) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: index * 0.06 }}
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className="bg-white rounded-xl overflow-hidden border border-[#E0E0E0] shadow-sm flex flex-col h-full"
    >
      {/* Accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: path.color || "#3525cd" }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badge.cls}`}>
            {badge.label}
          </span>
          {path.includesResidency && (
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide bg-indigo-100 text-indigo-800">
              🏅 Residency eligible
            </span>
          )}
        </div>

        {/* Name + tagline */}
        <h3 className="font-bold text-[15px] leading-snug text-foreground mb-1">{path.name}</h3>
        <p className="text-[12px] text-muted-foreground leading-snug mb-3">{path.tagline}</p>

        {/* Outcomes */}
        {path.outcomes.length > 0 && (
          <ul className="space-y-1 mb-4">
            {path.outcomes.slice(0, 3).map((o, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                <CheckCircle2 size={12} className="text-primary shrink-0 mt-0.5" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Units count */}
        <p className="text-[11px] text-muted-foreground mb-4">
          {path.unitIds.length} learning units · {path.duration}
        </p>

        {/* Price */}
        <div className="mt-auto">
          {path.price > 0 ? (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[18px] font-bold text-foreground">
                ₹{path.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[12px] text-muted-foreground line-through">
                ₹{oldPrice.toLocaleString("en-IN")}
              </span>
            </div>
          ) : (
            <p className="text-[12px] text-muted-foreground mb-3">Price on selection</p>
          )}

          <a
            href={path.ctaUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full bg-primary text-white rounded-lg px-4 py-2.5 text-[13px] font-semibold hover:bg-primary/90 transition-colors"
          >
            Enroll Now
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
