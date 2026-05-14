import { Star } from "lucide-react";
import type { CourseItem } from "@/types/course";

const sampleReviews = [
  {
    name: "Arun K.",
    rating: 5,
    text: "Incredibly practical. I built and deployed the project during the course itself — something no other course I've taken has managed.",
  },
  {
    name: "Sneha M.",
    rating: 5,
    text: "Best AI course I've taken. The instructor explains complex concepts in plain terms and the TA support is fast and helpful.",
  },
  {
    name: "Rohan P.",
    rating: 4,
    text: "Great content and pacing. The hands-on projects are what make this stand out — you're actually building, not just watching slides.",
  },
];

const ratingDistribution = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 18 },
  { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
];

interface CourseReviewsProps {
  item: CourseItem;
}

export default function CourseReviews({ item }: CourseReviewsProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-6">Student reviews</h2>

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 p-5 border border-[#E0E0E0] rounded-xl bg-[#FAFAFA]">
        <div className="flex flex-col items-center justify-center shrink-0 w-36">
          <div className="text-5xl font-bold text-foreground">4.7</div>
          <div className="flex mt-1.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="text-xs text-muted-foreground">Course Rating</div>
        </div>

        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <div className="flex items-center gap-0.5 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={
                      i < stars ? "fill-amber-400 text-amber-400" : "text-[#D1D5DB]"
                    }
                  />
                ))}
              </div>
              <div className="flex-1 bg-[#E0E0E0] rounded-full h-2">
                <div
                  className="bg-amber-400 h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-6">
        {sampleReviews.map((review) => (
          <div key={review.name} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {review.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">{review.name}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-[#D1D5DB]"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{review.text}</p>
            </div>
          </div>
        ))}

        <p className="text-xs text-muted-foreground pt-2">
          Showing 3 of {item.reviewCount.toLocaleString()} reviews
        </p>
      </div>
    </section>
  );
}
