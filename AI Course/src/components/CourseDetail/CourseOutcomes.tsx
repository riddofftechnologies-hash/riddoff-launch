import { CheckCircle } from "lucide-react";

interface CourseOutcomesProps {
  outcomes: string[];
}

export default function CourseOutcomes({ outcomes }: CourseOutcomesProps) {
  return (
    <section className="border border-[#E0E0E0] rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold text-foreground mb-4">What you'll learn</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {outcomes.map((outcome) => (
          <div key={outcome} className="flex items-start gap-2.5">
            <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
            <span className="text-sm text-foreground leading-snug">{outcome}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
