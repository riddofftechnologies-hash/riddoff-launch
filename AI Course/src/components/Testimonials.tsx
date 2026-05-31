import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

export default function Testimonials() {
  const { data, isLoading } = useTestimonials();
  const testimonials = (data ?? []).slice(0, 6);

  // No fabricated social proof — render nothing until real testimonials exist.
  if (isLoading || testimonials.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          What our members say
        </h2>
        <p className="text-muted-foreground mb-10">
          Real words from people building with Riddoff.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="bg-[#F7F7F7] rounded-xl p-6 border border-[#E0E0E0]"
            >
              <Quote size={24} className="text-primary/30 mb-3" />
              <p className="text-sm text-foreground leading-relaxed mb-5">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
