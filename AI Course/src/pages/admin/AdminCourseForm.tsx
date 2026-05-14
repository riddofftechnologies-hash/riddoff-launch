import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X, Upload, Loader2 } from "lucide-react";
import {
  fetchCourseById,
  createCourse,
  updateCourse,
  uploadCourseImage,
} from "@/services/courses";
import { fetchAllInstructors, type InstructorDoc } from "@/services/instructors";
import type { CourseDoc } from "@/types/course";

const BOOTCAMP_SECTORS = [
  "E-commerce & Retail",
  "Fintech & Banking",
  "Healthcare & Biotech",
  "Legal Tech",
  "Climate & Sustainability",
  "Manufacturing",
];

const COURSE_CATEGORIES = [
  "Foundations",
  "LLM & RAG",
  "Agents & Orchestration",
  "Computer Vision",
  "MLOps & Deployment",
  "Industry Applications",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

type FormData = Omit<CourseDoc, "id" | "createdAt" | "updatedAt">;

const EMPTY: FormData = {
  type: "course",
  title: "",
  tagline: "",
  description: "",
  fullDescription: "",
  hours: 0,
  priceLow: 0,
  image: "",
  instructor: "",
  instructorId: "",
  outcomes: ["", "", ""],
  syllabus: ["", "", "", ""],
  level: "Beginner",
  reviewCount: 0,
  enrolledCount: 0,
  published: false,
  category: "Foundations",
  weeks: 4,
  sector: "E-commerce & Retail",
  seats: 30,
};

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  function update(idx: number, val: string) {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  }
  function add() {
    onChange([...items, ""]);
  }
  function remove(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
        >
          <Plus size={12} /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              className="flex-1 border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder={`${label} ${idx + 1}`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminCourseForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== "new");
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(EMPTY);
  const [instructors, setInstructors] = useState<InstructorDoc[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAllInstructors().then(setInstructors);
    if (isEdit && id) {
      fetchCourseById(id).then((doc) => {
        if (doc) {
          const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = doc;
          setForm(rest as FormData);
          setImagePreview(doc.image);
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleInstructorSelect(instructorId: string) {
    const found = instructors.find((i) => i.id === instructorId);
    set("instructorId", instructorId);
    set("instructor", found?.name ?? "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        const tempId = isEdit ? id! : `new-${Date.now()}`;
        imageUrl = await uploadCourseImage(imageFile, tempId);
      }
      const payload: FormData = { ...form, image: imageUrl };
      if (isEdit && id) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }
      navigate("/admin/courses");
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isBootcamp = form.type === "bootcamp";

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => navigate("/admin/courses")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Courses
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-8">
        {isEdit ? "Edit Program" : "Create New Program"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Type selector */}
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Program Type
          </h2>
          <div className="flex gap-3">
            {(["course", "bootcamp"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                  form.type === t
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-[#E0E0E0] text-muted-foreground hover:border-[#C0C0C0]"
                }`}
              >
                {t === "course" ? "Self-Paced Course" : "Live Bootcamp"}
              </button>
            ))}
          </div>
        </section>

        {/* Basic info */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Basic Info
          </h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="AI Fundamentals Bootcamp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tagline *</label>
            <input
              required
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="One-line hook for the course card"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Short Description *
            </label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="2-3 sentence overview shown on cards"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Full Description *
            </label>
            <textarea
              required
              rows={5}
              value={form.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Detailed description for the course detail page"
            />
          </div>
        </section>

        {/* Cover image */}
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Cover Image
          </h2>
          <div
            className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-xs h-40 object-cover rounded-lg"
              />
            ) : (
              <Upload size={24} className="text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {imagePreview ? "Click to change image" : "Click to upload cover image"}
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />
          </div>
        </section>

        {/* Instructor */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Instructor
          </h2>
          {instructors.length > 0 ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Assign Instructor
              </label>
              <select
                value={form.instructorId ?? ""}
                onChange={(e) => handleInstructorSelect(e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="">— Select instructor —</option>
                {instructors.map((ins) => (
                  <option key={ins.id} value={ins.id}>
                    {ins.name} — {ins.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No instructors in the database yet.{" "}
              <a href="/admin/instructors/new" className="text-primary hover:underline">
                Add one first.
              </a>
            </p>
          )}
          {!form.instructorId && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Or enter instructor name manually
              </label>
              <input
                value={form.instructor}
                onChange={(e) => set("instructor", e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Instructor full name"
              />
            </div>
          )}
        </section>

        {/* Pricing and details */}
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Pricing &amp; Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Price (INR) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.priceLow}
                onChange={(e) => set("priceLow", Number(e.target.value))}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Hours *</label>
              <input
                type="number"
                required
                min={1}
                value={form.hours}
                onChange={(e) => set("hours", Number(e.target.value))}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Level *</label>
              <select
                value={form.level}
                onChange={(e) => set("level", e.target.value as typeof form.level)}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
            {isBootcamp ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Available Seats
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.seats ?? 30}
                    onChange={(e) => set("seats", Number(e.target.value))}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Sector</label>
                  <select
                    value={form.sector ?? ""}
                    onChange={(e) => set("sector", e.target.value)}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    {BOOTCAMP_SECTORS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Duration (weeks)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.weeks ?? 4}
                    onChange={(e) => set("weeks", Number(e.target.value))}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select
                    value={form.category ?? ""}
                    onChange={(e) => set("category", e.target.value)}
                    className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  >
                    {COURSE_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Curriculum */}
        <section className="space-y-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Curriculum
          </h2>
          <StringListEditor
            label="Learning Outcomes"
            items={form.outcomes}
            onChange={(v) => set("outcomes", v)}
          />
          <StringListEditor
            label="Syllabus Topics"
            items={form.syllabus}
            onChange={(v) => set("syllabus", v)}
          />
        </section>

        {/* Visibility */}
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Visibility
          </h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("published", !form.published)}
              className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                form.published ? "bg-primary" : "bg-[#D0D0D0]"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.published ? "left-5" : "left-1"
                }`}
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              {form.published ? "Published" : "Draft — not visible to students"}
            </span>
          </label>
        </section>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Program"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="px-6 py-2.5 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-foreground hover:bg-[#F7F7F7] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
