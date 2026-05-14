import { useState } from "react";
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

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: "bootcamps", label: "Bootcamps", icon: "school" },
  { id: "courses", label: "Courses", icon: "menu_book" },
  { id: "instructors", label: "Instructors", icon: "person" },
  { id: "testimonials", label: "Testimonials", icon: "format_quote" },
  { id: "seed", label: "Database Seeding", icon: "storage" },
];

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcf8ff]">
        <span className="material-symbols-outlined animate-spin text-[#3525cd]" style={{ fontSize: 32 }}>progress_activity</span>
      </div>
    );
  }

  if (!user) return <AdminLogin />;
  return <AdminDashboard onLogout={logout} />;
}

// ─── Shell ───────────────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("bootcamps");

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b24]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#fcf8ff] border-r border-[#c7c4d8] shadow-sm flex flex-col py-8 z-50">
        <div className="px-8 mb-8">
          <h1 className="text-xl font-bold text-[#3525cd]">BootcampAdmin</h1>
          <p className="text-sm text-[#464555]">SaaS Platform Management</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-4 px-4 py-2.5 text-sm transition-all active:scale-[0.98] rounded-sm ${
                tab === id
                  ? "bg-[#3525cd]/10 border-l-4 border-[#3525cd] text-[#3525cd] font-semibold"
                  : "text-[#505f76] hover:bg-[#eae6f4] border-l-4 border-transparent"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-[#c7c4d8] pt-3 px-3 space-y-0.5">
          <button className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-[#505f76] hover:bg-[#eae6f4] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-2.5 text-sm text-[#505f76] hover:bg-[#eae6f4] transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>help</span>
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* Top header */}
      <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-[#fcf8ff]/80 backdrop-blur-md border-b border-[#c7c4d8] flex justify-between items-center px-6 z-40">
        <div className="flex items-center bg-[#f0ecf9] rounded-lg px-4 py-1.5 w-80">
          <span className="material-symbols-outlined text-[#464555] mr-2" style={{ fontSize: 20 }}>search</span>
          <input
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#777587]"
            placeholder={`Search ${tab}...`}
            type="text"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-bold text-[#1b1b24]">Admin User</p>
            <p className="text-xs text-[#464555]">Super Admin</p>
          </div>
          <button
            onClick={onLogout}
            className="text-sm font-medium text-[#ba1a1a] hover:text-[#ba1a1a]/80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="pl-[280px] pt-16 min-h-screen">
        <div className="pt-8 px-8 pb-8">
          {tab === "bootcamps" && <BootcampsTab />}
          {tab === "courses" && <CoursesTab />}
          {tab === "instructors" && <InstructorsTab />}
          {tab === "testimonials" && <TestimonialsTab />}
          {tab === "seed" && <SeedTab />}
        </div>
      </main>
    </div>
  );
}

// ─── Bootcamps ────────────────────────────────────────────────────────────────

function BootcampsTab() {
  const { data = [], isLoading } = useBootcamps();
  const createMut = useCreateBootcamp();
  const updateMut = useUpdateBootcamp();
  const deleteMut = useDeleteBootcamp();
  const [editing, setEditing] = useState<(FirestoreBootcamp & { id: string }) | null>(null);
  const [adding, setAdding] = useState(false);

  if (isLoading) return <Spinner />;

  const totalEnrolled = data.reduce((s, b) => s + (toBootcamp(b).enrolledCount ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Bootcamps"
        subtitle="Manage your educational programs and cohorts."
        onAdd={() => { setAdding(true); setEditing(null); }}
        addLabel="Add New Bootcamp"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <StatCard icon="rocket_launch" iconBg="bg-[#3525cd]/10" iconColor="text-[#3525cd]"
          label="Active Bootcamps" value={data.length} trend={`${data.length} total`} trendUp />
        <StatCard icon="groups" iconBg="bg-[#d0e1fb]" iconColor="text-[#54647a]"
          label="Total Enrollment" value={totalEnrolled.toLocaleString()} trend="from Firestore" trendUp />
        <StatCard icon="verified" iconBg="bg-[#ffdbcc]" iconColor="text-[#351000]"
          label="Avg. Completion Rate" value="94%" trend="0.4% from peak" trendUp={false} />
      </div>

      {/* Table */}
      <div className="bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#c7c4d8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]" style={{ fontSize: 18 }}>filter_list</span>
              <select className="pl-9 pr-8 py-2 bg-[#f5f2ff] border border-[#c7c4d8] rounded-lg text-sm appearance-none focus:outline-none focus:border-[#3525cd]">
                <option>All Sectors</option>
              </select>
            </div>
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#777587]">{data.length} bootcamps</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f5f2ff]">
                {["Bootcamp", "Sector", "Duration", "Price", "Level", "Actions"].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[#505f76]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]">
              {data.map((raw) => {
                const b = toBootcamp(raw);
                return (
                  <tr key={b.id} className="hover:bg-[#f5f2ff]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {b.image && (
                          <img src={b.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#f0ecf9]" />
                        )}
                        <div>
                          <p className="text-sm font-bold text-[#1b1b24]">{b.title}</p>
                          <p className="text-xs text-[#464555]">{b.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-[#3525cd]/10 text-[#3525cd] rounded text-xs font-semibold">{b.sector}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#464555]">{b.hours}h</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1b1b24]">₹{b.priceLow?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <LevelBadge level={b.level} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditing(raw); setAdding(false); }}
                          className="p-2 hover:bg-[#eae6f4] rounded-full text-[#505f76] transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${b.title}"?`)) deleteMut.mutate(b.id); }}
                          className="p-2 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-full transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {(adding || editing) && (
        <Modal title={editing ? "Edit Bootcamp" : "Add New Bootcamp"} onClose={() => { setAdding(false); setEditing(null); }}>
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
    </div>
  );
}

// ─── Courses ──────────────────────────────────────────────────────────────────

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
      <PageHeader
        title="Courses"
        subtitle="Manage educational curricula, instructors, and student progress."
        onAdd={() => { setAdding(true); setEditing(null); }}
        addLabel="Add New Course"
      />

      <div className="bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#c7c4d8] flex items-center justify-between bg-[#ffffff]">
          <div className="flex gap-2">
            <select className="bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg text-sm px-4 py-2 focus:outline-none focus:border-[#3525cd]">
              <option>All Categories</option>
            </select>
          </div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#777587]">
            {data.length} courses
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f5f2ff]">
                {["Cover", "Course Title", "Category", "Weeks", "Instructor", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-[#777587]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]">
              {data.map((raw) => {
                const c = toCourse(raw);
                return (
                  <tr key={c.id} className="hover:bg-[#eae6f4] transition-colors group">
                    <td className="px-4 py-4">
                      <div className="w-16 h-10 rounded overflow-hidden bg-[#e4e1ee] border border-[#c7c4d8] shrink-0">
                        {c.image && <img src={c.image} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#1b1b24]">{c.title}</td>
                    <td className="px-4 py-4">
                      <span className="bg-[#d0e1fb] text-[#54647a] px-2 py-0.5 rounded-full text-xs font-semibold uppercase">{c.category}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-[#464555]">{c.weeks}</td>
                    <td className="px-4 py-4 text-sm text-[#3525cd] font-medium">{c.instructor}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditing(raw); setAdding(false); }}
                          className="p-1 hover:bg-[#3525cd]/10 text-[#3525cd] rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${c.title}"?`)) deleteMut.mutate(c.id); }}
                          className="p-1 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-[#f5f2ff] border-t border-[#c7c4d8]">
          <p className="text-sm text-[#464555]">Showing {data.length} courses</p>
        </div>
      </div>

      {(adding || editing) && (
        <Modal title={editing ? "Edit Course" : "Add New Course"} onClose={() => { setAdding(false); setEditing(null); }}>
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
    </div>
  );
}

// ─── Instructors ──────────────────────────────────────────────────────────────

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
      <PageHeader
        title="Instructors"
        subtitle="Manage your educator roster and their profiles."
        onAdd={() => { setAdding(true); setEditing(null); }}
        addLabel="Add Instructor"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((inst) => {
          const initials = inst.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);
          return (
            <div key={inst.id} className="bg-white rounded-xl border border-[#c7c4d8] shadow-sm p-5 group relative">
              <div className="flex items-start gap-4">
                {inst.photoUrl ? (
                  <img src={inst.photoUrl} alt={inst.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd] font-bold text-lg shrink-0">
                    {initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#1b1b24] text-sm leading-tight">{inst.name}</p>
                  <p className="text-xs text-[#464555] mt-0.5">{inst.title}</p>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <span className="text-xs text-[#505f76]">{inst.courses} courses</span>
                    <span className="text-xs text-[#505f76]">{inst.learners?.toLocaleString()} learners</span>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => { setEditing(inst); setAdding(false); }}
                  className="p-1.5 hover:bg-[#eae6f4] rounded-lg text-[#505f76] transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${inst.name}"?`)) deleteMut.mutate(inst.name); }}
                  className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

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
      <PageHeader
        title="Testimonials"
        subtitle="Manage student success stories and social proof."
        onAdd={() => { setAdding(true); setEditing(null); }}
        addLabel="Add Testimonial"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-[#c7c4d8] shadow-sm p-5 group relative">
            <span className="material-symbols-outlined text-[#3525cd]/30 mb-2 block" style={{ fontSize: 28 }}>format_quote</span>
            <p className="text-sm text-[#1b1b24] leading-relaxed mb-4 line-clamp-3">{t.quote}</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd] font-bold text-sm shrink-0">
                {t.name?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1b1b24]">{t.name}</p>
                <p className="text-xs text-[#464555]">{t.role}</p>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditing(t); setAdding(false); }}
                className="p-1.5 hover:bg-[#eae6f4] rounded-lg text-[#505f76] transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
              </button>
              <button
                onClick={() => { if (confirm(`Delete testimonial from "${t.name}"?`)) deleteMut.mutate(t.id); }}
                className="p-1.5 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <Modal title={editing ? "Edit Testimonial" : "Add Testimonial"} onClose={() => { setAdding(false); setEditing(null); }}>
          <TestimonialForm
            initial={editing ?? undefined}
            onSave={async (d) => { await createMut.mutateAsync(d as Omit<FirestoreTestimonial, "id">); setAdding(false); }}
            onUpdate={async (id, d) => { await updateMut.mutateAsync({ id, data: d }); setEditing(null); }}
            onCancel={() => { setAdding(false); setEditing(null); }}
          />
        </Modal>
      )}
    </div>
  );
}

// ─── Seed Tab ─────────────────────────────────────────────────────────────────

function SeedTab() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function append(msg: string) { setLog((prev) => [...prev, msg]); }

  async function runSeed() {
    setRunning(true); setLog([]);
    try {
      append("Seeding instructors…");
      for (const [name, bio] of Object.entries(instructorBios)) {
        await createInstructor(nameToSlug(name), { name, ...bio });
        append(`  ✓ ${name}`);
      }
      append("Seeding bootcamps…");
      for (const b of mockBootcamps) {
        let imageUrl = b.image;
        try {
          const res = await fetch(b.image);
          const blob = await res.blob();
          imageUrl = await uploadImage(new File([blob], `${b.id}.webp`, { type: blob.type }), `bootcamps/${b.id}/cover.webp`);
        } catch { append(`  ! Image upload failed for ${b.title}`); }
        await createBootcamp(b.id, { title: b.title, sector: b.sector, tagline: b.tagline, description: b.description, fullDescription: b.fullDescription, hours: b.hours, priceLow: b.priceLow, seats: b.seats, image: imageUrl, instructor: b.instructor, outcomes: b.outcomes, syllabus: b.syllabus, level: b.level, reviewCount: b.reviewCount, enrolledCount: b.enrolledCount });
        append(`  ✓ ${b.title}`);
      }
      append("Seeding courses…");
      for (const c of mockCourses) {
        let imageUrl = c.image;
        try {
          const res = await fetch(c.image);
          const blob = await res.blob();
          imageUrl = await uploadImage(new File([blob], `${c.id}.webp`, { type: blob.type }), `courses/${c.id}/cover.webp`);
        } catch { append(`  ! Image upload failed for ${c.title}`); }
        await createCourse(c.id, { title: c.title, category: c.category, tagline: c.tagline, description: c.description, fullDescription: c.fullDescription, hours: c.hours, weeks: c.weeks, priceLow: c.priceLow, image: imageUrl, instructor: c.instructor, outcomes: c.outcomes, syllabus: c.syllabus, level: c.level, reviewCount: c.reviewCount, enrolledCount: c.enrolledCount });
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
    <div>
      <PageHeader title="Database Seeding" subtitle="Import all mock data into Firestore with images uploaded to Firebase Storage." />

      <div className="max-w-2xl bg-white rounded-xl border border-[#c7c4d8] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#c7c4d8] bg-[#f5f2ff]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1b1b24]">Seed Database</h3>
              <p className="text-sm text-[#464555] mt-1">
                Imports 12 bootcamps + 12 courses + 12 instructors. Safe to re-run — overwrites existing data.
              </p>
            </div>
            <button
              onClick={runSeed}
              disabled={running || done}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shrink-0 transition-all active:scale-[0.98] disabled:opacity-50 bg-[#3525cd] text-white hover:bg-[#4f46e5]"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {done ? "check_circle" : running ? "progress_activity" : "upload"}
              </span>
              {done ? "Seeded" : running ? "Running…" : "Seed Now"}
            </button>
          </div>
        </div>

        {log.length > 0 && (
          <pre className="bg-[#1b1b24] text-emerald-400 p-6 text-xs leading-relaxed overflow-auto max-h-80 font-mono">
            {log.join("\n")}
          </pre>
        )}
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, onAdd, addLabel }: {
  title: string; subtitle: string; onAdd?: () => void; addLabel?: string;
}) {
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-4xl font-bold text-[#1b1b24]" style={{ letterSpacing: "-0.02em" }}>{title}</h2>
        <p className="text-base text-[#464555] mt-1">{subtitle}</p>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#3525cd] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-[#4f46e5] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          {addLabel}
        </button>
      )}
    </div>
  );
}

function StatCard({ icon, iconBg, iconColor, label, value, trend, trendUp }: {
  icon: string; iconBg: string; iconColor: string;
  label: string; value: string | number; trend: string; trendUp: boolean;
}) {
  return (
    <div className="bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#464555]">{label}</p>
          <h3 className="text-4xl font-bold text-[#1b1b24] mt-1" style={{ letterSpacing: "-0.02em" }}>{value}</h3>
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
        </div>
      </div>
      <div className={`mt-6 flex items-center gap-1 text-sm font-medium ${trendUp ? "text-emerald-600" : "text-rose-600"}`}>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{trendUp ? "trending_up" : "trending_down"}</span>
        <span>{trend}</span>
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level?: string }) {
  if (!level) return null;
  const styles: Record<string, string> = {
    Beginner: "bg-[#ffdbcc] text-[#351000]",
    Intermediate: "bg-[#d0e1fb] text-[#54647a]",
    Advanced: "bg-[#ffdad6] text-[#93000a]",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[level] ?? "bg-[#f0ecf9] text-[#464555]"}`}>
      {level}
    </span>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl border border-[#c7c4d8] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c7c4d8]">
          <h3 className="font-bold text-[#1b1b24]">{title}</h3>
          <button onClick={onClose} className="text-[#464555] hover:text-[#1b1b24] text-2xl leading-none transition-colors">×</button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <span className="material-symbols-outlined animate-spin text-[#3525cd]" style={{ fontSize: 32 }}>progress_activity</span>
    </div>
  );
}
