import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBootcamps, useCreateBootcamp, useUpdateBootcamp, useDeleteBootcamp, toBootcamp } from "@/hooks/useBootcamps";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, toCourse } from "@/hooks/useCourses";
import { useInstructors, useCreateInstructor, useUpdateInstructor, useDeleteInstructor } from "@/hooks/useInstructors";
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/useTestimonials";
import { usePaths, useCreatePath, useUpdatePath, useDeletePath } from "@/hooks/usePaths";
import { useUnits, useCreateUnit, useUpdateUnit, useDeleteUnit } from "@/hooks/useUnits";
import BootcampForm from "@/components/Admin/BootcampForm";
import CourseForm from "@/components/Admin/CourseForm";
import InstructorForm from "@/components/Admin/InstructorForm";
import TestimonialForm from "@/components/Admin/TestimonialForm";
import PathForm from "@/components/Admin/PathForm";
import UnitForm from "@/components/Admin/UnitForm";
import { uploadImage, createBootcamp, createCourse, createInstructor, nameToSlug } from "@/lib/firestore";
import { bootcamps as mockBootcamps, courses as mockCourses } from "@/data/courses";
import { instructorBios } from "@/data/instructors";
import type { FirestoreBootcamp, FirestoreTestimonial, FirestoreInstructor, FirestoreCourse, FirestorePath, FirestoreUnit } from "@/types/firestore";

type Tab = "bootcamps" | "courses" | "instructors" | "testimonials" | "seed" | "paths" | "units";

const NAV: { id: string; label: string; icon: string }[] = [
  { id: "bootcamps", label: "Bootcamps", icon: "school" },
  { id: "courses", label: "Courses", icon: "menu_book" },
  { id: "instructors", label: "Instructors", icon: "person" },
  { id: "testimonials", label: "Testimonials", icon: "format_quote" },
  { id: "reviews", label: "Reviews", icon: "rate_review" },
  { id: "seed", label: "Database Seeding", icon: "storage" },
  { id: "paths", label: "Learning Paths", icon: "route" },
  { id: "units", label: "Learning Units", icon: "view_module" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Admin() {
  const { user, signOut } = useAuth();
  return <AdminDashboard onLogout={signOut} userEmail={user?.email ?? ""} />;
}

// ─── Shell ───────────────────────────────────────────────────────────────────

function AdminDashboard({ onLogout, userEmail }: { onLogout: () => void; userEmail: string }) {
  const [tab, setTab] = useState<Tab>("bootcamps");
  const initials = (userEmail.slice(0, 2) || "AU").toUpperCase();

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b24] font-inter">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] bg-[#fcf8ff] border-r border-[#c7c4d8] shadow-sm flex flex-col py-8 z-50">
        <div className="px-8 mb-8">
          <h1 className="text-[20px] leading-7 font-bold text-[#3525cd]">BootcampAdmin</h1>
          <p className="text-[14px] text-[#464555]">SaaS Platform Management</p>
        </div>

        <nav className="flex-1 space-y-[4px] px-4">
          {NAV.map(({ id, label, icon }) => {
            const isActive = id === tab;
            const isClickable = id !== "reviews";
            return (
              <button
                key={id}
                onClick={() => isClickable && setTab(id as Tab)}
                className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-all active:scale-[0.98] text-left ${
                  isActive
                    ? "bg-[#3525cd]/10 border-l-4 border-[#3525cd] text-[#3525cd] font-semibold"
                    : "text-[#505f76] hover:bg-[#eae6f4] border-l-4 border-transparent"
                }`}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-[4px]">
          <button className="w-full flex items-center gap-4 px-8 py-2 text-[14px] text-[#505f76] hover:bg-[#eae6f4] transition-colors">
            <Icon name="settings" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-4 px-8 py-2 text-[14px] text-[#505f76] hover:bg-[#eae6f4] transition-colors">
            <Icon name="help" />
            <span>Support</span>
          </button>
          <div className="px-4 mt-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d0e1fb] flex items-center justify-center text-[#54647a] text-xs font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#1b1b24] leading-tight">Admin User</p>
              <p className="text-[10px] text-[#464555] uppercase tracking-wide">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Top header */}
      <AdminHeader tab={tab} onLogout={onLogout} initials={initials} />

      {/* Content */}
      <main className="pl-[280px] pt-16 min-h-screen">
        <div className="pt-8 px-8 pb-8">
          {tab === "bootcamps" && <BootcampsTab />}
          {tab === "courses" && <CoursesTab />}
          {tab === "instructors" && <InstructorsTab />}
          {tab === "testimonials" && <TestimonialsTab />}
          {tab === "seed" && <SeedTab />}
          {tab === "paths" && <PathsTab />}
          {tab === "units" && <UnitsTab />}
        </div>
      </main>
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function AdminHeader({ tab, onLogout, initials }: { tab: Tab; onLogout: () => void; initials: string }) {
  const searchPlaceholders: Record<Tab, string> = {
    bootcamps: "Search Bootcamps...",
    courses: "Search courses, instructors...",
    instructors: "Search instructors, courses, or logs...",
    testimonials: "Search testimonials...",
    seed: "Search data assets...",
    paths: "Search learning paths...",
    units: "Search learning units...",
  };

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-[#fcf8ff]/80 backdrop-blur-md border-b border-[#c7c4d8] flex justify-between items-center px-6 z-40">
      <div className="flex items-center bg-[#f0ecf9] rounded-lg px-4 py-1.5 w-80 max-w-sm">
        <Icon name="search" className="text-[#464555] mr-2 text-[20px]" />
        <input
          className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#777587]"
          placeholder={searchPlaceholders[tab]}
          type="text"
        />
      </div>

      <div className="flex items-center gap-6">
        {tab === "courses" ? (
          <>
            <div className="flex items-center gap-4">
              <span className="text-[14px] font-bold text-[#3525cd] border-b-2 border-[#3525cd] pb-0.5 cursor-pointer">Dashboard</span>
              <span className="text-[14px] text-[#464555] hover:text-[#3525cd] transition-colors cursor-pointer">Analytics</span>
            </div>
            <div className="h-6 w-px bg-[#c7c4d8]" />
            <button onClick={onLogout} className="text-sm text-[#464555] hover:text-[#3525cd] transition-colors cursor-pointer">Sign Out</button>
          </>
        ) : tab === "testimonials" ? (
          <>
            <button className="text-[#505f76] hover:text-[#3525cd] transition-colors">
              <Icon name="notifications" />
            </button>
            <button onClick={onLogout} className="text-sm text-[#464555] hover:text-[#3525cd] transition-colors cursor-pointer">Sign Out</button>
          </>
        ) : tab === "seed" ? (
          <>
            <div className="flex items-center gap-4">
              <button className="text-[#464555] hover:text-[#3525cd] transition-colors"><Icon name="notifications" /></button>
              <button className="text-[#464555] hover:text-[#3525cd] transition-colors"><Icon name="history" /></button>
            </div>
            <button onClick={onLogout} className="text-sm text-[#464555] hover:text-[#3525cd] transition-colors">Sign Out</button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 cursor-pointer active:opacity-70">
              <div className="text-right">
                <p className="text-[14px] font-bold text-[#1b1b24]">Admin User</p>
                <p className="text-[14px] text-[#464555]">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#d0e1fb] flex items-center justify-center text-[#54647a] font-bold border border-[#c7c4d8]">
                {initials}
              </div>
            </div>
            <button
              onClick={onLogout}
              className={`text-sm font-medium transition-colors ${tab === "instructors" ? "text-[#3525cd] hover:underline cursor-pointer" : "text-[#ba1a1a] hover:text-[#ba1a1a]/80"}`}
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
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
  const showForm = adding || !!editing;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[36px] leading-[44px] font-bold text-[#1b1b24] tracking-tight">Bootcamps</h2>
          <p className="text-[16px] text-[#464555] mt-1">Manage your educational programs and cohorts.</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditing(null); }}
          className="bg-[#3525cd] text-white px-8 py-4 rounded-lg text-[14px] font-medium flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all"
        >
          <Icon name="add" />
          Add New Bootcamp
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Stat cards */}
        <div className="col-span-12 lg:col-span-4 bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-medium text-[#464555] uppercase tracking-wider">Active Bootcamps</p>
              <h3 className="text-[36px] font-bold text-[#1b1b24] mt-1 tracking-tight">{data.length}</h3>
            </div>
            <div className="w-10 h-10 bg-[#3525cd]/10 rounded-lg flex items-center justify-center text-[#3525cd]">
              <Icon name="rocket_launch" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-emerald-600 text-[14px] font-medium">
            <Icon name="trending_up" className="text-sm" />
            <span>12% increase this month</span>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-medium text-[#464555] uppercase tracking-wider">Total Enrollment</p>
              <h3 className="text-[36px] font-bold text-[#1b1b24] mt-1 tracking-tight">{totalEnrolled.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 bg-[#d0e1fb] rounded-lg flex items-center justify-center text-[#54647a]">
              <Icon name="groups" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-emerald-600 text-[14px] font-medium">
            <Icon name="trending_up" className="text-sm" />
            <span>5.2% vs last quarter</span>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-medium text-[#464555] uppercase tracking-wider">Avg. Completion Rate</p>
              <h3 className="text-[36px] font-bold text-[#1b1b24] mt-1 tracking-tight">94%</h3>
            </div>
            <div className="w-10 h-10 bg-[#ffdbcc] rounded-lg flex items-center justify-center text-[#351000]">
              <Icon name="verified" />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-rose-600 text-[14px] font-medium">
            <Icon name="trending_down" className="text-sm" />
            <span>0.4% from peak</span>
          </div>
        </div>

        {/* Table */}
        <div className="col-span-12 bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#c7c4d8] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Icon name="filter_list" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#464555] text-[18px]" />
                <select aria-label="Filter by sector" className="pl-10 pr-8 py-2 bg-[#f5f2ff] border border-[#c7c4d8] rounded-lg text-[14px] appearance-none focus:outline-none focus:border-[#3525cd]">
                  <option>All Sectors</option>
                  <option>Development</option>
                  <option>Design</option>
                  <option>Data Science</option>
                </select>
              </div>
              <div className="relative">
                <select aria-label="Filter by level" className="pl-4 pr-8 py-2 bg-[#f5f2ff] border border-[#c7c4d8] rounded-lg text-[14px] appearance-none focus:outline-none focus:border-[#3525cd]">
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 border border-[#c7c4d8] rounded-lg text-[14px] flex items-center gap-2 hover:bg-[#eae6f4] transition-colors">
                <Icon name="file_download" className="text-[18px]" />
                Export CSV
              </button>
            </div>
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
                          {b.image && <img src={b.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 bg-[#f0ecf9]" />}
                          <div>
                            <p className="text-[14px] font-bold text-[#1b1b24]">{b.title}</p>
                            <p className="text-[14px] text-[#464555]">{b.tagline}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-[#3525cd]/10 text-[#3525cd] rounded text-xs font-semibold">{b.sector}</span>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#464555]">{b.hours} Hours</td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-[#1b1b24]">₹{b.priceLow?.toLocaleString()}</td>
                      <td className="px-6 py-4"><LevelBadge level={b.level} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button aria-label={`Edit ${b.title}`} onClick={() => { setEditing(raw); setAdding(false); }} className="p-2 hover:bg-[#eae6f4] rounded-full text-[#505f76] transition-colors">
                            <Icon name="edit" />
                          </button>
                          <button aria-label={`Delete ${b.title}`} onClick={() => { if (confirm(`Delete "${b.title}"?`)) deleteMut.mutate(b.id); }} className="p-2 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-full transition-colors">
                            <Icon name="delete" />
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

        {/* Inline Add/Edit Form */}
        {showForm && (
          <div className="col-span-12">
            <div className="bg-[#fcf8ff] rounded-xl border border-[#c7c4d8] shadow-sm overflow-hidden">
              <div className="p-8 border-b border-[#c7c4d8] bg-[#f5f2ff]">
                <h3 className="text-[20px] font-semibold text-[#1b1b24]">{editing ? "Edit Bootcamp" : "Add New Bootcamp"}</h3>
                <p className="text-[14px] text-[#464555]">Draft the details for a new educational offering.</p>
              </div>
              <div className="p-8">
                <BootcampForm
                  initial={editing ?? undefined}
                  onSave={async (id, d) => {
                    if (editing) await updateMut.mutateAsync({ id, data: d });
                    else await createMut.mutateAsync({ id, data: d });
                    setAdding(false); setEditing(null);
                  }}
                  onCancel={() => { setAdding(false); setEditing(null); }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
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
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  if (isLoading) return <Spinner />;

  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const pageData = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[24px] leading-8 font-semibold text-[#1b1b24] tracking-tight">Courses</h2>
          <p className="text-[14px] text-[#464555] mt-1">Manage educational curricula, instructors, and student progress.</p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="bg-[#3525cd] text-white px-6 py-2 rounded-lg text-[14px] font-medium flex items-center gap-2 shadow-sm hover:bg-[#4f46e5] active:scale-95 transition-all"
        >
          <Icon name="add" />
          Add New Course
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Table section */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#c7c4d8] flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <select aria-label="Filter by category" className="bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg text-[14px] px-4 py-2 focus:border-[#3525cd] focus:outline-none">
                <option>All Categories</option>
                <option>Web Development</option>
                <option>UI/UX Design</option>
                <option>Data Science</option>
              </select>
              <select aria-label="Filter by status" className="bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg text-[14px] px-4 py-2 focus:border-[#3525cd] focus:outline-none">
                <option>All Statuses</option>
                <option>Active</option>
                <option>Archived</option>
              </select>
            </div>
            <p className="text-xs font-semibold text-[#777587] uppercase tracking-wider">Showing {data.length} Courses</p>
          </div>

          <div className="bg-[#fcf8ff] rounded-xl overflow-hidden shadow-sm border border-[#c7c4d8]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f2ff]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Cover</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Course Title</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase text-center">Weeks</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Instructor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c7c4d8]">
                {pageData.map((raw) => {
                  const c = toCourse(raw);
                  return (
                    <tr key={c.id} className="hover:bg-[#eae6f4] transition-colors group">
                      <td className="px-4 py-4">
                        <div className="w-16 h-10 rounded overflow-hidden bg-[#e4e1ee] border border-[#c7c4d8] shrink-0">
                          {c.image && <img src={c.image} alt="" className="w-full h-full object-cover" />}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[14px] font-semibold text-[#1b1b24]">{c.title}</td>
                      <td className="px-4 py-4">
                        <span className="bg-[#d0e1fb] text-[#54647a] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">{c.category}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-[14px] text-[#464555]">{c.weeks}</td>
                      <td className="px-4 py-4 text-[14px] text-[#3525cd] font-medium hover:underline cursor-pointer">{c.instructor}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button aria-label={`Edit ${c.title}`} onClick={() => setEditing(raw)} className="p-1 hover:bg-[#3525cd]/10 text-[#3525cd] rounded-lg transition-colors">
                            <Icon name="edit" />
                          </button>
                          <button aria-label={`Delete ${c.title}`} onClick={() => { if (confirm(`Delete "${c.title}"?`)) deleteMut.mutate(c.id); }} className="p-1 hover:bg-[#ffdad6]/40 text-[#ba1a1a] rounded-lg transition-colors">
                            <Icon name="delete" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-4 py-3 bg-[#f5f2ff] border-t border-[#c7c4d8] flex justify-between items-center">
              <p className="text-[14px] text-[#464555]">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, data.length)} of {data.length} courses</p>
              <div className="flex gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded border border-[#c7c4d8] hover:bg-[#e4e1ee] disabled:opacity-50">
                  <Icon name="chevron_left" className="text-[18px]" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded text-xs font-semibold ${n === page ? "bg-[#3525cd] text-white" : "hover:bg-[#e4e1ee]"}`}>{n}</button>
                ))}
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded border border-[#c7c4d8] hover:bg-[#e4e1ee] disabled:opacity-50">
                  <Icon name="chevron_right" className="text-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky form panel */}
        <div className="col-span-12 lg:col-span-4">
          <section className="bg-white rounded-xl shadow-lg border border-[#c7c4d8] overflow-hidden sticky top-24">
            <div className="bg-[#3525cd] px-6 py-4">
              <h3 className="text-[20px] font-semibold text-white">{editing ? "Edit Course" : "Add New Course"}</h3>
              <p className="text-xs text-[#dad7ff]/80 uppercase tracking-widest font-bold">{editing ? "Editing Entry" : "New Entry Form"}</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <CourseForm
                key={editing?.id ?? "new"}
                initial={editing ?? undefined}
                onSave={async (id, d) => {
                  if (editing) await updateMut.mutateAsync({ id, data: d });
                  else await createMut.mutateAsync({ id, data: d });
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            </div>
          </section>
        </div>
      </div>
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
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  if (isLoading) return <Spinner />;

  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const pageData = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[24px] leading-8 font-semibold text-[#1b1b24] tracking-tight">Instructors</h2>
          <p className="text-[14px] text-[#464555]">Manage your global faculty of bootcamp mentors and industry experts.</p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="flex items-center gap-2 bg-[#3525cd] text-white px-6 py-2 rounded-lg text-[14px] font-medium hover:shadow-lg active:scale-[0.98] transition-all"
        >
          <Icon name="add" />
          Add New Instructor
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Faculty List table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm border border-[#c7c4d8] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#c7c4d8] flex justify-between items-center bg-[#f0ecf9]">
            <h3 className="text-[20px] font-semibold text-[#1b1b24]">Faculty List</h3>
            <div className="flex items-center gap-2">
              <button className="text-[#464555] hover:text-[#3525cd] transition-colors cursor-pointer"><Icon name="filter_list" /></button>
              <button className="text-[#464555] hover:text-[#3525cd] transition-colors cursor-pointer"><Icon name="download" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f5f2ff]">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider text-center">Courses</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider text-center">Learners</th>
                  <th className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c7c4d8]">
                {pageData.map((inst) => {
                  const initials = inst.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <tr key={inst.id} className="group hover:bg-[#eae6f4] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {inst.photoUrl ? (
                            <img src={inst.photoUrl} alt={inst.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd] font-bold text-sm shrink-0">
                              {initials}
                            </div>
                          )}
                          <div>
                            <p className="text-[14px] font-medium text-[#1b1b24]">{inst.name}</p>
                            <p className="text-[12px] text-[#464555]">{inst.name.toLowerCase().replace(/\s+/g, ".")}@bootcamp.edu</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#1b1b24]">{inst.title}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 bg-[#d0e1fb] text-[#54647a] rounded-full text-xs font-semibold">{inst.courses}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-[14px] text-[#1b1b24]">{inst.learners?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button aria-label={`Edit ${inst.name}`} onClick={() => setEditing(inst)} className="p-1 hover:bg-[#3525cd]/10 rounded-lg text-[#3525cd] transition-colors">
                            <Icon name="edit" />
                          </button>
                          <button aria-label={`Delete ${inst.name}`} onClick={() => { if (confirm(`Delete "${inst.name}"?`)) deleteMut.mutate(inst.name); }} className="p-1 hover:bg-[#ffdad6]/40 rounded-lg text-[#ba1a1a] transition-colors">
                            <Icon name="delete" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-[#f5f2ff] border-t border-[#c7c4d8] flex justify-between items-center">
            <p className="text-xs font-semibold text-[#464555]">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, data.length)} of {data.length} instructors</p>
            <div className="flex gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1 border border-[#c7c4d8] rounded hover:bg-[#eae6f4] transition-colors disabled:opacity-50">
                <Icon name="chevron_left" className="text-[18px]" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`px-2 py-1 border border-[#c7c4d8] rounded text-xs font-semibold ${n === page ? "bg-[#3525cd] text-white border-[#3525cd]" : "hover:bg-[#eae6f4]"}`}>{n}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-1 border border-[#c7c4d8] rounded hover:bg-[#eae6f4] transition-colors disabled:opacity-50">
                <Icon name="chevron_right" className="text-[18px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Form panel + Faculty Capacity */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-[#c7c4d8] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#c7c4d8] bg-[#f0ecf9]">
              <h3 className="text-[20px] font-semibold text-[#1b1b24]">{editing ? "Edit Instructor" : "Add New Instructor"}</h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-[480px]">
              <InstructorForm
                key={editing?.id ?? "new"}
                initial={editing ?? undefined}
                onSave={async (name, d) => {
                  if (editing) await updateMut.mutateAsync({ name: editing.name, data: d });
                  else await createMut.mutateAsync({ name, data: d });
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            </div>
          </section>

          {/* Faculty Capacity card */}
          <div className="bg-[#3525cd] text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[20px] font-semibold opacity-90">Faculty Capacity</h4>
              <div className="mt-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[32px] font-bold">84%</span>
                  <span className="text-xs font-semibold uppercase opacity-70">Utilized</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full w-[84%]" />
                </div>
              </div>
              <p className="mt-6 text-[13px] leading-relaxed opacity-80">You currently have {data.length} active instructors. 3 pending applications require review.</p>
            </div>
            <Icon name="groups" className="absolute -right-4 -bottom-4 text-[120px] opacity-10 rotate-12" />
          </div>
        </div>
      </div>
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

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[36px] leading-[44px] font-bold text-[#1b1b24] tracking-tight">Testimonials</h2>
          <p className="text-[16px] text-[#464555]">Manage social proof and student success stories.</p>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="bg-[#3525cd] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#4f46e5] transition-all shadow-sm active:scale-95"
        >
          <Icon name="add" />
          <span className="text-[14px] font-medium">Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#c7c4d8] overflow-hidden">
          <div className="p-6 border-b border-[#c7c4d8] flex justify-between items-center bg-[#f5f2ff]/30">
            <h3 className="text-[20px] font-semibold text-[#1b1b24]">Active Testimonials</h3>
            <div className="flex gap-2">
              <span className="bg-[#3525cd]/10 text-[#3525cd] px-2 py-1 rounded text-xs font-semibold">{data.length} Total</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#eae6f4]/50 border-b border-[#c7c4d8]">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-[#777587] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#777587] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#777587] uppercase tracking-wider">Quote Preview</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#777587] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c7c4d8]/30">
                {data.map((t) => (
                  <tr key={t.id} className="hover:bg-[#f5f2ff] transition-colors group">
                    <td className="px-6 py-4 text-[14px] text-[#1b1b24] font-semibold">{t.name}</td>
                    <td className="px-6 py-4 text-[14px] text-[#464555]">{t.role}</td>
                    <td className="px-6 py-4 text-[14px] text-[#464555] max-w-xs">
                      <p className="line-clamp-2">"{t.quote}"</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button aria-label={`Edit testimonial from ${t.name}`} onClick={() => setEditing(t)} className="text-[#3525cd] hover:bg-[#3525cd]/10 p-2 rounded-full transition-colors">
                          <Icon name="edit" />
                        </button>
                        <button aria-label={`Delete testimonial from ${t.name}`} onClick={() => { if (confirm(`Delete testimonial from "${t.name}"?`)) deleteMut.mutate(t.id); }} className="text-[#ba1a1a] hover:bg-[#ffdad6] p-2 rounded-full transition-colors">
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#c7c4d8] bg-[#f5f2ff]/20 flex justify-center">
            <button className="text-[#3525cd] text-[14px] font-medium flex items-center gap-2 hover:underline">
              View All Testimonials
              <Icon name="arrow_forward" />
            </button>
          </div>
        </div>

        {/* Form + Impact card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-[#c7c4d8] p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-[20px] font-semibold text-[#1b1b24]">{editing ? "Edit Testimonial" : "Add New Testimonial"}</h3>
              <p className="text-[14px] text-[#464555]">Input student details and their feedback manually.</p>
            </div>
            <TestimonialForm
              key={editing?.id ?? "new"}
              initial={editing ?? undefined}
              onSave={async (d) => { await createMut.mutateAsync(d as Omit<FirestoreTestimonial, "id">); setEditing(null); }}
              onUpdate={async (id, d) => { await updateMut.mutateAsync({ id, data: d }); setEditing(null); }}
              onCancel={() => setEditing(null)}
            />
          </div>

          {/* Current Impact card */}
          <div className="bg-[#3525cd] text-white rounded-xl p-8 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-semibold text-[#dad7ff] mb-2">Current Impact</h4>
              <div className="text-[36px] font-bold leading-[44px] tracking-tight mb-2">4.9 / 5</div>
              <p className="text-[14px] opacity-80">Average student satisfaction rating from published testimonials.</p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#4f46e5] rounded-full opacity-20" />
            <div className="absolute right-4 top-4 opacity-30">
              <Icon name="star" className="text-4xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Seed / Database Management ───────────────────────────────────────────────

function SeedTab() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function append(msg: string) { setLog((prev) => [...prev, msg]); }

  async function runSeed() {
    setRunning(true); setLog([]);
    try {
      append("[INFO] Initializing connection to Firestore...");
      for (const [name, bio] of Object.entries(instructorBios)) {
        await createInstructor(nameToSlug(name), { name, ...bio });
        append(`[INFO] Instructor: ${name}`);
      }
      append("[INFO] Writing bootcamp collection...");
      for (const b of mockBootcamps) {
        let imageUrl = b.image;
        try {
          const res = await fetch(b.image);
          const blob = await res.blob();
          imageUrl = await uploadImage(new File([blob], `${b.id}.webp`, { type: blob.type }), `bootcamps/${b.id}/cover.webp`);
        } catch { append(`[WARN] Image upload failed for ${b.title}`); }
        await createBootcamp(b.id, { title: b.title, sector: b.sector, tagline: b.tagline, description: b.description, fullDescription: b.fullDescription, hours: b.hours, priceLow: b.priceLow, seats: b.seats, image: imageUrl, instructor: b.instructor, outcomes: b.outcomes, syllabus: b.syllabus, level: b.level, reviewCount: b.reviewCount, enrolledCount: b.enrolledCount });
        append(`[INFO] Bootcamp: ${b.title}`);
      }
      append("[INFO] Writing course collection...");
      for (const c of mockCourses) {
        let imageUrl = c.image;
        try {
          const res = await fetch(c.image);
          const blob = await res.blob();
          imageUrl = await uploadImage(new File([blob], `${c.id}.webp`, { type: blob.type }), `courses/${c.id}/cover.webp`);
        } catch { append(`[WARN] Image upload failed for ${c.title}`); }
        await createCourse(c.id, { title: c.title, category: c.category, tagline: c.tagline, description: c.description, fullDescription: c.fullDescription, hours: c.hours, weeks: c.weeks, priceLow: c.priceLow, image: imageUrl, instructor: c.instructor, outcomes: c.outcomes, syllabus: c.syllabus, level: c.level, reviewCount: c.reviewCount, enrolledCount: c.enrolledCount });
        append(`[INFO] Course: ${c.title}`);
      }
      append("[INFO] Batch write successful. All documents created.");
      append("✓ SEEDING COMPLETE.");
      setDone(true);
    } catch (err) {
      append(`[ERROR] ${String(err)}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[36px] leading-[44px] font-bold text-[#3525cd] tracking-tight">Database Management</h2>
        <p className="text-[16px] text-[#464555]">Control the foundational data architecture and synchronization tasks.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Population Utility */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white border border-[#c7c4d8] p-8 rounded-xl shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[20px] font-semibold text-[#1b1b24] mb-1">Population Utility</h3>
                <p className="text-[14px] text-[#464555]">Execute a fresh migration of development environment data.</p>
              </div>
              <div className="p-2 bg-[#ffdbcc] rounded-lg">
                <Icon name="database" className="text-[#351000]" />
              </div>
            </div>

            <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 p-4 rounded-lg mb-8">
              <div className="flex gap-2">
                <Icon name="warning" className="text-[#ba1a1a] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#93000a] text-[14px] font-bold">This will migrate all mock data into Firestore.</p>
                  <p className="text-[#93000a] text-[14px] opacity-80">Existing items will be overwritten. This action is safe to re-run, but destructive to manual changes.</p>
                </div>
              </div>
            </div>

            <button
              onClick={runSeed}
              disabled={running || done}
              className="w-full bg-[#3525cd] text-white py-6 rounded-xl text-[20px] font-semibold flex items-center justify-center gap-4 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-[#3525cd]/20 disabled:opacity-60"
            >
              <Icon name={done ? "check_circle" : running ? "progress_activity" : "rocket_launch"} className={running ? "animate-spin" : ""} />
              {done ? "Seeding Complete" : running ? "Seeding…" : "Seed Database Now"}
            </button>
          </div>
        </div>

        {/* Migration Manifest */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-[#f0ecf9] border border-[#c7c4d8] p-8 rounded-xl h-full">
            <h3 className="text-xs font-semibold text-[#505f76] mb-6 uppercase tracking-wider">Migration Manifest</h3>
            <ul className="space-y-4">
              {[
                { icon: "school", label: "12 Bootcamps" },
                { icon: "menu_book", label: "12 Courses" },
                { icon: "person", label: "12 Instructors" },
                { icon: "format_quote", label: "Mock Testimonials" },
              ].map(({ icon, label }) => (
                <li key={label} className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#c7c4d8]/50">
                  <div className="flex items-center gap-2">
                    <Icon name={icon} className="text-[#3525cd]" />
                    <span className="text-[14px]">{label}</span>
                  </div>
                  <Icon name="check_circle" className="text-[#464555] text-sm" />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Global Data Ordering */}
        <div className="col-span-12">
          <div className="bg-white border border-[#c7c4d8] p-8 rounded-xl">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="tune" className="text-[#3525cd]" />
              <h3 className="text-[20px] font-semibold text-[#1b1b24]">Global Data Ordering</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[14px] font-medium text-[#464555] mb-2">Bootcamp Sorting</label>
                <select aria-label="Bootcamp sorting" className="w-full bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg p-4 text-[14px] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none">
                  <option>Sort bootcamps by price high-to-low</option>
                  <option>Sort bootcamps by price low-to-high</option>
                  <option>Sort bootcamps by rating</option>
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#464555] mb-2">Course Sorting</label>
                <select aria-label="Course sorting" className="w-full bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg p-4 text-[14px] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none">
                  <option>Sort courses by date created</option>
                  <option>Sort courses alphabetically</option>
                  <option>Sort courses by popularity</option>
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#464555] mb-2">Instructor Listing</label>
                <select aria-label="Instructor listing order" className="w-full bg-[#fcf8ff] border border-[#c7c4d8] rounded-lg p-4 text-[14px] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] outline-none">
                  <option>Group by department</option>
                  <option>Sort by years of experience</option>
                  <option>Sort by student count</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Migration Console */}
        <div className="col-span-12">
          <div className="bg-[#302f39] text-[#f3effc] p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ba1a1a]" />
                <span className="w-3 h-3 rounded-full bg-[#ffdbcc]" />
                <span className="w-3 h-3 rounded-full bg-[#e2dfff]" />
                <span className="ml-4 text-xs font-semibold opacity-50 uppercase tracking-tighter">Migration Console</span>
              </div>
              <button className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <Icon name="content_copy" className="text-[18px]" />
              </button>
            </div>
            <div className="font-mono text-sm space-y-2 max-h-64 overflow-y-auto">
              {log.length === 0 ? (
                <p className="opacity-40">Awaiting seed command...</p>
              ) : (
                log.map((line, i) => (
                  <p key={i} className={`flex gap-4 ${line.startsWith("✓") ? "text-emerald-400 font-bold" : line.startsWith("[WARN]") ? "text-[#ffb695]" : line.startsWith("[ERROR]") ? "text-[#ffdad6]" : "opacity-80"}`}>
                    {line}
                  </p>
                ))
              )}
              {running && <div className="animate-pulse bg-white/40 h-4 w-2" />}
            </div>
          </div>
        </div>

        {/* Visual status cards */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative overflow-hidden h-48 rounded-xl group border border-[#c7c4d8] bg-[#302f39]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#fcf8ff] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-xs font-semibold text-[#3525cd] uppercase">Storage Health</span>
              <h4 className="text-[20px] font-semibold text-[#1b1b24]">99.9% Uptime</h4>
            </div>
          </div>
          <div className="relative overflow-hidden h-48 rounded-xl group border border-[#c7c4d8] bg-[#302f39]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#fcf8ff] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-xs font-semibold text-[#3525cd] uppercase">Sync Frequency</span>
              <h4 className="text-[20px] font-semibold text-[#1b1b24]">Real-time DB Active</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

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

// ─── Learning Paths ───────────────────────────────────────────────────────────

function PathsTab() {
  const { data = [], isLoading } = usePaths();
  const createMut = useCreatePath();
  const updateMut = useUpdatePath();
  const deleteMut = useDeletePath();
  const [editing, setEditing] = useState<(FirestorePath & { id: string }) | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  if (isLoading) return <Spinner />;

  const totalPages = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const pageData = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[24px] leading-8 font-semibold text-[#1b1b24] tracking-tight">Learning Paths</h2>
          <p className="text-[14px] text-[#464555] mt-1">Manage the four learning paths shown on the homepage.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="bg-[#3525cd] text-white px-6 py-2 rounded-lg text-[14px] font-medium flex items-center gap-2 shadow-sm hover:bg-[#4f46e5] active:scale-95 transition-all"
        >
          <Icon name="add" />
          Add New Path
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-[#fcf8ff] rounded-xl overflow-hidden shadow-sm border border-[#c7c4d8]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f2ff]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Slug</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Format</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase text-right">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase text-center">Published</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c7c4d8]">
                {pageData.map((path) => (
                  <tr key={path.id} className="hover:bg-[#eae6f4] transition-colors group">
                    <td className="px-4 py-3 text-[12px] font-mono text-[#464555]">{path.slug || path.id}</td>
                    <td className="px-4 py-3 text-[14px] font-semibold text-[#1b1b24]">{path.name}</td>
                    <td className="px-4 py-3">
                      <span className="bg-[#d0e1fb] text-[#54647a] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">{path.format}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[14px] text-[#464555]">
                      {path.price > 0 ? `₹${path.price.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${path.published ? "bg-emerald-100 text-emerald-700" : "bg-[#f0ecf9] text-[#777587]"}`}>
                        {path.published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button aria-label={`Edit ${path.name}`} onClick={() => setEditing(path)} className="p-1 hover:bg-[#3525cd]/10 text-[#3525cd] rounded-lg transition-colors">
                          <Icon name="edit" />
                        </button>
                        <button aria-label={`Delete ${path.name}`} onClick={() => { if (confirm(`Delete "${path.name}"?`)) deleteMut.mutate(path.id); }} className="p-1 hover:bg-[#ffdad6]/40 text-[#ba1a1a] rounded-lg transition-colors">
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[14px] text-[#777587]">
                      No learning paths yet — add the first one →
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {data.length > PER_PAGE && (
              <div className="px-4 py-3 bg-[#f5f2ff] border-t border-[#c7c4d8] flex justify-between items-center">
                <p className="text-[14px] text-[#464555]">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, data.length)} of {data.length}
                </p>
                <div className="flex gap-1">
                  <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded border border-[#c7c4d8] hover:bg-[#e4e1ee] disabled:opacity-50">
                    <Icon name="chevron_left" className="text-[18px]" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                    <button type="button" key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded text-xs font-semibold ${n === page ? "bg-[#3525cd] text-white" : "hover:bg-[#e4e1ee]"}`}>{n}</button>
                  ))}
                  <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded border border-[#c7c4d8] hover:bg-[#e4e1ee] disabled:opacity-50">
                    <Icon name="chevron_right" className="text-[18px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky form */}
        <div className="col-span-12 lg:col-span-4">
          <section className="bg-white rounded-xl shadow-lg border border-[#c7c4d8] overflow-hidden sticky top-24">
            <div className="bg-[#3525cd] px-6 py-4">
              <h3 className="text-[20px] font-semibold text-white">{editing ? "Edit Path" : "Add New Path"}</h3>
              <p className="text-xs text-[#dad7ff]/80 uppercase tracking-widest font-bold">{editing ? "Editing Entry" : "New Entry Form"}</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <PathForm
                key={editing?.id ?? "new"}
                initial={editing ?? undefined}
                onSave={async (id, d) => {
                  if (editing) await updateMut.mutateAsync({ id, data: d });
                  else await createMut.mutateAsync({ id, data: d });
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Learning Units ───────────────────────────────────────────────────────────

function UnitsTab() {
  const { data: units = [], isLoading } = useUnits();
  const { data: paths = [] } = usePaths();
  const createMut = useCreateUnit();
  const updateMut = useUpdateUnit();
  const deleteMut = useDeleteUnit();
  const [editing, setEditing] = useState<(FirestoreUnit & { id: string }) | null>(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  if (isLoading) return <Spinner />;

  const totalPages = Math.max(1, Math.ceil(units.length / PER_PAGE));
  const pageData = units.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[24px] leading-8 font-semibold text-[#1b1b24] tracking-tight">Learning Units</h2>
          <p className="text-[14px] text-[#464555] mt-1">Manage the modular learning units used across paths and the Build-Your-Own bundle.</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(null)}
          className="bg-[#3525cd] text-white px-6 py-2 rounded-lg text-[14px] font-medium flex items-center gap-2 shadow-sm hover:bg-[#4f46e5] active:scale-95 transition-all"
        >
          <Icon name="add" />
          Add New Unit
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Table */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-[#fcf8ff] rounded-xl overflow-hidden shadow-sm border border-[#c7c4d8]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f5f2ff]">
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Slug</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase">Paths</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase text-right">À la carte</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c7c4d8]">
                {pageData.map((unit) => (
                  <tr key={unit.id} className="hover:bg-[#eae6f4] transition-colors group">
                    <td className="px-4 py-3 text-[12px] font-mono text-[#464555]">{unit.slug || unit.id}</td>
                    <td className="px-4 py-3 text-[14px] font-semibold text-[#1b1b24]">{unit.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(unit.paths ?? []).map((p) => (
                          <span key={p} className="bg-[#d0e1fb] text-[#54647a] px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-[14px] text-[#464555]">
                      {unit.priceAlaCart > 0 ? `₹${unit.priceAlaCart.toLocaleString("en-IN")}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" aria-label={`Edit ${unit.name}`} onClick={() => setEditing(unit)} className="p-1 hover:bg-[#3525cd]/10 text-[#3525cd] rounded-lg transition-colors">
                          <Icon name="edit" />
                        </button>
                        <button type="button" aria-label={`Delete ${unit.name}`} onClick={() => { if (confirm(`Delete "${unit.name}"?`)) deleteMut.mutate(unit.id); }} className="p-1 hover:bg-[#ffdad6]/40 text-[#ba1a1a] rounded-lg transition-colors">
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {units.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-[14px] text-[#777587]">
                      No units yet — add the first one →
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {units.length > PER_PAGE && (
              <div className="px-4 py-3 bg-[#f5f2ff] border-t border-[#c7c4d8] flex justify-between items-center">
                <p className="text-[14px] text-[#464555]">
                  Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, units.length)} of {units.length}
                </p>
                <div className="flex gap-1">
                  <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded border border-[#c7c4d8] hover:bg-[#e4e1ee] disabled:opacity-50">
                    <Icon name="chevron_left" className="text-[18px]" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                    <button type="button" key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded text-xs font-semibold ${n === page ? "bg-[#3525cd] text-white" : "hover:bg-[#e4e1ee]"}`}>{n}</button>
                  ))}
                  <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded border border-[#c7c4d8] hover:bg-[#e4e1ee] disabled:opacity-50">
                    <Icon name="chevron_right" className="text-[18px]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky form */}
        <div className="col-span-12 lg:col-span-4">
          <section className="bg-white rounded-xl shadow-lg border border-[#c7c4d8] overflow-hidden sticky top-24">
            <div className="bg-[#3525cd] px-6 py-4">
              <h3 className="text-[20px] font-semibold text-white">{editing ? "Edit Unit" : "Add New Unit"}</h3>
              <p className="text-xs text-[#dad7ff]/80 uppercase tracking-widest font-bold">{editing ? "Editing Entry" : "New Entry Form"}</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              <UnitForm
                key={editing?.id ?? "new"}
                initial={editing ?? undefined}
                paths={paths}
                onSave={async (id, d) => {
                  if (editing) await updateMut.mutateAsync({ id, data: d });
                  else await createMut.mutateAsync({ id, data: d });
                  setEditing(null);
                }}
                onCancel={() => setEditing(null)}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <Icon name="progress_activity" className="animate-spin text-[#3525cd] text-[32px]" />
    </div>
  );
}
