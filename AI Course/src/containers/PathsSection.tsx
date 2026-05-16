import { Sparkles } from "lucide-react";
import { usePaths } from "@/hooks/usePaths";
import { useUnits } from "@/hooks/useUnits";
import PathCard from "@/components/PathCard";
import BuildYourOwnCard from "@/components/BuildYourOwnCard";

interface Props {
  onOpenQuiz: () => void;
}

export default function PathsSection({ onOpenQuiz }: Props) {
  const { data: paths = [], isLoading: pathsLoading } = usePaths();
  const { data: units = [] } = useUnits();

  const published = paths
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order);

  if (pathsLoading) return null;
  if (published.length === 0) return null;

  return (
    <section className="bg-[#F7F6FF] py-14 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">
              Learning Paths
            </p>
            <h2 className="text-[26px] font-bold text-foreground leading-snug">
              Find Your AI Path
            </h2>
            <p className="text-[14px] text-muted-foreground mt-1 max-w-xl">
              Three structured programmes built around one goal each — plus a
              custom bundle if you know exactly what you need.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenQuiz}
            className="flex items-center gap-2 shrink-0 bg-primary text-white rounded-lg px-5 py-2.5 text-[13px] font-semibold hover:bg-primary/90 transition-colors self-start sm:self-auto"
          >
            <Sparkles size={14} />
            Take the 60-sec quiz
          </button>
        </div>

        {/* Path grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {published.map((path, i) => (
            <PathCard key={path.id} path={path} index={i} />
          ))}
          <BuildYourOwnCard units={units} index={published.length} />
        </div>

        {/* Residency note */}
        {published.some((p) => p.includesResidency) && (
          <p className="text-[11px] text-muted-foreground text-center mt-6">
            🏅 Residency is a 2-week in-person programme offered to the top 5 performers
            in each live cohort — at no extra cost.
          </p>
        )}
      </div>
    </section>
  );
}
