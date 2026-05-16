import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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
      whileHover={{ y: -3, boxShadow: "0 6px 18px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.16 }}
      className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0] shadow-sm group h-full"
    >
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
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                type === "bootcamp"
                  ? "bg-amber-400 text-amber-900"
                  : "bg-white/90 text-primary"
              }`}
            >
              {type === "bootcamp" ? "⚡ Live" : "📖 Self-Paced"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Category */}
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-0.5">
            {sector}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-[13px] leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-1">
            {item.title}
          </h3>

          {/* Instructor */}
          <p className="text-[11px] text-muted-foreground mb-1.5">{item.instructor}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-[11px] font-bold text-amber-600">{rating}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-[#D1D5DB]"}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">
              ({item.reviewCount.toLocaleString()})
            </span>
          </div>

          {/* Level · Duration */}
          <p className="text-[10px] text-muted-foreground mb-1">
            {item.level} · {item.hours} hrs{weeks ? ` · ${weeks}w` : ""}
          </p>

          {/* Seats urgency */}
          {type === "bootcamp" && seats && (
            <p className="text-[10px] text-rose-600 font-semibold mb-1">
              🔥 {seats} seats left
            </p>
          )}

          {/* Price */}
          <div className="mt-auto pt-1.5 flex items-baseline gap-1.5">
            <span className="text-[13px] font-bold text-foreground">
              ₹{item.priceLow.toLocaleString("en-IN")}
            </span>
            <span className="text-[11px] text-muted-foreground line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
