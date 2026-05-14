import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
import type { CourseItem, ItemType } from "@/types/course";

interface CourseCardProps {
  item: CourseItem;
  type: ItemType;
}

export default function CourseCard({ item, type }: CourseCardProps) {
  const rating = 4.7;
  const oldPrice = Math.round(item.priceLow * 2.2);
  const sector = "sector" in item ? item.sector : item.category;
  const weeks = "weeks" in item ? item.weeks : undefined;
  const seats = "seats" in item ? item.seats : undefined;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.18 }}
      className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0] shadow-sm group h-full"
    >
      {/* Single link wraps the whole card — no title duplication */}
      <Link to={`/courses/${item.id}`} className="flex flex-col h-full no-underline">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden bg-muted shrink-0">
          {item.image && (
            <img
              src={item.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute top-2 left-2">
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${
                type === "bootcamp"
                  ? "bg-amber-400 text-amber-900"
                  : "bg-white/90 text-primary"
              }`}
            >
              {type === "bootcamp" ? "⚡ Live Bootcamp" : "📖 Self-Paced"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wide mb-1">
            {sector}
          </p>

          <h3 className="font-bold text-[15px] leading-snug text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-muted-foreground mb-2">{item.instructor}</p>

          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-bold text-amber-600">{rating}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-[#D1D5DB]"}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">
              ({item.reviewCount.toLocaleString()})
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {item.hours} hrs{weeks ? ` · ${weeks} weeks` : ""}
            </span>
            <span className="ml-auto px-2 py-0.5 bg-[#F0F0F0] rounded text-[10px] font-semibold text-foreground">
              {item.level}
            </span>
          </div>

          {type === "bootcamp" && seats && (
            <p className="text-[11px] text-rose-600 font-semibold mb-1.5">
              🔥 {seats} seats left
            </p>
          )}

          <p className="text-[11px] text-muted-foreground mb-3">
            {item.enrolledCount.toLocaleString()} already enrolled
          </p>

          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">
              ₹{item.priceLow.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* CTA — styled div inside the single link */}
        <div className="px-4 pb-4">
          <div className="w-full text-center py-2 text-sm font-semibold text-primary border border-primary rounded-md group-hover:bg-primary group-hover:text-white transition-colors">
            Enroll now
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
