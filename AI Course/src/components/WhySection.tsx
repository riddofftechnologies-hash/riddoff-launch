import { motion } from "framer-motion";
import { Hammer, Rocket, KeyRound, Users2 } from "lucide-react";
import type { ItemType } from "@/types/course";

interface WhySectionProps {
  // Kept for call-site compatibility; copy is the same founder-first set either way.
  type: ItemType;
}

const features = [
  {
    icon: Hammer,
    title: "Build real products",
    desc: "You ship production software for real users — not assignments graded against a rubric.",
  },
  {
    icon: Users2,
    title: "Work with the principals",
    desc: "Build alongside the engineers who actually run Riddoff Technologies, not lecturers.",
  },
  {
    icon: Rocket,
    title: "Ship to real users",
    desc: "Every project goes live. You leave with things people use, not a folder of demos.",
  },
  {
    icon: KeyRound,
    title: "Own what you make",
    desc: "Walk away owning your code, your product, and — for founders — equity. Not a certificate.",
  },
];

export default function WhySection({ type: _type }: WhySectionProps) {
  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7]">
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Why Riddoff Ed
        </h2>
        <p className="text-muted-foreground mb-10">
          A founder-first program — not another course platform.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-xl p-5 border border-[#E0E0E0] shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                <item.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1.5">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
