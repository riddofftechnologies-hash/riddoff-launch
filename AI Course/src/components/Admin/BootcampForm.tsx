import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { uploadImage } from "@/lib/firestore";
import { useInstructors } from "@/hooks/useInstructors";
import type { FirestoreBootcamp } from "@/types/firestore";

const SECTORS = [
  "E-commerce & Retail",
  "Fintech & Banking",
  "Healthcare & Biotech",
  "Legal Tech",
  "Climate & Sustainability",
  "Manufacturing",
];

const EMPTY: FirestoreBootcamp & { id: string } = {
  id: "",
  title: "",
  sector: SECTORS[0],
  tagline: "",
  description: "",
  fullDescription: "",
  hours: 14,
  priceLow: 1999,
  seats: 30,
  image: "",
  instructor: "",
  outcomes: [],
  syllabus: [],
  level: "Intermediate",
  reviewCount: 0,
  enrolledCount: 0,
};

interface Props {
  initial?: FirestoreBootcamp & { id: string };
  onSave: (id: string, data: FirestoreBootcamp) => Promise<void>;
  onCancel: () => void;
}

const inp = "w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white";

function Row({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

export default function BootcampForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<typeof EMPTY>(initial ?? { ...EMPTY });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initial?.image ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: instructors = [] } = useInstructors();

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleArrayField(key: "outcomes" | "syllabus", value: string) {
    set(key, value.split("\n").map((s) => s.trim()).filter(Boolean));
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleInstructorSelect(name: string) {
    set("instructor", name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.id.trim()) { setError("ID (URL slug) is required"); return; }
    setSaving(true);
    setError("");
    try {
      let imageUrl = form.image;
      if (imageFile) {
        const ext = imageFile.name.split(".").pop() ?? "jpg";
        imageUrl = await uploadImage(imageFile, `bootcamps/${form.id.trim()}/cover.${ext}`);
      }
      await onSave(form.id.trim(), {
        title: form.title,
        sector: form.sector,
        tagline: form.tagline,
        description: form.description,
        fullDescription: form.fullDescription,
        hours: Number(form.hours),
        priceLow: Number(form.priceLow),
        seats: Number(form.seats),
        image: imageUrl,
        instructor: form.instructor,
        outcomes: form.outcomes,
        syllabus: form.syllabus,
        level: form.level,
        enrolledCount: Number(form.enrolledCount),
        reviewCount: Number(form.reviewCount),
      });
    } catch {
      setError("Failed to save. Check the console for details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Row label="ID (URL slug)" required>
        <input
          value={form.id}
          onChange={(e) => set("id", e.target.value)}
          disabled={!!initial}
          className={inp}
          placeholder="ai-dropshipping-empire"
        />
      </Row>
      <Row label="Title" required>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inp} />
      </Row>
      <Row label="Sector" required>
        <select value={form.sector} onChange={(e) => set("sector", e.target.value)} className={inp}>
          {SECTORS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Row>
      <Row label="Tagline">
        <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inp} />
      </Row>
      <Row label="Short description">
        <input value={form.description} onChange={(e) => set("description", e.target.value)} className={inp} />
      </Row>
      <Row label="Full description">
        <textarea rows={3} value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} className={inp} />
      </Row>
      <div className="grid grid-cols-3 gap-3">
        <Row label="Hours">
          <input type="number" value={form.hours} onChange={(e) => set("hours", e.target.value)} className={inp} />
        </Row>
        <Row label="Price (INR)">
          <input type="number" value={form.priceLow} onChange={(e) => set("priceLow", e.target.value)} className={inp} />
        </Row>
        <Row label="Seats">
          <input type="number" value={form.seats} onChange={(e) => set("seats", e.target.value)} className={inp} />
        </Row>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Row label="Enrolled count">
          <input type="number" value={form.enrolledCount} onChange={(e) => set("enrolledCount", e.target.value)} className={inp} />
        </Row>
        <Row label="Review count">
          <input type="number" value={form.reviewCount} onChange={(e) => set("reviewCount", e.target.value)} className={inp} />
        </Row>
      </div>

      {/* Cover image upload */}
      <Row label="Cover Image">
        <div
          className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="h-16 w-24 object-cover rounded-lg shrink-0" />
          ) : (
            <div className="h-16 w-24 bg-[#F7F7F7] rounded-lg flex items-center justify-center shrink-0">
              <Upload size={18} className="text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-foreground">
              {imagePreview ? "Click to change" : "Click to upload cover image"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WebP</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
        </div>
        <input
          value={form.image}
          onChange={(e) => { set("image", e.target.value); setImagePreview(e.target.value); }}
          className={`${inp} mt-2`}
          placeholder="Or paste an image URL"
        />
      </Row>

      {/* Instructor */}
      <Row label="Instructor" required>
        {instructors.length > 0 ? (
          <select
            value={form.instructor}
            onChange={(e) => handleInstructorSelect(e.target.value)}
            className={inp}
          >
            <option value="">— Select instructor —</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.name}>{ins.name} — {ins.title}</option>
            ))}
          </select>
        ) : (
          <input
            value={form.instructor}
            onChange={(e) => set("instructor", e.target.value)}
            className={inp}
            placeholder="Instructor full name"
          />
        )}
      </Row>

      <Row label="Level">
        <select value={form.level} onChange={(e) => set("level", e.target.value as FirestoreBootcamp["level"])} className={inp}>
          <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
        </select>
      </Row>
      <Row label="Outcomes (one per line)">
        <textarea rows={3} value={form.outcomes.join("\n")} onChange={(e) => handleArrayField("outcomes", e.target.value)} className={inp} />
      </Row>
      <Row label="Syllabus modules (one per line)">
        <textarea rows={4} value={form.syllabus.join("\n")} onChange={(e) => handleArrayField("syllabus", e.target.value)} className={inp} />
      </Row>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60">
          {saving ? "Saving…" : "Save Bootcamp"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#E0E0E0] text-sm rounded-lg hover:bg-[#F7F7F7]">
          Cancel
        </button>
      </div>
    </form>
  );
}
