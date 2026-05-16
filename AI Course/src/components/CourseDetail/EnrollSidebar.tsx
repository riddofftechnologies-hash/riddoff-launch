import { useState, useEffect, useRef } from "react";
import { Clock, Monitor, BadgeCheck, BookMarked, Share2, CheckCircle, Loader2 } from "lucide-react";
import type { CourseItem, ItemType } from "@/types/course";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrollment } from "@/hooks/useEnrollment";
import AuthModal from "@/components/AuthModal";

interface EnrollSidebarProps {
  item: CourseItem;
  type: ItemType;
}

export default function EnrollSidebar({ item, type }: EnrollSidebarProps) {
  const { user } = useAuth();
  const { enrolled, enrolling, enroll } = useEnrollment(item.id, item.title, type);
  const [showAuth, setShowAuth] = useState(false);
  const pendingEnroll = useRef(false);

  useEffect(() => {
    if (user && pendingEnroll.current) {
      pendingEnroll.current = false;
      enroll();
    }
  }, [user, enroll]);

  function handleEnroll() {
    if (!user) {
      pendingEnroll.current = true;
      setShowAuth(true);
    } else {
      enroll();
    }
  }

  const oldPrice = Math.round(item.priceLow * 2.2);
  const discount = Math.round((1 - item.priceLow / oldPrice) * 100);
  const seats = "seats" in item ? item.seats : undefined;
  const weeks = "weeks" in item ? item.weeks : undefined;

  const includes = [
    { icon: Clock, label: `${item.hours} hours of on-demand content` },
    { icon: Monitor, label: "Access on mobile and desktop" },
    { icon: BadgeCheck, label: "Certificate of completion" },
    { icon: BookMarked, label: "Full lifetime access" },
    ...(weeks ? [{ icon: Clock, label: `${weeks} weeks to complete` }] : []),
  ];

  return (
    <>
      <div className="bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden">
        {/* Thumbnail */}
        <div className="aspect-video relative overflow-hidden bg-muted">
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-5">
          {/* Seats urgency */}
          {type === "bootcamp" && seats && (
            <p className="text-xs text-rose-600 font-semibold mb-2">
              🔥 Only {seats} seats remaining
            </p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-foreground">
              ₹{item.priceLow.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{oldPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-bold text-green-600">{discount}% off</span>
          </div>

          {/* CTAs */}
          {enrolled ? (
            <button
              type="button"
              disabled
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-default mb-2"
            >
              <CheckCircle size={16} />
              You're Enrolled
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 mb-2"
            >
              {enrolling ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enrolling…
                </>
              ) : (
                "Enroll Now"
              )}
            </button>
          )}

          <button type="button" className="w-full py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-accent transition-colors">
            Try Free Preview
          </button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            30-day money-back guarantee
          </p>

          {/* Includes */}
          <div className="border-t border-[#E0E0E0] mt-5 pt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              This {type === "bootcamp" ? "bootcamp" : "course"} includes
            </h4>
            <ul className="space-y-2.5">
              {includes.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-foreground">
                  <Icon size={14} className="text-muted-foreground shrink-0" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Share */}
          <button type="button" className="w-full mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 size={14} />
            Share this course
          </button>
        </div>
      </div>

      {showAuth && (
        <AuthModal
          defaultTab="signup"
          onClose={() => {
            pendingEnroll.current = false;
            setShowAuth(false);
          }}
        />
      )}
    </>
  );
}
