import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { CourseItem, ItemType } from "@/types/course";

interface CompactCourseCardProps {
  item: CourseItem;
  type: ItemType;
}

export default function CompactCourseCard({ item, type }: CompactCourseCardProps) {
  const rating = 4.7;
  const oldPrice = Math.round(item.priceLow * 2.2);

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 6px 20px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.16 }}
      className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0] shadow-sm group"
    >
      <Link to={`/courses/${item.id}`} className="block no-underline">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden bg-muted">
          {item.image && (
            <img
              src={item.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
              {type === "bootcamp" ? "⚡ Live" : "📖 Self-Paced"}
            </span>
          </div>
        </div>

        {/* Compact body — title, rating, price only */}
        <div className="p-3">
          <h3 className="font-bold text-[14px] leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {item.title}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-bold text-amber-600">{rating}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-[#D1D5DB]"}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">
              ({item.reviewCount.toLocaleString()})
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-foreground">
              ₹{item.priceLow.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
