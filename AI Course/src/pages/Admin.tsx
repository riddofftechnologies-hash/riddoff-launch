import { useState } from "react";
import { Loader2, LogOut, Plus, Pencil, Trash2, Upload, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBootcamps, useCreateBootcamp, useUpdateBootcamp, useDeleteBootcamp, toBootcamp } from "@/hooks/useBootcamps";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, toCourse } from "@/hooks/useCourses";
import { useInstructors, useCreateInstructor, useUpdateInstructor, useDeleteInstructor } from "@/hooks/useInstructors";
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/useTestimonials";
import AdminLogin from "@/components/Admin/AdminLogin";
import BootcampForm from "@/components/Admin/BootcampForm";
import CourseForm from "@/components/Admin/CourseForm";
import InstructorForm from "@/components/Admin/InstructorForm";
import TestimonialForm from "@/components/Admin/TestimonialForm";
import { uploadImage, createBootcamp, createCourse, createInstructor, nameToSlug } from "@/lib/firestore";
import { bootcamps as mockBootcamps, courses as mockCourses } from "@/data/courses";
import { instructorBios } from "@/data/instructors";
import type { FirestoreBootcamp, FirestoreTestimonial, FirestoreInstructor, FirestoreCourse } from "@/types/firestore";

type Tab = "bootcamps" | "courses" | "instructors" | "testimonials" | "seed";

export default function Admin() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  return <AdminDashboard onLogout={logout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("bootcamps");

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Top bar */}
      <div className="bg-white border-b border-[#E0E0E0] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Riddoff Admin</h1>
          <p className="text-xs text-muted-foreground">Course Management Dashboard</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E0E0E0] px-6">
        <div className="flex gap-6 overflow-x-auto">
          {(["bootcamps", "courses", "instructors", "testimonials", "seed"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3.5 text-sm font-semibold capitalize border-b-2 shrink-0 transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "seed" ? "Seed DB" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-8 max-w-5xl">
        {tab === "bootcamps" && <BootcampsTab />}
        {tab === "courses" && <CoursesTab />}
        {tab === "instructors" && <InstructorsTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "seed" && <SeedTab />}
      </div>
    </div>
  );
}

// ─── Bootcamps Tab ────────────────────────────────────────────────────────────

function BootcampsTab() {
  const { data = [], isLoading } = useBootcamps();
  const createMut = useCreateBootcamp();
  const updateMut = useUpdateBootcamp();
  const deleteMut = useDeleteBootcamp();
  const [editing, setEditing] = useState<(FirestoreBootcamp & { id: string }) | null>(null);
  const [adding, setAdding] = useState(false);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Bootcamps" count={data.length} onAdd={() => { setAdding(true); setEditing(null); }} />

      {(adding || editing) && (
        <Modal title={editing ? "Edit Bootcamp" : "Add Bootcamp"} onClose={() => { setAdding(false); setEditing(null); }}>
          <BootcampForm
            initial={editing ?? undefined}
            onSave={async (id, d) => {
              if (editing) await updateMut.mutateAsync({ id, data: d });
              else await createMut.mutateAsync({ id, data: d });
              setAdding(false); setEditing(null);
            }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </Modal>
      )}

      <div className="space-y-3 mt-4">
        {data.map((raw) => {
          const b = toBootcamp(raw);
          return (
            <ItemRow
              key={b.id}
              image={b.image}
              title={b.title}
              sub={`${b.sector} · ${b.hours}h · ₹${b.priceLow}`}
              badge={b.level}
              onEdit={() => { setEditing(raw); setAdding(false); }}
              onDelete={() => { if (confirm(`Delete "${b.title}"?`)) deleteMut.mutate(b.id); }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Courses Tab ──────────────────────────────────────────────────────────────

function CoursesTab() {
  const { data = [], isLoading } = useCourses();
  const createMut = useCreateCourse();
  const updateMut = useUpdateCourse();
  const deleteMut = useDeleteCourse();
  const [editing, setEditing] = useState<(FirestoreCourse & { id: string }) | null>(null);
  const [adding, setAdding] = useState(false);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Courses" count={data.length} onAdd={() => { setAdding(true); setEditing(null); }} />

      {(adding || editing) && (
        <Modal title={editing ? "Edit Course" : "Add Course"} onClose={() => { setAdding(false); setEditing(null); }}>
          <CourseForm
            initial={editing ?? undefined}
            onSave={async (id, d) => {
              if (editing) await updateMut.mutateAsync({ id, data: d });
              else await createMut.mutateAsync({ id, data: d });
              setAdding(false); setEditing(null);
            }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </Modal>
      )}

      <div className="space-y-3 mt-4">
        {data.map((raw) => {
          const c = toCourse(raw);
          return (
            <ItemRow
              key={c.id}
              image={c.image}
              title={c.title}
              sub={`${c.category} · ${c.weeks}w · ₹${c.priceLow}`}
              badge={c.level}
              onEdit={() => { setEditing(raw); setAdding(false); }}
              onDelete={() => { if (confirm(`Delete "${c.title}"?`)) deleteMut.mutate(c.id); }}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Instructors Tab ──────────────────────────────────────────────────────────

function InstructorsTab() {
  const { data = [], isLoading } = useInstructors();
  const createMut = useCreateInstructor();
  const updateMut = useUpdateInstructor();
  const deleteMut = useDeleteInstructor();
  const [editing, setEditing] = useState<(FirestoreInstructor & { id: string }) | null>(null);
  const [adding, setAdding] = useState(false);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Instructors" count={data.length} onAdd={() => { setAdding(true); setEditing(null); }} />

      {(adding || editing) && (
        <Modal title={editing ? "Edit Instructor" : "Add Instructor"} onClose={() => { setAdding(false); setEditing(null); }}>
          <InstructorForm
            initial={editing ?? undefined}
            onSave={async (name, d) => {
              if (editing) await updateMut.mutateAsync({ name: editing.name, data: d });
              else await createMut.mutateAsync({ name, data: d });
              setAdding(false); setEditing(null);
            }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </Modal>
      )}

      <div className="space-y-3 mt-4">
        {data.map((inst) => (
          <ItemRow
            key={inst.id}
            title={inst.name}
            sub={`${inst.title} · ${inst.courses} courses · ${inst.learners?.toLocaleString()} learners`}
            onEdit={() => { setEditing(inst); setAdding(false); }}
            onDelete={() => { if (confirm(`Delete "${inst.name}"?`)) deleteMut.mutate(inst.name); }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────

function TestimonialsTab() {
  const { data = [], isLoading } = useTestimonials();
  const createMut = useCreateTestimonial();
  const updateMut = useUpdateTestimonial();
  const deleteMut = useDeleteTestimonial();
  const [editing, setEditing] = useState<(FirestoreTestimonial & { id: string }) | null>(null);
  const [adding, setAdding] = useState(false);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <SectionHeader title="Testimonials" count={data.length} onAdd={() => { setAdding(true); setEditing(null); }} />

      {(adding || editing) && (
        <Modal title={editing ? "Edit Testimonial" : "Add Testimonial"} onClose={() => { setAdding(false); setEditing(null); }}>
          <TestimonialForm
            initial={editing ?? undefined}
            onSave={async (d) => {
              await createMut.mutateAsync(d as Omit<FirestoreTestimonial, "id">);
              setAdding(false);
            }}
            onUpdate={async (id, d) => {
              await updateMut.mutateAsync({ id, data: d });
              setEditing(null);
            }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </Modal>
      )}

      <div className="space-y-3 mt-4">
        {data.map((t) => (
          <ItemRow
            key={t.id}
            title={t.name}
            sub={`${t.role} · "${t.quote?.slice(0, 60)}…"`}
            onEdit={() => { setEditing(t); setAdding(false); }}
            onDelete={() => { if (confirm(`Delete testimonial from "${t.name}"?`)) deleteMut.mutate(t.id); }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function SectionHeader({ title, count, onAdd }: { title: string; count: number; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground">{count} items</p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus size={15} /> Add
      </button>
    </div>
  );
}

function ItemRow({
  image, title, sub, badge, onEdit, onDelete,
}: {
  image?: string;
  title: string;
  sub: string;
  badge?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] px-4 py-3 flex items-center gap-4">
      {image && (
        <img src={image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#F0F0F0]" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{sub}</p>
      </div>
      {badge && (
        <span className="text-xs px-2 py-0.5 bg-[#F0F7FF] text-primary rounded-full shrink-0">
          {badge}
        </span>
      )}
      <div className="flex gap-1 shrink-0">
        <button onClick={onEdit} className="p-2 rounded-lg hover:bg-[#F7F7F7] text-muted-foreground hover:text-foreground transition-colors">
          <Pencil size={15} />
        </button>
        <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl border border-[#E0E0E0] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0]">
          <h3 className="font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Seed Tab ─────────────────────────────────────────────────────────────────

function SeedTab() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function append(msg: string) {
    setLog((prev) => [...prev, msg]);
  }

  async function runSeed() {
    setRunning(true);
    setLog([]);

    try {
      // 1. Seed instructors
      append("Seeding instructors…");
      for (const [name, bio] of Object.entries(instructorBios)) {
        await createInstructor(nameToSlug(name), { name, ...bio });
        append(`  ✓ ${name}`);
      }

      // 2. Seed bootcamps (upload asset images to Firebase Storage)
      append("Seeding bootcamps…");
      for (const b of mockBootcamps) {
        let imageUrl = "";
        try {
          const res = await fetch(b.image);
          const blob = await res.blob();
          const file = new File([blob], `${b.id}.webp`, { type: blob.type });
          imageUrl = await uploadImage(file, `bootcamps/${b.id}/cover.webp`);
        } catch {
          append(`  ! Image upload failed for ${b.title}, skipping`);
          imageUrl = b.image;
        }
        await createBootcamp(b.id, {
          title: b.title,
          sector: b.sector,
          tagline: b.tagline,
          description: b.description,
          fullDescription: b.fullDescription,
          hours: b.hours,
          priceLow: b.priceLow,
          seats: b.seats,
          image: imageUrl,
          instructor: b.instructor,
          outcomes: b.outcomes,
          syllabus: b.syllabus,
          level: b.level,
          reviewCount: b.reviewCount,
          enrolledCount: b.enrolledCount,
        });
        append(`  ✓ ${b.title}`);
      }

      // 3. Seed courses
      append("Seeding courses…");
      for (const c of mockCourses) {
        let imageUrl = "";
        try {
          const res = await fetch(c.image);
          const blob = await res.blob();
          const file = new File([blob], `${c.id}.webp`, { type: blob.type });
          imageUrl = await uploadImage(file, `courses/${c.id}/cover.webp`);
        } catch {
          append(`  ! Image upload failed for ${c.title}, skipping`);
          imageUrl = c.image;
        }
        await createCourse(c.id, {
          title: c.title,
          category: c.category,
          tagline: c.tagline,
          description: c.description,
          fullDescription: c.fullDescription,
          hours: c.hours,
          weeks: c.weeks,
          priceLow: c.priceLow,
          image: imageUrl,
          instructor: c.instructor,
          outcomes: c.outcomes,
          syllabus: c.syllabus,
          level: c.level,
          reviewCount: c.reviewCount,
          enrolledCount: c.enrolledCount,
        });
        append(`  ✓ ${c.title}`);
      }

      append("Done! All mock data imported to Firestore.");
      setDone(true);
    } catch (err) {
      append(`Error: ${String(err)}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Seed Database</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Import all 12 bootcamps + 12 courses + 12 instructors from mock data into Firestore.
            Images are uploaded to Firebase Storage. Run once to migrate.
          </p>
        </div>
        <button
          onClick={runSeed}
          disabled={running || done}
          className="flex items-center gap-2 px-4 py-2 bg-foreground text-white rounded-lg text-sm font-semibold hover:bg-foreground/80 disabled:opacity-50 transition-colors shrink-0 ml-4"
        >
          {done ? <CheckCircle size={14} /> : running ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {done ? "Seeded" : running ? "Running…" : "Seed Now"}
        </button>
      </div>
      {log.length > 0 && (
        <pre className="bg-[#111] text-green-400 rounded-xl p-4 text-xs leading-relaxed overflow-auto max-h-80">
          {log.join("\n")}
        </pre>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  );
}
