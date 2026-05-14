// Raw Firestore document shapes (image stored as "/assets/fp1.png" path)

export interface FirestoreBootcamp {
  title: string;
  sector: string;
  tagline: string;
  description: string;
  fullDescription: string;
  hours: number;
  priceLow: number;
  seats: number;
  image: string;
  instructor: string;
  outcomes: string[];
  syllabus: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  reviewCount: number;
  enrolledCount: number;
}

export interface FirestoreCourse {
  title: string;
  category: string;
  tagline: string;
  description: string;
  fullDescription: string;
  hours: number;
  weeks: number;
  priceLow: number;
  image: string;
  instructor: string;
  outcomes: string[];
  syllabus: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  reviewCount: number;
  enrolledCount: number;
}

export interface FirestoreInstructor {
  name: string;
  title: string;
  bio: string;
  courses: number;
  learners: number;
  photoUrl?: string;
}

export interface FirestoreTestimonial {
  name: string;
  role: string;
  quote: string;
  initials: string;
  order?: number;
}

export interface FirestoreReview {
  courseId: string;
  name: string;
  rating: number;
  text: string;
  createdAt?: number;
}

export interface FirestorePlatformStats {
  learners: string;
  avgRating: string;
  programs: string;
  hiringPartners: string;
  partners: string[];
}
