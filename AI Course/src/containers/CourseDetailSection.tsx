import { useParams, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useBootcamp, toBootcamp } from "@/hooks/useBootcamps";
import { useCourse, toCourse } from "@/hooks/useCourses";
import { useBootcamps } from "@/hooks/useBootcamps";
import { useCourses } from "@/hooks/useCourses";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HorizontalScrollRow from "@/components/HorizontalScrollRow";
import CourseHero from "@/components/CourseDetail/CourseHero";
import CourseOutcomes from "@/components/CourseDetail/CourseOutcomes";
import CourseSyllabus from "@/components/CourseDetail/CourseSyllabus";
import CourseInstructor from "@/components/CourseDetail/CourseInstructor";
import CourseReviews from "@/components/CourseDetail/CourseReviews";
import EnrollSidebar from "@/components/CourseDetail/EnrollSidebar";
import type { ItemType, CourseItem } from "@/types/course";

export default function CourseDetailSection() {
  const { id } = useParams<{ id: string }>();

  // Try fetching as bootcamp first, then course
  const bootcampQuery = useBootcamp(id);
  const courseQuery = useCourse(id);
  const bootcampsQuery = useBootcamps();
  const coursesQuery = useCourses();

  const isLoading =
    bootcampQuery.isLoading || courseQuery.isLoading;

  const rawBootcamp = bootcampQuery.data;
  const rawCourse = courseQuery.data;

  const item: CourseItem | null =
    rawBootcamp ? toBootcamp(rawBootcamp) :
    rawCourse ? toCourse(rawCourse) :
    null;

  const type: ItemType = rawBootcamp ? "bootcamp" : "course";

  const bootcamps = (bootcampsQuery.data ?? []).map(toBootcamp);
  const courses = (coursesQuery.data ?? []).map(toCourse);

  const relatedItems: CourseItem[] =
    type === "bootcamp"
      ? bootcamps.filter((b) => b.id !== id)
      : courses.filter((c) => c.id !== id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">Course not found</p>
            <p className="text-sm text-muted-foreground mb-4">
              The program you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/" className="text-sm font-semibold text-primary no-underline hover:underline">
              ← Back to all courses
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <CourseHero item={item} type={type} />

      {/* Two-column layout */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex gap-10">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 py-8">
            {/* Mobile: enroll card inline at top */}
            <div className="lg:hidden mb-8">
              <EnrollSidebar item={item} type={type} />
            </div>

            <CourseOutcomes outcomes={item.outcomes} />
            <CourseSyllabus syllabus={item.syllabus} hours={item.hours} />
            <CourseInstructor name={item.instructor} />
            <CourseReviews item={item} />
          </div>

          {/* Right: sticky enroll sidebar (desktop only) */}
          <div className="hidden lg:block w-[320px] shrink-0">
            <div className="sticky top-20 pt-8 pb-8">
              <EnrollSidebar item={item} type={type} />
            </div>
          </div>
        </div>
      </div>

      {/* Related courses — full-bleed scroll, no max-width cap */}
      <div className="bg-[#F7F7F7] py-12 overflow-hidden">
        <HorizontalScrollRow
          title={`More ${type === "bootcamp" ? "Bootcamps" : "Courses"} you might like`}
          items={relatedItems}
          type={type}
          fullBleed
        />
      </div>

      <Footer />
    </div>
  );
}
