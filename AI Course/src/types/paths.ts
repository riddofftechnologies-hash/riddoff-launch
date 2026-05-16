export type Situation = "employed" | "job-seeking" | "founder" | "student";
export type Goal = "get-ai-job" | "launch-product" | "get-promoted" | "upskill-general";
export type TechLevel = "non-technical" | "used-spreadsheets" | "coded-a-bit" | "developer";
export type HoursPerWeek = "lt5" | "5-10" | "10-20" | "gt20";
export type BudgetRange = "lt30k" | "30k-50k" | "50k-75k" | "gt75k";

export interface QuizAnswers {
  situation: Situation | null;
  goal: Goal | null;
  techLevel: TechLevel | null;
  hoursPerWeek: HoursPerWeek | null;
  budget: BudgetRange | null;
}

export type PathId = "get-ai-job" | "build-with-ai" | "upskill-at-work" | "build-your-own";

export interface QuizResult {
  primary: PathId;
  secondary: PathId;
  reasoning: string;
}
