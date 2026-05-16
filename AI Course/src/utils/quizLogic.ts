import type { QuizAnswers, QuizResult } from "@/types/paths";

const BUDGET_MAP: Record<string, number> = {
  "lt30k": 0,
  "30k-50k": 40000,
  "50k-75k": 62500,
  "gt75k": 75000,
};

const TECH_MAP: Record<string, number> = {
  "non-technical": 0,
  "used-spreadsheets": 1,
  "coded-a-bit": 2,
  "developer": 3,
};

export function scoreQuiz(answers: QuizAnswers): QuizResult {
  const budget = BUDGET_MAP[answers.budget ?? "lt30k"] ?? 0;
  const tech = TECH_MAP[answers.techLevel ?? "non-technical"] ?? 0;

  if (budget < 30000) {
    return {
      primary: "build-your-own",
      secondary: "upskill-at-work",
      reasoning:
        "Your budget fits best with a customised selection of units — you pay only for what you need.",
    };
  }

  if (answers.goal === "get-ai-job" && tech >= 2 && budget >= 75000) {
    return {
      primary: "get-ai-job",
      secondary: "build-with-ai",
      reasoning:
        "You're ready to commit — the live cohort + Residency track is your fastest route to a GCC AI role.",
    };
  }

  if (answers.goal === "launch-product") {
    return {
      primary: "build-with-ai",
      secondary: "upskill-at-work",
      reasoning:
        "Founders thrive in self-paced + monthly group-call format; you ship while you learn.",
    };
  }

  if (answers.goal === "get-promoted" && answers.situation === "employed") {
    return {
      primary: "upskill-at-work",
      secondary: "build-with-ai",
      reasoning:
        "Structured self-paced learning fits around a full-time role — add AI skills without quitting your job.",
    };
  }

  return {
    primary: "upskill-at-work",
    secondary: "build-your-own",
    reasoning:
      "Path C gives you a structured start; you can add à la carte units as you grow.",
  };
}

export const PATH_LABELS: Record<string, string> = {
  "get-ai-job": "Path A — Get the AI Job",
  "build-with-ai": "Path B — Build with AI",
  "upskill-at-work": "Path C — Upskill at Work",
  "build-your-own": "Build Your Own Bundle",
};
