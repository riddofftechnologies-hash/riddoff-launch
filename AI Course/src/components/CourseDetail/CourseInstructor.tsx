import { Star } from "lucide-react";
import { useInstructor } from "@/hooks/useInstructors";

interface CourseInstructorProps {
  name: string;
}

const FALLBACK_BIO = {
  title: "AI Specialist",
  bio: "An experienced AI engineer with a track record of building production systems.",
  courses: 2,
  learners: 10000,
};

export default function CourseInstructor({ name }: CourseInstructorProps) {
  const { data } = useInstructor(name);
  const bio = data ?? FALLBACK_BIO;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-5">Your instructor</h2>

      <div className="flex items-start gap-4">
        {data?.photoUrl ? (
          <img
            src={data.photoUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xl shrink-0">
            {initials}
          </div>
        )}

        <div className="flex-1">
          <h3 className="font-bold text-foreground text-lg leading-tight">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{bio.title}</p>

          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              4.7 instructor rating
            </span>
            <span>· {bio.courses} courses</span>
            <span>· {bio.learners.toLocaleString()} learners</span>
          </div>

          <p className="text-sm text-foreground leading-relaxed">{bio.bio}</p>
        </div>
      </div>
    </section>
  );
}
