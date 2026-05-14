import { useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle, FileText } from "lucide-react";

interface CourseSyllabusProps {
  syllabus: string[];
  hours: number;
}

export default function CourseSyllabus({ syllabus, hours }: CourseSyllabusProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const baseHours = Math.floor(hours / syllabus.length);
  const remainder = hours % syllabus.length;

  function moduleHours(idx: number) {
    return baseHours + (idx === 0 ? remainder : 0);
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-foreground mb-1">Course content</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {syllabus.length} modules · {hours} total hours
      </p>

      <div className="border border-[#E0E0E0] rounded-xl overflow-hidden divide-y divide-[#E0E0E0]">
        {syllabus.map((module, idx) => {
          const isOpen = openIdx === idx;
          const mh = moduleHours(idx);

          return (
            <div key={idx}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-[#F7F7F7] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isOpen ? (
                    <ChevronUp size={16} className="text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-foreground">{module}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">{mh}h</span>
              </button>

              {isOpen && (
                <div className="bg-[#FAFAFA] px-10 pb-4 pt-1 space-y-1">
                  <div className="flex items-center gap-2.5 py-2 text-sm text-muted-foreground">
                    <PlayCircle size={14} className="text-primary shrink-0" />
                    <span>Concept walkthrough & live demo</span>
                    <span className="ml-auto text-xs">45 min</span>
                  </div>
                  <div className="flex items-center gap-2.5 py-2 text-sm text-muted-foreground">
                    <PlayCircle size={14} className="text-primary shrink-0" />
                    <span>Hands-on coding session</span>
                    <span className="ml-auto text-xs">{Math.max(1, mh - 1)}h</span>
                  </div>
                  <div className="flex items-center gap-2.5 py-2 text-sm text-muted-foreground">
                    <FileText size={14} className="text-muted-foreground shrink-0" />
                    <span>Project exercise + solution review</span>
                    <span className="ml-auto text-xs">15 min</span>
                  </div>
                  <p className="text-xs text-muted-foreground/60 italic pt-2 border-t border-[#E8E8E8]">
                    Full content unlocks after enrollment
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
