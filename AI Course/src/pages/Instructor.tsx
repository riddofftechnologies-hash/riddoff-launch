import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useInstructorCohorts } from "@/hooks/useCohorts";
import { useSessionsByCohort, useCreateSession, useUpdateSession, useDeleteSession } from "@/hooks/useSessions";
import { useAssignmentsByCohort, useCreateAssignment, useUpdateAssignment, useDeleteAssignment } from "@/hooks/useAssignments";
import { useSubmissionsByAssignment, useGradeSubmission } from "@/hooks/useSubmissions";
import { useEnrollmentsByCohort } from "@/hooks/useEnrollments";
import type {
  FirestoreCohort,
  FirestoreSession,
  FirestoreAssignment,
  FirestoreSubmission,
  FirestoreEnrollment,
} from "@/types/firestore";
import type { Timestamp } from "firebase/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "cohorts" | "sessions" | "assignments" | "grading" | "students";

type CohortDoc = FirestoreCohort & { id: string };
type SessionDoc = FirestoreSession & { id: string };
type AssignmentDoc = FirestoreAssignment & { id: string };
type SubmissionDoc = FirestoreSubmission & { id: string };
type EnrollmentDoc = FirestoreEnrollment & { id: string };

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: "overview",    label: "Overview",    icon: "dashboard"   },
  { id: "cohorts",     label: "My Cohorts",  icon: "groups"      },
  { id: "sessions",    label: "Sessions",    icon: "event_note"  },
  { id: "assignments", label: "Assignments", icon: "assignment"  },
  { id: "grading",     label: "Grading",     icon: "grading"     },
  { id: "students",    label: "Students",    icon: "people"      },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Icon name="progress_activity" className="animate-spin text-[#3525cd] text-[32px]" />
    </div>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-[#777587]">
      <Icon name={icon} className="text-[48px] mb-3 opacity-30" />
      <p className="text-[14px]">{message}</p>
    </div>
  );
}

function fmtDate(ts: Timestamp | string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!ts) return "—";
  const d =
    typeof ts === "string"
      ? new Date(ts)
      : typeof (ts as Timestamp).toDate === "function"
      ? (ts as Timestamp).toDate()
      : new Date(ts as unknown as string);
  return d.toLocaleDateString("en-IN", opts ?? { day: "numeric", month: "short", year: "numeric" });
}

function fmtDateTime(ts: Timestamp | string | null | undefined): string {
  if (!ts) return "—";
  const d =
    typeof ts === "string"
      ? new Date(ts)
      : typeof (ts as Timestamp).toDate === "function"
      ? (ts as Timestamp).toDate()
      : new Date(ts as unknown as string);
  return d.toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function CohortStatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    running:   "bg-emerald-100 text-emerald-800",
    enrolling: "bg-[#d0e1fb] text-[#54647a]",
    upcoming:  "bg-[#ffdbcc] text-[#351000]",
    completed: "bg-[#f0ecf9] text-[#777587]",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${map[status ?? ""] ?? "bg-[#f0ecf9] text-[#464555]"}`}>
      {status ?? "unknown"}
    </span>
  );
}

const inp = "w-full border border-[#e0e0e0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#3525cd] bg-white";
const label = "block text-xs font-semibold text-[#777587] uppercase tracking-wider mb-1";
const btn = "px-5 py-2 bg-[#3525cd] text-white text-sm font-semibold rounded-lg hover:bg-[#4f46e5] disabled:opacity-60 transition-colors";
const btnGhost = "px-5 py-2 border border-[#e0e0e0] text-sm rounded-lg hover:bg-[#f5f2ff] transition-colors";

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Instructor() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <InstructorShell
      uid={user.uid}
      email={user.email ?? ""}
      displayName={user.displayName ?? ""}
      onLogout={signOut}
    />
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

function InstructorShell({
  uid, email, displayName, onLogout,
}: {
  uid: string; email: string; displayName: string; onLogout: () => void;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [activeCohortId, setActiveCohortId] = useState<string | null>(null);
  const { data: cohorts = [], isLoading } = useInstructorCohorts(uid);
  const initials = (displayName || email).slice(0, 2).toUpperCase();

  function goToCohort(cohortId: string, nextTab: Tab) {
    setActiveCohortId(cohortId);
    setTab(nextTab);
  }

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b24] font-inter">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[256px] bg-[#fcf8ff] border-r border-[#c7c4d8] shadow-sm flex flex-col py-8 z-50">
        <div className="px-8 mb-8">
          <h1 className="text-[18px] font-bold text-[#3525cd] leading-tight">Instructor Portal</h1>
          <p className="text-[12px] text-[#464555] mt-0.5">Riddoff Course Platform</p>
        </div>

        <nav className="flex-1 space-y-[3px] px-4">
          {NAV.map(({ id, label: navLabel, icon }) => {
            const isActive = id === tab;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-[14px] rounded-lg transition-all active:scale-[0.98] text-left border-l-4 ${
                  isActive
                    ? "bg-[#3525cd]/10 border-[#3525cd] text-[#3525cd] font-semibold"
                    : "text-[#505f76] hover:bg-[#eae6f4] border-transparent"
                }`}
              >
                <Icon name={icon} className="text-[20px]" />
                <span>{navLabel}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pt-4 border-t border-[#c7c4d8]">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd] text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#1b1b24] truncate">{displayName || "Instructor"}</p>
              <p className="text-[11px] text-[#464555] truncate">{email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-[13px] text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-lg transition-colors"
          >
            <Icon name="logout" className="text-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="pl-[256px] min-h-screen">
        <div className="p-8 max-w-6xl">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {tab === "overview"    && <OverviewTab cohorts={cohorts} uid={uid} onGoToCohort={goToCohort} />}
              {tab === "cohorts"     && <CohortsTab cohorts={cohorts} onSelectCohort={(id) => goToCohort(id, "sessions")} />}
              {tab === "sessions"    && <SessionsTab cohorts={cohorts} activeCohortId={activeCohortId} onSetCohort={setActiveCohortId} uid={uid} />}
              {tab === "assignments" && <AssignmentsTab cohorts={cohorts} activeCohortId={activeCohortId} onSetCohort={setActiveCohortId} uid={uid} />}
              {tab === "grading"     && <GradingTab cohorts={cohorts} uid={uid} />}
              {tab === "students"    && <StudentsTab cohorts={cohorts} activeCohortId={activeCohortId} onSetCohort={setActiveCohortId} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Cohort Picker ────────────────────────────────────────────────────────────

function CohortPicker({
  cohorts,
  value,
  onChange,
}: {
  cohorts: CohortDoc[];
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Icon name="groups" className="text-[#3525cd] text-[20px]" />
      <select
        aria-label="Select cohort"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="border border-[#c7c4d8] rounded-lg px-4 py-2 text-[14px] bg-white focus:outline-none focus:border-[#3525cd]"
      >
        <option value="" disabled>Select a cohort…</option>
        {cohorts.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  cohorts, uid, onGoToCohort,
}: {
  cohorts: CohortDoc[];
  uid: string;
  onGoToCohort: (id: string, tab: Tab) => void;
}) {
  const active    = cohorts.filter((c) => c.status === "running");
  const upcoming  = cohorts.filter((c) => c.status === "upcoming" || c.status === "enrolling");
  const completed = cohorts.filter((c) => c.status === "completed");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[32px] font-bold text-[#1b1b24] tracking-tight">Dashboard</h2>
        <p className="text-[15px] text-[#464555] mt-1">Welcome back. Here's a snapshot of your cohorts.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {[
          { label: "Running",   value: active.length,    icon: "rocket_launch", color: "bg-emerald-100 text-emerald-700" },
          { label: "Upcoming",  value: upcoming.length,  icon: "schedule",      color: "bg-[#d0e1fb] text-[#54647a]" },
          { label: "Completed", value: completed.length, icon: "verified",      color: "bg-[#f0ecf9] text-[#777587]" },
        ].map(({ label: lbl, value, icon, color }) => (
          <div key={lbl} className="bg-white rounded-xl border border-[#c7c4d8] p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[12px] font-semibold text-[#464555] uppercase tracking-wider">{lbl}</p>
                <h3 className="text-[40px] font-bold text-[#1b1b24] mt-1 tracking-tight">{value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon name={icon} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cohort list */}
      {cohorts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#c7c4d8] p-12 text-center">
          <Icon name="groups" className="text-[48px] text-[#c7c4d8] mb-3" />
          <p className="text-[15px] font-semibold text-[#1b1b24]">No cohorts assigned yet</p>
          <p className="text-[13px] text-[#464555] mt-1">An admin will assign you to a cohort. Check back soon.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#c7c4d8] bg-[#f5f2ff]">
            <h3 className="text-[16px] font-semibold text-[#1b1b24]">Your Cohorts</h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcf8ff] border-b border-[#c7c4d8]">
                {["Cohort", "Status", "Dates", "Capacity", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]">
              {cohorts.map((c) => (
                <tr key={c.id} className="hover:bg-[#f5f2ff]/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-semibold text-[#1b1b24]">{c.name}</p>
                    <p className="text-[12px] text-[#464555]">{c.courseId}</p>
                  </td>
                  <td className="px-6 py-4"><CohortStatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 text-[13px] text-[#464555]">
                    {fmtDate(c.startDate)} – {fmtDate(c.endDate)}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#464555]">
                    {c.capacity - (c.seatsRemaining ?? 0)} / {c.capacity}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onGoToCohort(c.id, "sessions")}
                      className="text-[13px] text-[#3525cd] font-medium hover:underline flex items-center gap-1"
                    >
                      Manage <Icon name="arrow_forward" className="text-[16px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Cohorts Tab ──────────────────────────────────────────────────────────────

function CohortsTab({
  cohorts, onSelectCohort,
}: {
  cohorts: CohortDoc[];
  onSelectCohort: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-[#1b1b24] tracking-tight">My Cohorts</h2>
        <p className="text-[14px] text-[#464555] mt-1">All cohorts you are assigned to as primary or co-instructor.</p>
      </div>

      {cohorts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#c7c4d8]">
          <EmptyState icon="groups" message="No cohorts assigned to you yet." />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f5f2ff]">
                {["Cohort name", "Course ID", "Status", "Dates", "Seats", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]">
              {cohorts.map((c) => (
                <tr key={c.id} className="hover:bg-[#f5f2ff]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-[14px] font-semibold text-[#1b1b24]">{c.name}</p>
                    {c.zoomRecurringLink && (
                      <a href={c.zoomRecurringLink} target="_blank" rel="noreferrer"
                        className="text-[11px] text-[#3525cd] hover:underline flex items-center gap-0.5 mt-0.5">
                        <Icon name="videocam" className="text-[14px]" /> Zoom link
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-mono text-[#464555]">{c.courseId}</td>
                  <td className="px-6 py-4"><CohortStatusBadge status={c.status} /></td>
                  <td className="px-6 py-4 text-[13px] text-[#464555]">
                    {fmtDate(c.startDate)} → {fmtDate(c.endDate)}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#464555]">
                    <span className="font-semibold text-[#1b1b24]">{c.capacity - (c.seatsRemaining ?? 0)}</span> / {c.capacity}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onSelectCohort(c.id)}
                        className="text-[12px] font-semibold text-[#3525cd] bg-[#3525cd]/10 px-3 py-1 rounded-lg hover:bg-[#3525cd]/20 transition-colors flex items-center gap-1"
                      >
                        <Icon name="open_in_new" className="text-[14px]" /> Open
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Sessions Tab ─────────────────────────────────────────────────────────────

function SessionsTab({
  cohorts, activeCohortId, onSetCohort, uid,
}: {
  cohorts: CohortDoc[];
  activeCohortId: string | null;
  onSetCohort: (id: string) => void;
  uid: string;
}) {
  const cohortId = activeCohortId ?? cohorts[0]?.id ?? null;
  const activeCohort = cohorts.find((c) => c.id === cohortId) ?? null;
  const { data: sessions = [], isLoading } = useSessionsByCohort(cohortId);
  const createMut = useCreateSession();
  const updateMut = useUpdateSession();
  const deleteMut = useDeleteSession();

  const [form, setForm] = useState({ topic: "", weekNumber: 1, scheduledAt: "", zoomLink: "" });
  const [saving, setSaving] = useState(false);
  const [recordingEdit, setRecordingEdit] = useState<{ id: string; url: string } | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!cohortId || !activeCohort) return;
    setSaving(true);
    try {
      await createMut.mutateAsync({
        cohortId,
        courseId: activeCohort.courseId,
        instructorId: uid,
        weekNumber: Number(form.weekNumber),
        topic: form.topic,
        scheduledAt: form.scheduledAt as unknown as import("firebase/firestore").Timestamp,
        zoomLink: form.zoomLink,
      });
      setForm({ topic: "", weekNumber: 1, scheduledAt: "", zoomLink: "" });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveRecording() {
    if (!recordingEdit || !cohortId) return;
    await updateMut.mutateAsync({
      id: recordingEdit.id,
      cohortId,
      data: { recordingUrl: recordingEdit.url },
    });
    setRecordingEdit(null);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-[#1b1b24] tracking-tight">Sessions</h2>
        <p className="text-[14px] text-[#464555] mt-1">Schedule live sessions and post recording links after class.</p>
      </div>

      <CohortPicker cohorts={cohorts} value={cohortId} onChange={onSetCohort} />

      {!cohortId ? (
        <EmptyState icon="event_note" message="Select a cohort to see sessions." />
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Sessions table */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#c7c4d8] bg-[#f5f2ff]">
                <h3 className="text-[15px] font-semibold text-[#1b1b24]">
                  {activeCohort?.name} — {sessions.length} session{sessions.length !== 1 ? "s" : ""}
                </h3>
              </div>
              {isLoading ? <Spinner /> : sessions.length === 0 ? (
                <EmptyState icon="event_note" message="No sessions yet — add the first one." />
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#fcf8ff] border-b border-[#c7c4d8]">
                      {["Wk", "Topic", "Date & Time", "Zoom", "Recording", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]">
                    {sessions.map((s) => (
                      <tr key={s.id} className="hover:bg-[#f5f2ff]/50 transition-colors group">
                        <td className="px-4 py-3 text-[13px] font-mono text-[#777587]">W{s.weekNumber}</td>
                        <td className="px-4 py-3 text-[14px] font-semibold text-[#1b1b24]">{s.topic}</td>
                        <td className="px-4 py-3 text-[13px] text-[#464555] whitespace-nowrap">{fmtDateTime(s.scheduledAt)}</td>
                        <td className="px-4 py-3">
                          {s.zoomLink ? (
                            <a href={s.zoomLink} target="_blank" rel="noreferrer"
                              className="text-[12px] text-[#3525cd] hover:underline flex items-center gap-0.5">
                              <Icon name="videocam" className="text-[15px]" /> Join
                            </a>
                          ) : <span className="text-[12px] text-[#777587]">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {recordingEdit?.id === s.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="url"
                                value={recordingEdit.url}
                                onChange={(e) => setRecordingEdit({ id: s.id, url: e.target.value })}
                                className="border border-[#c7c4d8] rounded px-2 py-1 text-[12px] w-40 focus:outline-none focus:border-[#3525cd]"
                                placeholder="https://…"
                              />
                              <button onClick={handleSaveRecording} className="text-[12px] text-[#3525cd] font-semibold hover:underline">Save</button>
                              <button onClick={() => setRecordingEdit(null)} className="text-[12px] text-[#777587] hover:underline">Cancel</button>
                            </div>
                          ) : s.recordingUrl ? (
                            <div className="flex items-center gap-2">
                              <a href={s.recordingUrl} target="_blank" rel="noreferrer"
                                className="text-[12px] text-[#3525cd] hover:underline flex items-center gap-0.5">
                                <Icon name="play_circle" className="text-[15px]" /> Watch
                              </a>
                              <button onClick={() => setRecordingEdit({ id: s.id, url: s.recordingUrl ?? "" })}
                                className="text-[11px] text-[#777587] hover:text-[#3525cd]">edit</button>
                            </div>
                          ) : (
                            <button onClick={() => setRecordingEdit({ id: s.id, url: "" })}
                              className="text-[12px] text-[#464555] hover:text-[#3525cd] flex items-center gap-0.5">
                              <Icon name="add" className="text-[14px]" /> Add recording
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            aria-label={`Delete session ${s.topic}`}
                            onClick={() => { if (confirm(`Delete "${s.topic}"?`)) deleteMut.mutate({ id: s.id, cohortId: cohortId! }); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#ffdad6]/40 text-[#ba1a1a] rounded transition-all"
                          >
                            <Icon name="delete" className="text-[18px]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Add session form */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-xl border border-[#c7c4d8] shadow-sm overflow-hidden sticky top-6">
              <div className="bg-[#3525cd] px-6 py-4">
                <h3 className="text-[16px] font-semibold text-white">Schedule Session</h3>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                <label className="block">
                  <span className={label}>Week #</span>
                  <input type="number" min={1} value={form.weekNumber}
                    onChange={(e) => setForm((f) => ({ ...f, weekNumber: Number(e.target.value) }))}
                    className={inp} required />
                </label>
                <label className="block">
                  <span className={label}>Topic *</span>
                  <input value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    className={inp} placeholder="Intro to LLMs" required />
                </label>
                <label className="block">
                  <span className={label}>Date & Time *</span>
                  <input type="datetime-local" value={form.scheduledAt}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                    className={inp} required />
                </label>
                <label className="block">
                  <span className={label}>Zoom Link</span>
                  <input type="url" value={form.zoomLink}
                    onChange={(e) => setForm((f) => ({ ...f, zoomLink: e.target.value }))}
                    className={inp} placeholder="https://zoom.us/j/…" />
                </label>
                <button type="submit" disabled={saving} className={`${btn} w-full`}>
                  {saving ? "Scheduling…" : "Add Session"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Assignments Tab ──────────────────────────────────────────────────────────

function AssignmentsTab({
  cohorts, activeCohortId, onSetCohort, uid,
}: {
  cohorts: CohortDoc[];
  activeCohortId: string | null;
  onSetCohort: (id: string) => void;
  uid: string;
}) {
  const cohortId = activeCohortId ?? cohorts[0]?.id ?? null;
  const activeCohort = cohorts.find((c) => c.id === cohortId) ?? null;
  const { data: assignments = [], isLoading } = useAssignmentsByCohort(cohortId);
  const createMut = useCreateAssignment();
  const updateMut = useUpdateAssignment();
  const deleteMut = useDeleteAssignment();

  const [form, setForm] = useState({ title: "", description: "", dueDate: "", maxScore: 100, published: false });
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!cohortId || !activeCohort) return;
    setSaving(true);
    try {
      await createMut.mutateAsync({
        cohortId,
        courseId: activeCohort.courseId,
        title: form.title,
        description: form.description,
        dueDate: form.dueDate as unknown as import("firebase/firestore").Timestamp,
        maxScore: Number(form.maxScore),
        published: form.published,
        createdBy: uid,
        createdAt: new Date().toISOString() as unknown as import("firebase/firestore").Timestamp,
      });
      setForm({ title: "", description: "", dueDate: "", maxScore: 100, published: false });
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(a: AssignmentDoc) {
    await updateMut.mutateAsync({ id: a.id, cohortId: a.cohortId, data: { published: !a.published } });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-[#1b1b24] tracking-tight">Assignments</h2>
        <p className="text-[14px] text-[#464555] mt-1">Create and publish assignments for your cohort.</p>
      </div>

      <CohortPicker cohorts={cohorts} value={cohortId} onChange={onSetCohort} />

      {!cohortId ? (
        <EmptyState icon="assignment" message="Select a cohort to manage assignments." />
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Assignments table */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#c7c4d8] bg-[#f5f2ff]">
                <h3 className="text-[15px] font-semibold text-[#1b1b24]">
                  {activeCohort?.name} — {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
                </h3>
              </div>
              {isLoading ? <Spinner /> : assignments.length === 0 ? (
                <EmptyState icon="assignment" message="No assignments yet — create the first one." />
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#fcf8ff] border-b border-[#c7c4d8]">
                      {["Title", "Due Date", "Max Score", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c7c4d8]">
                    {assignments.map((a) => (
                      <tr key={a.id} className="hover:bg-[#f5f2ff]/50 transition-colors group">
                        <td className="px-5 py-4">
                          <p className="text-[14px] font-semibold text-[#1b1b24]">{a.title}</p>
                          {a.description && (
                            <p className="text-[12px] text-[#464555] line-clamp-1 mt-0.5">{a.description}</p>
                          )}
                        </td>
                        <td className="px-5 py-4 text-[13px] text-[#464555]">{fmtDate(a.dueDate)}</td>
                        <td className="px-5 py-4 text-[13px] text-[#464555]">{a.maxScore} pts</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => togglePublish(a)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                              a.published
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-[#f0ecf9] text-[#777587] hover:bg-[#eae6f4]"
                            }`}
                          >
                            {a.published ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => { if (confirm(`Delete "${a.title}"?`)) deleteMut.mutate({ id: a.id, cohortId: cohortId! }); }}
                              className="p-1 hover:bg-[#ffdad6]/40 text-[#ba1a1a] rounded transition-colors"
                            >
                              <Icon name="delete" className="text-[18px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Create assignment form */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-xl border border-[#c7c4d8] shadow-sm overflow-hidden sticky top-6">
              <div className="bg-[#3525cd] px-6 py-4">
                <h3 className="text-[16px] font-semibold text-white">New Assignment</h3>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <label className="block">
                  <span className={label}>Title *</span>
                  <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className={inp} placeholder="Week 3 Project" required />
                </label>
                <label className="block">
                  <span className={label}>Description</span>
                  <textarea rows={3} value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className={inp} placeholder="What students should submit…" />
                </label>
                <label className="block">
                  <span className={label}>Due Date *</span>
                  <input type="datetime-local" value={form.dueDate}
                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                    className={inp} required />
                </label>
                <label className="block">
                  <span className={label}>Max Score</span>
                  <input type="number" min={1} max={1000} value={form.maxScore}
                    onChange={(e) => setForm((f) => ({ ...f, maxScore: Number(e.target.value) }))}
                    className={inp} />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published}
                    onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                    className="w-4 h-4 accent-[#3525cd]" />
                  <span className="text-[13px] text-[#464555]">Publish immediately</span>
                </label>
                <button type="submit" disabled={saving} className={`${btn} w-full`}>
                  {saving ? "Creating…" : "Create Assignment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Grading Tab ──────────────────────────────────────────────────────────────

function GradingTab({ cohorts, uid }: { cohorts: CohortDoc[]; uid: string }) {
  const [selectedCohortId, setSelectedCohortId] = useState<string | null>(cohorts[0]?.id ?? null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const { data: assignments = [] } = useAssignmentsByCohort(selectedCohortId);
  const { data: submissions = [], isLoading } = useSubmissionsByAssignment(selectedAssignmentId);
  const gradeMut = useGradeSubmission();
  const [grading, setGrading] = useState<Record<string, { score: string; feedback: string }>>({});

  const selectedAssignment = assignments.find((a) => a.id === selectedAssignmentId);
  const ungraded = submissions.filter((s) => s.grade == null);
  const graded   = submissions.filter((s) => s.grade != null);

  function getGrade(userId: string) {
    return grading[userId] ?? { score: "", feedback: "" };
  }
  function setGradeField(userId: string, field: "score" | "feedback", val: string) {
    setGrading((g) => ({ ...g, [userId]: { ...getGrade(userId), [field]: val } }));
  }

  async function submitGrade(s: SubmissionDoc) {
    const g = getGrade(s.userId);
    if (g.score === "") return;
    await gradeMut.mutateAsync({
      userId: s.userId,
      assignmentId: s.assignmentId,
      grade: Number(g.score),
      feedback: g.feedback,
      gradedBy: uid,
    });
    setGrading((prev) => { const n = { ...prev }; delete n[s.userId]; return n; });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-[#1b1b24] tracking-tight">Grading</h2>
        <p className="text-[14px] text-[#464555] mt-1">Review student submissions and assign scores.</p>
      </div>

      {/* Selectors row */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Icon name="groups" className="text-[#3525cd] text-[20px]" />
          <select
            aria-label="Select cohort for grading"
            value={selectedCohortId ?? ""}
            onChange={(e) => { setSelectedCohortId(e.target.value); setSelectedAssignmentId(null); }}
            className="border border-[#c7c4d8] rounded-lg px-4 py-2 text-[14px] bg-white focus:outline-none focus:border-[#3525cd]"
          >
            <option value="" disabled>Select cohort…</option>
            {cohorts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="assignment" className="text-[#3525cd] text-[20px]" />
          <select
            aria-label="Select assignment for grading"
            value={selectedAssignmentId ?? ""}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            disabled={assignments.length === 0}
            className="border border-[#c7c4d8] rounded-lg px-4 py-2 text-[14px] bg-white focus:outline-none focus:border-[#3525cd] disabled:opacity-50"
          >
            <option value="" disabled>Select assignment…</option>
            {assignments.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
        </div>
        {selectedAssignment && (
          <span className="text-[12px] text-[#777587]">
            Max score: <strong>{selectedAssignment.maxScore} pts</strong> · Due: {fmtDate(selectedAssignment.dueDate)}
          </span>
        )}
      </div>

      {!selectedAssignmentId ? (
        <EmptyState icon="grading" message="Select a cohort and assignment to start grading." />
      ) : isLoading ? (
        <Spinner />
      ) : submissions.length === 0 ? (
        <EmptyState icon="inbox" message="No submissions yet for this assignment." />
      ) : (
        <div className="space-y-6">
          {/* Ungraded */}
          {ungraded.length > 0 && (
            <div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#c7c4d8] bg-[#fff8e6] flex items-center gap-2">
                <Icon name="pending" className="text-amber-600" />
                <h3 className="text-[15px] font-semibold text-[#1b1b24]">Needs Grading ({ungraded.length})</h3>
              </div>
              <div className="divide-y divide-[#c7c4d8]">
                {ungraded.map((s) => {
                  const g = getGrade(s.userId);
                  return (
                    <div key={s.id} className="p-6">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <p className="text-[14px] font-semibold text-[#1b1b24]">{s.userId}</p>
                          <p className="text-[12px] text-[#464555]">Submitted {fmtDateTime(s.submittedAt)}</p>
                        </div>
                      </div>
                      {s.textAnswer && (
                        <div className="bg-[#f5f2ff] rounded-lg p-4 mb-4 text-[13px] text-[#464555] whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {s.textAnswer}
                        </div>
                      )}
                      {s.fileUrl && (
                        <a href={s.fileUrl} target="_blank" rel="noreferrer"
                          className="text-[13px] text-[#3525cd] hover:underline flex items-center gap-1 mb-4">
                          <Icon name="attach_file" className="text-[16px]" /> View submitted file
                        </a>
                      )}
                      <div className="flex items-end gap-3">
                        <label className="block">
                          <span className={label}>Score (/{selectedAssignment?.maxScore ?? "—"})</span>
                          <input
                            type="number"
                            min={0}
                            max={selectedAssignment?.maxScore ?? 100}
                            value={g.score}
                            onChange={(e) => setGradeField(s.userId, "score", e.target.value)}
                            className="border border-[#c7c4d8] rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-[#3525cd]"
                            placeholder="0"
                          />
                        </label>
                        <label className="block flex-1">
                          <span className={label}>Feedback</span>
                          <input
                            value={g.feedback}
                            onChange={(e) => setGradeField(s.userId, "feedback", e.target.value)}
                            className={inp}
                            placeholder="Great work on…"
                          />
                        </label>
                        <button
                          onClick={() => submitGrade(s)}
                          disabled={g.score === "" || gradeMut.isPending}
                          className={`${btn} whitespace-nowrap`}
                        >
                          Save Grade
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Already graded */}
          {graded.length > 0 && (
            <div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#c7c4d8] bg-[#f5f2ff]">
                <h3 className="text-[15px] font-semibold text-[#1b1b24]">Graded ({graded.length})</h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#fcf8ff] border-b border-[#c7c4d8]">
                    {["Student", "Score", "Feedback", "Graded"].map((h) => (
                      <th key={h} className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c7c4d8]">
                  {graded.map((s) => (
                    <tr key={s.id} className="hover:bg-[#f5f2ff]/50 transition-colors">
                      <td className="px-6 py-4 text-[14px] text-[#1b1b24] font-medium">{s.userId}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-[#3525cd]">{s.grade}</span>
                        <span className="text-[#777587]"> / {selectedAssignment?.maxScore}</span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#464555] max-w-xs">
                        <p className="line-clamp-2">{s.feedback || "—"}</p>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#464555] whitespace-nowrap">
                        {fmtDateTime(s.gradedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Students Tab ─────────────────────────────────────────────────────────────

function StudentsTab({
  cohorts, activeCohortId, onSetCohort,
}: {
  cohorts: CohortDoc[];
  activeCohortId: string | null;
  onSetCohort: (id: string) => void;
}) {
  const cohortId = activeCohortId ?? cohorts[0]?.id ?? null;
  const activeCohort = cohorts.find((c) => c.id === cohortId) ?? null;
  const { data: enrollments = [], isLoading } = useEnrollmentsByCohort(cohortId);
  const [search, setSearch] = useState("");

  const filtered = search
    ? enrollments.filter((e) => {
        const q = search.toLowerCase();
        return (
          e.displayName?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q)
        );
      })
    : enrollments;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[28px] font-bold text-[#1b1b24] tracking-tight">Students</h2>
        <p className="text-[14px] text-[#464555] mt-1">View enrolled students and their progress in your cohort.</p>
      </div>

      <CohortPicker cohorts={cohorts} value={cohortId} onChange={onSetCohort} />

      {!cohortId ? (
        <EmptyState icon="people" message="Select a cohort to see enrolled students." />
      ) : (
        <div className="bg-white rounded-xl border border-[#c7c4d8] overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#c7c4d8] bg-[#f5f2ff] flex items-center justify-between gap-4">
            <h3 className="text-[15px] font-semibold text-[#1b1b24]">
              {activeCohort?.name} — {enrollments.length} student{enrollments.length !== 1 ? "s" : ""}
            </h3>
            <div className="relative">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#464555] text-[18px]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students…"
                className="pl-9 pr-4 py-2 border border-[#c7c4d8] rounded-lg text-[13px] bg-white focus:outline-none focus:border-[#3525cd] w-56"
              />
            </div>
          </div>

          {isLoading ? <Spinner /> : filtered.length === 0 ? (
            <EmptyState icon="people" message={search ? "No students match your search." : "No students enrolled yet."} />
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fcf8ff] border-b border-[#c7c4d8]">
                  {["Student", "Progress", "Status", "Enrolled"].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-[#777587] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c7c4d8]">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-[#f5f2ff]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#3525cd]/10 flex items-center justify-center text-[#3525cd] text-xs font-bold shrink-0">
                          {(e.displayName || e.email || "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-[#1b1b24]">{e.displayName || "—"}</p>
                          <p className="text-[12px] text-[#464555]">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-28 h-2 bg-[#e4e1ee] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3525cd] rounded-full transition-all"
                            style={{ width: `${e.progress ?? 0}%` }}
                          />
                        </div>
                        <span className="text-[12px] text-[#464555] tabular-nums">{e.progress ?? 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StudentStatusBadge status={e.status} />
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#464555]">
                      {fmtDate(e.enrolledAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function StudentStatusBadge({ status }: { status?: string }) {
  const map: Record<string, string> = {
    active:    "bg-emerald-100 text-emerald-800",
    completed: "bg-[#d0e1fb] text-[#54647a]",
    paused:    "bg-[#ffdbcc] text-[#351000]",
    refunded:  "bg-[#ffdad6] text-[#93000a]",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${map[status ?? ""] ?? "bg-[#f0ecf9] text-[#464555]"}`}>
      {status ?? "unknown"}
    </span>
  );
}
