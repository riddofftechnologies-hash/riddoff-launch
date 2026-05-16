import type { Timestamp } from "firebase/firestore";

// ─── Existing catalog collections ────────────────────────────────────────────

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

/** Fix: added userId so reviews can be verified and deduplicated */
export interface FirestoreReview {
  courseId: string;
  cohortId: string;
  userId: string;
  name: string;
  rating: number;
  text: string;
  createdAt: Timestamp;
}

export interface FirestorePlatformStats {
  learners: string;
  avgRating: string;
  programs: string;
  hiringPartners: string;
  partners: string[];
}

// ─── User profiles ────────────────────────────────────────────────────────────

/** Stored at users/{uid} — created on sign-up, mirrors Firebase Auth */
export interface FirestoreUser {
  displayName: string;
  email: string;
  photoUrl?: string;
  phone?: string;
  bio?: string;
  /** Controls what tabs/routes are accessible */
  role: "student" | "instructor" | "admin";
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

// ─── Cohorts (the structural spine) ──────────────────────────────────────────

/**
 * A single run of a course — e.g. "Applied AI Eng — Jan 2026".
 * Every time-sensitive collection (enrollments, sessions, assignments,
 * submissions, scores) keys on cohortId, NOT courseId alone.
 */
export interface FirestoreCohort {
  courseId: string;
  /** Human-readable run name shown to students and in admin */
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  capacity: number;
  seatsRemaining: number;
  status: "upcoming" | "enrolling" | "running" | "completed";
  primaryInstructorId: string;
  coInstructorId?: string;
  zoomRecurringLink?: string;
  discordInviteLink?: string;
  createdAt: Timestamp;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

/**
 * Every enrollment MUST be preceded by a payment record.
 * Razorpay signature is stored for server-side verification.
 * The enrollment doc is created only after payment status = "paid".
 */
export interface FirestorePayment {
  userId: string;
  cohortId: string;
  courseId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  /** HMAC-SHA256 of orderId|paymentId — verified before creating enrollment */
  razorpaySignature?: string;
  /** Amount in paise (₹1 = 100 paise) */
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed" | "refunded";
  couponCode?: string;
  discountAmount?: number;
  emiPlan?: { months: number; provider: string } | null;
  invoiceNumber?: string;
  gstAmount?: number;
  createdAt: Timestamp;
  paidAt?: Timestamp;
}

// ─── Enrollments ──────────────────────────────────────────────────────────────

/**
 * Keyed as {uid}_{cohortId} — NOT {uid}_{courseId}.
 * A student re-taking in a later cohort gets a distinct document.
 * Denormalized fields (displayName, email, courseTitle, cohortName) avoid
 * N+1 reads in the admin Students tab.
 */
export interface FirestoreEnrollment {
  userId: string;
  cohortId: string;
  courseId: string;
  /** Required — links back to the payment that created this enrollment */
  paymentId: string;
  status: "active" | "completed" | "paused" | "refunded";
  /** 0–100; maintained by a Cloud Function on lesson_progress writes */
  progress: number;
  enrolledAt: Timestamp;
  lastAccessedAt?: Timestamp;
  // Denormalized for admin list views
  displayName: string;
  email: string;
  courseTitle: string;
  cohortName: string;
}

// ─── Live sessions ─────────────────────────────────────────────────────────────

/** One scheduled Zoom session within a cohort (weekly class, office hours, etc.) */
export interface FirestoreSession {
  cohortId: string;
  courseId: string;
  weekNumber: number;
  topic: string;
  scheduledAt: Timestamp;
  durationMinutes?: number;
  zoomLink?: string;
  recordingUrl?: string;
  instructorId: string;
}

// ─── Attendance ────────────────────────────────────────────────────────────────

/**
 * Keyed as {uid}_{sessionId}.
 * Residency scoring depends on this — do not allow student self-writes.
 */
export interface FirestoreAttendance {
  userId: string;
  cohortId: string;
  sessionId: string;
  attended: boolean;
  joinedAt?: Timestamp;
  durationMinutes?: number;
}

// ─── Assignments ───────────────────────────────────────────────────────────────

export interface FirestoreAssignment {
  cohortId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  maxScore: number;
  /** Instructor who created the assignment */
  createdBy: string;
  published: boolean;
  createdAt: Timestamp;
}

// ─── Submissions ───────────────────────────────────────────────────────────────

/**
 * Keyed as {uid}_{assignmentId}.
 * Field-level security in firestore.rules:
 *   - students write: fileUrl, textAnswer, submittedAt
 *   - instructors/admin write: grade, feedback, gradedBy, gradedAt
 */
export interface FirestoreSubmission {
  userId: string;
  cohortId: string;
  assignmentId: string;
  courseId: string;
  submittedAt: Timestamp;
  fileUrl?: string;
  textAnswer?: string;
  grade?: number | null;
  feedback?: string | null;
  gradedBy?: string;
  gradedAt?: Timestamp;
}

// ─── Residency scoring ─────────────────────────────────────────────────────────

/**
 * Keyed as {uid}_{cohortId}.
 * Computed by a Cloud Function — not writable by students.
 * Drives the "where do I stand?" view and the top-5 residency selection.
 */
export interface FirestoreResidencyScore {
  userId: string;
  cohortId: string;
  assignmentScore: number;
  attendanceScore: number;
  contributionScore: number;
  totalScore: number;
  rank?: number;
  percentile?: number;
  status: "on-track" | "borderline" | "off-track";
  updatedAt: Timestamp;
}

export interface FirestoreResidencyDecision {
  userId: string;
  cohortId: string;
  interviewScheduledAt?: Timestamp;
  interviewNotes?: string;
  outcome: "pending" | "selected" | "waitlisted" | "not-selected";
  decidedAt?: Timestamp;
  decidedBy?: string;
}

// ─── Certificates ──────────────────────────────────────────────────────────────

export interface FirestoreCertificate {
  userId: string;
  cohortId: string;
  courseId: string;
  enrollmentId: string;
  issueDate: Timestamp;
  verificationUrl: string;
  certificateNumber: string;
  completionCriteria: {
    minAttendance: number;
    minAssignmentScore: number;
    met: boolean;
  };
}

// ─── Lesson progress ──────────────────────────────────────────────────────────

/**
 * Keyed as {uid}_{cohortId}_{lessonId}.
 * The parent enrollment's progress% is a Cloud Function aggregate of these.
 * Lessons themselves live in courses/{courseId}/lessons/{lessonId} subcollection.
 */
export interface FirestoreLessonProgress {
  userId: string;
  cohortId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Timestamp;
}

// ─── Skills ────────────────────────────────────────────────────────────────────

export interface FirestoreSkill {
  name: string;
  category: string;
  icon?: string;
  description?: string;
}

/** Keyed as {uid}_{skillId} */
export interface FirestoreStudentSkill {
  userId: string;
  skillId: string;
  courseId: string;
  cohortId: string;
  earnedAt: Timestamp;
  level: "beginner" | "intermediate" | "expert";
  awardedBy?: string;
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

/** courseId = null means the FAQ is global (shown on all course pages) */
export interface FirestoreFAQ {
  courseId?: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt: Timestamp;
}

// ─── Learning Paths ────────────────────────────────────────────────────────────

export type PathId = "get-ai-job" | "build-with-ai" | "upskill-at-work" | "build-your-own";
export type PathFormat = "live-cohort" | "self-paced" | "self-paced-group-call" | "ala-carte";

export interface FirestorePath {
  slug: PathId | string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  format: PathFormat;
  duration: string;
  includesResidency: boolean;
  color: string;
  unitIds: string[];
  outcomes: string[];
  ctaUrl: string;
  published: boolean;
  order: number;
}

export interface FirestoreUnit {
  slug: string;
  name: string;
  outcome: string;
  sourceLectures: string[];
  paths: string[];
  priceAlaCart: number;
  published: boolean;
  order: number;
}
