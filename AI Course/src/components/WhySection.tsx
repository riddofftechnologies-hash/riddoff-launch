import { motion } from "framer-motion";
import { Eye, Users2, Send, Handshake, Clock, Code, BookOpen, Award } from "lucide-react";
import type { ItemType } from "@/types/course";

interface WhySectionProps {
  type: ItemType;
}

const bootcampFeatures = [
  {
    icon: Eye,
    title: "Live demo on Day 1",
    desc: "See the finished capstone before you write a single line of code.",
  },
  {
    icon: Users2,
    title: "1 TA per 10 students",
    desc: "Two TAs circulate during sprints so the instructor never stops.",
  },
  {
    icon: Send,
    title: "Deployed URL by Sunday",
    desc: "Every student leaves with a live portfolio piece.",
  },
  {
    icon: Handshake,
    title: "28 hiring partners",
    desc: "Top graduates are routed to GCCs in Kochi, Hyderabad, Bangalore.",
  },
];

const courseFeatures = [
  {
    icon: Clock,
    title: "Learn at your own pace",
    desc: "Access materials forever—no deadlines or pressure.",
  },
  {
    icon: Code,
    title: "Hands-on projects",
    desc: "Build real projects with starter code and templates.",
  },
  {
    icon: BookOpen,
    title: "Expert instructors",
    desc: "Learn from practitioners who've shipped AI in production.",
  },
  {
    icon: Award,
    title: "Career support",
    desc: "Join alumni network and access the job board.",
  },
];

export default function WhySection({ type }: WhySectionProps) {
  const features = type === "bootcamp" ? bootcampFeatures : courseFeatures;
  const label = type === "bootcamp" ? "Bootcamps" : "Courses";

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F7F7]">
      <div className="w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Why Riddoff {label}
        </h2>
        <p className="text-muted-foreground mb-10">
          What makes us different from self-study or generic courses.
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
