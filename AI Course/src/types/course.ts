export interface BaseItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  hours: number;
  priceLow: number;
  image: string;
  instructor: string;
  instructorId?: string;
  outcomes: string[];
  syllabus: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  reviewCount: number;
  enrolledCount: number;
}

export interface Bootcamp extends BaseItem {
  sector: string;
  seats: number;
}

export interface Course extends BaseItem {
  category: string;
  weeks: number;
}

export type CourseItem = Bootcamp | Course;
export type ItemType = "bootcamp" | "course";

/** Unified Firestore document shape for both courses and bootcamps */
export interface CourseDoc {
  id: string;
  type: "course" | "bootcamp";
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  hours: number;
  priceLow: number;
  image: string;
  instructor: string;
  instructorId?: string;
  outcomes: string[];
  syllabus: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  reviewCount: number;
  enrolledCount: number;
  published: boolean;
  // Course-specific
  category?: string;
  weeks?: number;
  // Bootcamp-specific
  sector?: string;
  seats?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}
