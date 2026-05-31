import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
  Upload,
  ArrowLeft,
  User as UserIcon,
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Award,
  FolderGit2,
  Crown,
  Settings,
  ExternalLink,
  Clock,
  CheckCircle2,
  Hammer,
  Rocket,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { getUserProfile, updateUserProfile, uploadImage } from "@/lib/firestore";
import type { FirestoreUser } from "@/types/firestore";
import Header from "@/components/Header";
import {
  useMyCertificates,
  useMyEnrollments,
  useMySessions,
  useMySubmissions,
  useMyWaitlistEntry,
} from "@/hooks/useStudentDashboard";

const BIO_MAX = 280;

type TabKey =
  | "overview"
  | "courses"
  | "calendar"
  | "certificates"
  | "projects"
  | "waitlist"
  | "account";

const TABS: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "overview",     label: "Overview",     icon: LayoutDashboard },
  { key: "courses",      label: "My Courses",   icon: BookOpen },
  { key: "calendar",     label: "Calendar",     icon: CalendarDays },
  { key: "certificates", label: "Certificates", icon: Award },
  { key: "projects",     label: "Projects",     icon: FolderGit2 },
  { key: "waitlist",     label: "Founder Track", icon: Crown },
  { key: "account",      label: "Account",      icon: Settings },
];

export default function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 no-underline"
        >
          <ArrowLeft size={14} />
          Back to courses
        </Link>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Left rail nav */}
          <aside>
            <div className="lg:sticky lg:top-20">
              <h1 className="text-2xl font-bold tracking-tight mb-1">Dashboard</h1>
              <p className="text-xs text-muted-foreground mb-5 truncate">{user?.email}</p>
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setTab(t.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-[#F7F7F7] hover:text-foreground"
                      }`}
                    >
                      <Icon size={16} />
                      {t.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Tab content */}
          <main className="min-w-0">
            {tab === "overview" && <OverviewTab />}
            {tab === "courses" && <CoursesTab />}
            {tab === "calendar" && <CalendarTab />}
            {tab === "certificates" && <CertificatesTab />}
            {tab === "projects" && <ProjectsTab />}
            {tab === "waitlist" && <WaitlistTab />}
            {tab === "account" && <AccountTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Overview ─────────────────────── */

function OverviewTab() {
  const enrollments  = useMyEnrollments();
  const certs        = useMyCertificates();
  const sessions     = useMySessions();
  const submissions  = useMySubmissions();
  const waitlist     = useMyWaitlistEntry();

  const activeCount = (enrollments.data ?? []).filter((e) => e.status === "active").length;
  const completedCount = (enrollments.data ?? []).filter((e) => e.status === "completed").length;
  const avgProgress = useMemo(() => {
    const list = enrollments.data ?? [];
    if (!list.length) return 0;
    return Math.round(list.reduce((s, e) => s + (e.progress ?? 0), 0) / list.length);
  }, [enrollments.data]);

  const nextSession = useMemo(() => {
    const list = sessions.data ?? [];
    const now = Date.now();
    return list.find((s) => {
      const ts = toDate(s.scheduledAt).getTime();
      return ts >= now;
    });
  }, [sessions.data]);

  const queries = [
    { name: "Enrollments", q: enrollments },
    { name: "Sessions",    q: sessions },
    { name: "Certificates", q: certs },
    { name: "Projects",     q: submissions },
    { name: "Waitlist entry", q: waitlist },
  ];
  const anyError = queries.some((x) => x.q.isError);

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Overview"
        subtitle="A snapshot of where you stand across Riddoff Ed."
      />

      {anyError && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
            <div className="text-sm text-red-800 space-y-1">
              <p className="font-semibold">Some data couldn't load.</p>
              {queries.filter((x) => x.q.isError).map((x) => (
                <p key={x.name} className="text-xs font-mono break-all">
                  {x.name}: {(x.q.error as Error)?.message ?? "unknown error"}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled courses"  value={activeCount}    icon={BookOpen} />
        <StatCard label="Avg. progress"     value={`${avgProgress}%`} icon={LayoutDashboard} />
        <StatCard label="Certificates"      value={certs.data?.length ?? 0} icon={Award} />
        <StatCard label="Projects shipped"  value={submissions.data?.length ?? 0} icon={FolderGit2} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Up next">
          {nextSession ? (
            <div>
              <p className="text-sm font-semibold text-foreground">{nextSession.topic}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Clock size={12} />
                {formatDateTime(nextSession.scheduledAt)}
              </p>
              {nextSession.zoomLink && (
                <a
                  href={nextSession.zoomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  Join session <ExternalLink size={13} />
                </a>
              )}
            </div>
          ) : (
            <EmptyHint>No live sessions scheduled yet. Check back once your cohort starts.</EmptyHint>
          )}
        </Card>

        <Card title="Founder Track status">
          {waitlist.data ? (
            <div className="text-sm">
              <p>
                You're <span className="font-semibold capitalize">{waitlist.data.status}</span> on the{" "}
                <span className="font-semibold capitalize">{waitlist.data.track}</span> track.
              </p>
              {completedCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  {completedCount} course{completedCount === 1 ? "" : "s"} completed.
                </p>
              )}
            </div>
          ) : (
            <EmptyHint>
              You haven't joined the founding waitlist yet.{" "}
              <Link to="/waitlist" className="text-primary font-semibold no-underline">Claim your spot →</Link>
            </EmptyHint>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ─────────────────────── My Courses ─────────────────────── */

function CoursesTab() {
  const { data: enrollments = [], isLoading } = useMyEnrollments();

  return (
    <div className="space-y-4">
      <SectionHeading
        title="My Courses"
        subtitle="Everything you're enrolled in, with live progress."
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : enrollments.length === 0 ? (
        <EmptyCard
          title="You're not enrolled in anything yet."
          body="Browse the catalog and pick your first course."
          ctaLabel="See courses"
          ctaTo="/"
        />
      ) : (
        <ul className="space-y-3">
          {enrollments.map((e) => (
            <li
              key={e.id}
              className="p-4 rounded-lg border border-[#E0E0E0] bg-white flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {e.courseTitle || e.courseId}
                  </p>
                  <StatusBadge status={e.status} />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 max-w-xs h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${e.progress ?? 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {e.progress ?? 0}%
                  </span>
                </div>
                {e.cohortName && (
                  <p className="text-xs text-muted-foreground mt-1.5">Cohort: {e.cohortName}</p>
                )}
              </div>
              <Link
                to={`/courses/${e.courseId}`}
                className="shrink-0 inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-md hover:bg-primary/5 transition-colors no-underline"
              >
                Open <ExternalLink size={13} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────── Calendar ─────────────────────── */

function CalendarTab() {
  const { data: sessions = [], isLoading } = useMySessions();

  const upcoming = useMemo(() => {
    const now = Date.now();
    return sessions.filter((s) => toDate(s.scheduledAt).getTime() >= now);
  }, [sessions]);

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Calendar"
        subtitle="Upcoming live sessions across your cohorts."
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : upcoming.length === 0 ? (
        <EmptyCard
          title="No sessions on the schedule."
          body="Live sessions appear here once your cohort instructor publishes the schedule."
        />
      ) : (
        <ul className="space-y-3">
          {upcoming.map((s) => (
            <li
              key={s.id}
              className="p-4 rounded-lg border border-[#E0E0E0] bg-white flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="shrink-0 w-14 h-14 rounded-lg bg-primary/5 flex flex-col items-center justify-center text-primary">
                <span className="text-[10px] uppercase font-semibold">
                  {toDate(s.scheduledAt).toLocaleDateString("en-US", { month: "short" })}
                </span>
                <span className="text-lg font-bold leading-none">
                  {toDate(s.scheduledAt).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{s.topic}</p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <Clock size={12} />
                  {formatDateTime(s.scheduledAt)}
                  {s.durationMinutes ? ` · ${s.durationMinutes} min` : ""}
                </p>
              </div>
              {s.zoomLink && (
                <a
                  href={s.zoomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-md hover:bg-primary/5 transition-colors no-underline"
                >
                  Join <ExternalLink size={13} />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────── Certificates ─────────────────────── */

function CertificatesTab() {
  const { data: certs = [], isLoading } = useMyCertificates();

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Certificates"
        subtitle="Proof of what you've shipped. Verifiable, public, yours."
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : certs.length === 0 ? (
        <EmptyCard
          title="No certificates yet."
          body="Complete a course to earn a verifiable certificate that appears here."
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {certs.map((c) => (
            <li
              key={c.id}
              className="p-4 rounded-lg border border-[#E0E0E0] bg-white"
            >
              <div className="flex items-start gap-3">
                <Award size={18} className="text-primary mt-0.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {c.certificateNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Issued {formatDate(c.issueDate)}
                  </p>
                  {c.verificationUrl && (
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline"
                    >
                      Verify <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────── Projects ─────────────────────── */

function ProjectsTab() {
  const { data: subs = [], isLoading } = useMySubmissions();

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Projects"
        subtitle="Assignments and capstones you've submitted."
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : subs.length === 0 ? (
        <EmptyCard
          title="No projects submitted yet."
          body="As you ship assignment submissions, they'll appear here with grades and instructor feedback."
        />
      ) : (
        <ul className="space-y-3">
          {subs.map((s) => (
            <li
              key={s.id}
              className="p-4 rounded-lg border border-[#E0E0E0] bg-white"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    Assignment {s.assignmentId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Submitted {formatDate(s.submittedAt)}
                  </p>
                </div>
                {typeof s.grade === "number" ? (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Graded · {s.grade}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#F0F0F0] text-muted-foreground">
                    Awaiting grade
                  </span>
                )}
              </div>
              {s.feedback && (
                <p className="text-xs text-muted-foreground mt-2 italic">"{s.feedback}"</p>
              )}
              {s.fileUrl && (
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary hover:underline"
                >
                  View submission <ExternalLink size={11} />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────── Waitlist / Founder ─────────────────────── */

function WaitlistTab() {
  const { data: entry, isLoading } = useMyWaitlistEntry();

  return (
    <div className="space-y-4">
      <SectionHeading
        title="Founder Track"
        subtitle="Where you stand with the Riddoff Ed founding cohort."
      />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !entry ? (
        <EmptyCard
          title="You haven't joined the waitlist."
          body="Riddoff Ed is admitting a small founding cohort before public launch. Join to claim your place."
          ctaLabel="Join the waitlist"
          ctaTo="/waitlist"
        />
      ) : (
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-[#E0E0E0] bg-white">
            <div className="flex items-start gap-4">
              <TrackIcon track={entry.track} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-bold text-foreground capitalize">
                    {entry.track === "unsure" ? "Help me choose" : `${entry.track} track`}
                  </p>
                  <WaitlistStatusBadge status={entry.status} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Joined {formatDate(entry.createdAt)}
                </p>
                {entry.idea && (
                  <div className="mt-4 p-3 rounded-md bg-[#F7F7F7] text-sm text-foreground">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                      What you said you wanted to build
                    </p>
                    {entry.idea}
                  </div>
                )}
              </div>
            </div>
          </div>

          {entry.status === "new" && (
            <p className="text-sm text-muted-foreground">
              You're in the queue. We'll reach out at <span className="font-semibold text-foreground">{entry.email}</span> as founding spots open up.
            </p>
          )}
          {entry.status === "contacted" && (
            <p className="text-sm text-foreground flex items-start gap-2">
              <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
              We've reached out — check your email at {entry.email}.
            </p>
          )}
          {entry.status === "converted" && (
            <p className="text-sm text-foreground flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
              Welcome aboard. You're in the founding cohort.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TrackIcon({ track }: { track: string }) {
  const Icon =
    track === "builder" ? Hammer
    : track === "founder" ? Rocket
    : track === "equity" ? Crown
    : HelpCircle;
  return (
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
      <Icon size={20} />
    </div>
  );
}

function WaitlistStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new:       "bg-amber-100 text-amber-800",
    contacted: "bg-blue-100 text-blue-800",
    converted: "bg-emerald-100 text-emerald-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${styles[status] ?? "bg-[#F0F0F0] text-muted-foreground"}`}>
      {status}
    </span>
  );
}

/* ─────────────────────── Account (the original profile form) ─────────────────────── */

function AccountTab() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone]             = useState("");
  const [bio, setBio]                 = useState("");
  const [photoFile, setPhotoFile]     = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const profile = await getUserProfile<FirestoreUser>(user.uid);
      setDisplayName(profile?.displayName ?? user.displayName ?? "");
      setPhone(profile?.phone ?? "");
      setBio(profile?.bio ?? "");
      setPhotoPreview(profile?.photoUrl ?? user.photoURL ?? "");
      setLoading(false);
    })();
  }, [user]);

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!displayName.trim()) {
      setError("Display name is required.");
      return;
    }
    setSaving(true);
    setError("");

    try {
      let photoUrl = photoPreview;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
        photoUrl = await uploadImage(photoFile, `users/${user.uid}/photo.${ext}`);
      }

      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        photoUrl,
      });

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim(),
          photoURL: photoUrl || null,
        });
      }

      await refreshUser();
      setPhotoFile(null);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  const bioCharsLeft = BIO_MAX - bio.length;

  return (
    <div className="space-y-4 max-w-xl">
      <SectionHeading
        title="Account"
        subtitle="This is how your name shows up to instructors and admins."
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt=""
                className="w-20 h-20 rounded-full object-cover border border-[#E0E0E0]"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon size={32} className="text-primary" />
              </div>
            )}
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={pickFile}
                aria-label="Upload profile photo"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-foreground border border-[#E0E0E0] rounded-md hover:bg-[#F7F7F7] transition-colors"
              >
                <Upload size={14} />
                {photoPreview ? "Change photo" : "Upload photo"}
              </button>
              <p className="text-xs text-muted-foreground mt-1">PNG or JPG, square works best.</p>
            </div>
          </div>

          <div>
            <label htmlFor="account-email" className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              id="account-email"
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-md bg-[#F7F7F7] text-muted-foreground"
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-1">
              Display name <span className="text-red-500">*</span>
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
              rows={4}
              placeholder="A short intro — what you're learning, what you build…"
              className="w-full px-3 py-2 text-sm border border-[#E0E0E0] rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
            <p className={`text-xs mt-1 ${bioCharsLeft < 20 ? "text-amber-600" : "text-muted-foreground"}`}>
              {bioCharsLeft} characters left
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
            {savedAt && !saving && (
              <span className="text-sm text-emerald-700">Saved ✓</span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

/* ─────────────────────── Shared bits ─────────────────────── */

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof LayoutDashboard;
}) {
  return (
    <div className="p-4 rounded-lg border border-[#E0E0E0] bg-white">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <Icon size={14} className="text-muted-foreground" />
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground tracking-tight">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-lg border border-[#E0E0E0] bg-white">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function EmptyCard({
  title,
  body,
  ctaLabel,
  ctaTo,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
  return (
    <div className="p-8 rounded-lg border border-dashed border-[#E0E0E0] bg-[#FAFAFA] text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-1">{body}</p>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="inline-flex items-center gap-1.5 mt-4 px-3 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-primary/90 transition-colors no-underline"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    active:    "bg-emerald-100 text-emerald-800",
    completed: "bg-blue-100 text-blue-800",
    paused:    "bg-amber-100 text-amber-800",
    refunded:  "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${styles[status ?? ""] ?? "bg-[#F0F0F0] text-muted-foreground"}`}>
      {status ?? "unknown"}
    </span>
  );
}

/* ─────────────────────── Date utils ─────────────────────── */

function toDate(value: unknown): Date {
  if (!value) return new Date(0);
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") return new Date(value);
  // Firestore Timestamp
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  // Plain {seconds, nanoseconds}
  if (typeof value === "object" && value !== null && "seconds" in value) {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return new Date(0);
}

function formatDate(value: unknown): string {
  return toDate(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: unknown): string {
  return toDate(value).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
