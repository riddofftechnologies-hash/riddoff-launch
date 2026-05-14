import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

const FALLBACK = [
  { id: "1", name: "Priya Menon", role: "ML Engineer at Infosys", initials: "PM", quote: "The RAG Systems Masterclass was exactly what I needed. I deployed my first production RAG system within a week of completing it." },
  { id: "2", name: "Arjun Nair", role: "Data Scientist at HDFC Bank", initials: "AN", quote: "The AI Underwriting bootcamp was intense but the TA support was incredible. I had a working credit scoring model by Sunday evening." },
  { id: "3", name: "Kavya Sharma", role: "Software Engineer at Wipro", initials: "KS", quote: "I went from zero AI knowledge to deploying a multi-agent system in 4 weeks. The course structure is much better than anything else I tried." },
];

export default function Testimonials() {
  const { data, isLoading } = useTestimonials();
  const testimonials = (data && data.length > 0 ? data : FALLBACK).slice(0, 6);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          What our learners say
        </h2>
        <p className="text-muted-foreground mb-10">
          Join 50,500+ professionals who've levelled up with Riddoff.
        </p>

        {isLoading ? null : (
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
        )}
      </div>
    </section>
  );
}
