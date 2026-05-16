import { useState, useEffect } from "react";
import { X, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { scoreQuiz, PATH_LABELS } from "@/utils/quizLogic";
import { usePaths } from "@/hooks/usePaths";
import type { QuizAnswers } from "@/types/paths";

interface Props {
  onClose: () => void;
}

type QuestionId = keyof QuizAnswers;

const QUESTIONS: {
  id: QuestionId;
  title: string;
  options: { value: string; label: string }[];
}[] = [
  {
    id: "situation",
    title: "What's your current situation?",
    options: [
      { value: "employed", label: "I'm employed in dev/IT" },
      { value: "job-seeking", label: "I'm actively job seeking" },
      { value: "founder", label: "I'm a founder or solopreneur" },
      { value: "student", label: "I'm a student or new grad" },
    ],
  },
  {
    id: "goal",
    title: "What's your #1 goal for the next 12 months?",
    options: [
      { value: "get-ai-job", label: "Land an AI/ML job" },
      { value: "get-promoted", label: "Get promoted at my current role" },
      { value: "launch-product", label: "Launch an AI product or service" },
      { value: "upskill-general", label: "Explore AI for general growth" },
    ],
  },
  {
    id: "techLevel",
    title: "What's your technical level?",
    options: [
      { value: "developer", label: "I write code daily" },
      { value: "coded-a-bit", label: "I've coded before, not my day job" },
      { value: "used-spreadsheets", label: "Comfortable with tools, not code" },
      { value: "non-technical", label: "I'm completely non-technical" },
    ],
  },
  {
    id: "hoursPerWeek",
    title: "How many hours/week can you commit?",
    options: [
      { value: "gt20", label: "10+ hrs/week — I'm going all in" },
      { value: "10-20", label: "5–10 hrs/week — moderate pace" },
      { value: "5-10", label: "2–5 hrs/week — light touch" },
      { value: "lt5", label: "Less than 2 hrs/week" },
    ],
  },
  {
    id: "budget",
    title: "What's your budget for this investment?",
    options: [
      { value: "gt75k", label: "₹75,000+ — cohort-grade commitment" },
      { value: "50k-75k", label: "₹50,000–₹75,000" },
      { value: "30k-50k", label: "₹30,000–₹50,000" },
      { value: "lt30k", label: "Under ₹30,000 — modular is fine" },
    ],
  },
];

const EMPTY_ANSWERS: QuizAnswers = {
  situation: null,
  goal: null,
  techLevel: null,
  hoursPerWeek: null,
  budget: null,
};

export default function QuizModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [result, setResult] = useState<ReturnType<typeof scoreQuiz> | null>(null);
  const { data: paths } = usePaths();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = QUESTIONS[step];
  const currentAnswer = q ? answers[q.id] : null;
  const isLast = step === QUESTIONS.length - 1;

  function selectOption(value: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: value as never }));
  }

  function advance() {
    if (!currentAnswer) return;
    if (isLast) {
      setResult(scoreQuiz({ ...answers, [q.id]: currentAnswer as never }));
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  function primaryPath() {
    if (!result) return null;
    return paths?.find((p) => p.id === result.primary || p.slug === result.primary);
  }

  function secondaryPath() {
    if (!result) return null;
    return paths?.find((p) => p.id === result.secondary || p.slug === result.secondary);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">
            {result ? "Your Result" : `Step ${step + 1} of ${QUESTIONS.length}`}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        {!result && (
          <div className="mx-6 mb-4 h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        )}

        {/* Quiz step */}
        {!result && q && (
          <div className="px-6 pb-5">
            <h2 className="text-[16px] font-bold text-foreground mb-4 leading-snug">{q.title}</h2>

            <div className="space-y-2 mb-6">
              {q.options.map((opt) => {
                const selected = currentAnswer === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => selectOption(opt.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-[13px] font-medium transition-colors ${
                      selected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-[#E0E0E0] text-foreground hover:border-primary/40"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                type="button"
                onClick={advance}
                disabled={!currentAnswer}
                className="flex items-center gap-1.5 bg-primary text-white rounded-lg px-5 py-2.5 text-[13px] font-semibold hover:bg-primary/90 disabled:opacity-40 transition-colors"
              >
                {isLast ? "See My Path" : "Next"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="px-6 pb-6">
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wide mb-1">
                Recommended for you
              </p>
              <h2 className="text-[20px] font-bold text-foreground mb-2">
                {PATH_LABELS[result.primary]}
              </h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{result.reasoning}</p>
            </div>

            {primaryPath() && (
              <a
                href={primaryPath()!.ctaUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full bg-primary text-white rounded-lg px-4 py-3 text-[13px] font-semibold hover:bg-primary/90 transition-colors mb-3"
              >
                Enroll in {PATH_LABELS[result.primary]}
                <ExternalLink size={12} />
              </a>
            )}

            <a
              href="https://calendly.com/riddoff/discovery"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full border border-[#E0E0E0] text-foreground rounded-lg px-4 py-2.5 text-[13px] font-medium hover:border-primary/40 transition-colors mb-5"
            >
              Book a 15-min call first
            </a>

            <div className="border-t border-[#E0E0E0] pt-4">
              <p className="text-[11px] text-muted-foreground mb-2">
                Alternative if you're unsure:
              </p>
              <p className="text-[13px] font-semibold text-foreground">
                {PATH_LABELS[result.secondary]}
              </p>
              {secondaryPath() && (
                <a
                  href={secondaryPath()!.ctaUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-primary hover:underline"
                >
                  View {PATH_LABELS[result.secondary]} →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
