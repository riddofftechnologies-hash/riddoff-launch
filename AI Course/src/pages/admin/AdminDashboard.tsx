import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Zap, PlusCircle, Upload, CheckCircle } from "lucide-react";
import { fetchAllCourses, createCourse, uploadCourseImage } from "@/services/courses";
import { fetchAllInstructors, createInstructor } from "@/services/instructors";
import { bootcamps, courses } from "@/data/courses";
import { instructorBios } from "@/data/instructors";
import type { CourseDoc } from "@/types/course";

interface Stats {
  totalCourses: number;
  totalBootcamps: number;
  published: number;
  instructors: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [seedLog, setSeedLog] = useState<string[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [docs, instructorDocs] = await Promise.all([
      fetchAllCourses(),
      fetchAllInstructors(),
    ]);
    setStats({
      totalCourses: docs.filter((d) => d.type === "course").length,
      totalBootcamps: docs.filter((d) => d.type === "bootcamp").length,
      published: docs.filter((d) => d.published).length,
      instructors: instructorDocs.length,
    });
  }

  async function seedDatabase() {
    setSeeding(true);
    setSeedLog([]);
    const log = (msg: string) => setSeedLog((prev) => [...prev, msg]);

    try {
      // Seed instructors
      log("Seeding instructors…");
      const instructorIdMap: Record<string, string> = {};
      for (const [name, bio] of Object.entries(instructorBios)) {
        const id = await createInstructor({ name, ...bio });
        instructorIdMap[name] = id;
        log(`  ✓ ${name}`);
      }

      // Seed bootcamps
      log("Seeding bootcamps…");
      for (const b of bootcamps) {
        let imageUrl = "";
        try {
          const res = await fetch(b.image);
          const blob = await res.blob();
          const file = new File([blob], `${b.id}.png`, { type: blob.type });
          const tempId = `${b.id}-${Date.now()}`;
          imageUrl = await uploadCourseImage(file, tempId);
        } catch {
          log(`  ! Could not upload image for ${b.title}, using empty`);
        }
        await createCourse({
          ...b,
          type: "bootcamp",
          image: imageUrl || b.image,
          instructorId: instructorIdMap[b.instructor] ?? "",
          published: true,
        } as Omit<CourseDoc, "id" | "createdAt" | "updatedAt">);
        log(`  ✓ ${b.title}`);
      }

      // Seed courses
      log("Seeding courses…");
      for (const c of courses) {
        let imageUrl = "";
        try {
          const res = await fetch(c.image);
          const blob = await res.blob();
          const file = new File([blob], `${c.id}.png`, { type: blob.type });
          const tempId = `${c.id}-${Date.now()}`;
          imageUrl = await uploadCourseImage(file, tempId);
        } catch {
          log(`  ! Could not upload image for ${c.title}, using empty`);
        }
        await createCourse({
          ...c,
          type: "course",
          image: imageUrl || c.image,
          instructorId: instructorIdMap[c.instructor] ?? "",
          published: true,
        } as Omit<CourseDoc, "id" | "createdAt" | "updatedAt">);
        log(`  ✓ ${c.title}`);
      }

      log("Done!");
      setSeedDone(true);
      await loadStats();
    } catch (err) {
      log(`Error: ${String(err)}`);
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your course platform</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Self-Paced Courses", value: stats?.totalCourses ?? "—", icon: BookOpen },
          { label: "Live Bootcamps", value: stats?.totalBootcamps ?? "—", icon: Zap },
          { label: "Published", value: stats?.published ?? "—", icon: CheckCircle },
          { label: "Instructors", value: stats?.instructors ?? "—", icon: Users },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E0E0E0] p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon size={16} className="text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/admin/courses/new"
          className="flex items-center gap-3 bg-primary text-white rounded-xl px-5 py-4 font-semibold text-sm hover:bg-primary/90 transition-colors no-underline"
        >
          <PlusCircle size={18} />
          Create New Course / Bootcamp
        </Link>
        <Link
          to="/admin/instructors/new"
          className="flex items-center gap-3 bg-white border border-[#E0E0E0] text-foreground rounded-xl px-5 py-4 font-semibold text-sm hover:bg-[#F7F7F7] transition-colors no-underline"
        >
          <Users size={18} />
          Add New Instructor
        </Link>
      </div>

      {/* Seed section */}
      <div className="bg-white rounded-xl border border-[#E0E0E0] p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-semibold text-foreground">Seed Database from Mock Data</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Import all 12 courses & bootcamps + 12 instructors from the existing mock data into
              Firestore. Run once to migrate.
            </p>
          </div>
          <button
            onClick={seedDatabase}
            disabled={seeding || seedDone}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-white rounded-lg text-sm font-semibold hover:bg-foreground/80 disabled:opacity-50 transition-colors shrink-0 ml-4"
          >
            <Upload size={14} />
            {seedDone ? "Seeded" : seeding ? "Seeding…" : "Seed Now"}
          </button>
        </div>
        {seedLog.length > 0 && (
          <pre className="bg-[#F7F7F7] rounded-lg p-4 text-xs text-muted-foreground overflow-auto max-h-64 leading-relaxed">
            {seedLog.join("\n")}
          </pre>
        )}
      </div>
    </div>
  );
}
