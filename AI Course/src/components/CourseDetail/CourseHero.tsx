import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import type { CourseItem, ItemType } from "@/types/course";

interface CourseHeroProps {
  item: CourseItem;
  type: ItemType;
}

export default function CourseHero({ item, type }: CourseHeroProps) {
  const sector = "sector" in item ? item.sector : item.category;
  const weeks = "weeks" in item ? item.weeks : undefined;

  return (
    <div className="bg-[#1c1d1f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-5">
          <Link to="/" className="hover:text-white/80 no-underline text-white/50 transition-colors">
            AI Courses
          </Link>
          <span>/</span>
          <span>{sector}</span>
          <span>/</span>
          <span className="text-white/80 line-clamp-1">{item.title}</span>
        </nav>

        <div className="max-w-3xl">
          {/* Type badge */}
          <span
            className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-4 ${
              type === "bootcamp"
                ? "bg-amber-400 text-amber-900"
                : "bg-primary/40 text-white"
            }`}
          >
            {type === "bootcamp" ? "⚡ Live Bootcamp" : "📖 Self-Paced Course"}
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            {item.title}
          </h1>

          {/* Tagline */}
          <p className="text-lg text-white/70 mb-5 leading-relaxed">{item.tagline}</p>

          {/* Rating row */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-amber-400">4.7</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < 4 ? "fill-amber-400 text-amber-400" : "text-amber-400/40"}
                  />
                ))}
              </div>
              <span className="text-white/60">({item.reviewCount.toLocaleString()} reviews)</span>
            </div>
            <span className="text-white/40">·</span>
            <span className="text-white/70">{item.enrolledCount.toLocaleString()} learners enrolled</span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span>
              By{" "}
              <span className="text-white/90 font-semibold">{item.instructor}</span>
            </span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {item.hours} hours
            </span>
            {weeks && (
              <>
                <span className="text-white/30">·</span>
                <span>{weeks} weeks</span>
              </>
            )}
            <span className="text-white/30">·</span>
            <span className="px-2 py-0.5 bg-white/10 rounded text-white/80 text-xs font-semibold">
              {item.level}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
