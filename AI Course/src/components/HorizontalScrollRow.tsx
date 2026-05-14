import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CompactCourseCard from "@/components/CompactCourseCard";
import type { CourseItem, ItemType } from "@/types/course";

interface HorizontalScrollRowProps {
  title: string;
  items: CourseItem[];
  type: ItemType;
  fullBleed?: boolean;
}

export default function HorizontalScrollRow({
  title,
  items,
  type,
  fullBleed,
}: HorizontalScrollRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    ref.current?.scrollBy({ left: dir === "right" ? 248 : -248, behavior: "smooth" });
  }

  const pad = fullBleed ? "px-4 sm:px-6 lg:px-8" : "";

  return (
    <div className="mb-12">
      <div className={`flex items-center justify-between mb-4 ${pad}`}>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F0F0F0] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F0F0F0] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className={`flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar ${pad}`}
      >
        {items.map((item) => (
          <div key={item.id} className="shrink-0 w-[75vw] sm:w-60 snap-start">
            <CompactCourseCard item={item} type={type} />
          </div>
        ))}
      </div>
    </div>
  );
}
