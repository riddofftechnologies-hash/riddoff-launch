import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { uploadImage } from "@/lib/firestore";
import type { FirestoreInstructor } from "@/types/firestore";

const EMPTY: FirestoreInstructor = {
  name: "",
  title: "",
  bio: "",
  courses: 1,
  learners: 0,
  photoUrl: "",
};

interface Props {
  initial?: FirestoreInstructor & { id: string };
  onSave: (name: string, data: Omit<FirestoreInstructor, "name">) => Promise<void>;
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

export default function InstructorForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<FirestoreInstructor>(initial ?? { ...EMPTY });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(initial?.photoUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    try {
      let photoUrl = form.photoUrl ?? "";
      if (photoFile) {
        const slug = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const ext = photoFile.name.split(".").pop() ?? "jpg";
        photoUrl = await uploadImage(photoFile, `instructors/${slug}/photo.${ext}`);
      }
      const { name, ...rest } = form;
      await onSave(name, {
        ...rest,
        photoUrl,
        courses: Number(rest.courses),
        learners: Number(rest.learners),
      });
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo upload */}
      <Row label="Photo">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full border-2 border-dashed border-[#E0E0E0] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden bg-[#F7F7F7] shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Upload size={16} className="text-muted-foreground" />
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-primary font-medium hover:text-primary/80"
            >
              {photoPreview ? "Change photo" : "Upload photo"}
            </button>
            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG — 400×400px recommended</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoPick} aria-label="Upload instructor photo" />
        </div>
      </Row>

      <Row label="Full name" required>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          disabled={!!initial}
          className={inp}
          placeholder="Dr. Priya Nambiar"
        />
      </Row>
      <Row label="Title / role">
        <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inp} placeholder="Healthcare AI Researcher" />
      </Row>
      <Row label="Bio">
        <textarea rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} className={inp} placeholder="Brief biography (2-4 sentences)" />
      </Row>
      <div className="grid grid-cols-2 gap-3">
        <Row label="Courses taught">
          <input type="number" value={form.courses} onChange={(e) => set("courses", e.target.value)} className={inp} placeholder="0" />
        </Row>
        <Row label="Total learners">
          <input type="number" value={form.learners} onChange={(e) => set("learners", e.target.value)} className={inp} placeholder="0" />
        </Row>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60">
          {saving ? "Saving…" : "Save Instructor"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#E0E0E0] text-sm rounded-lg hover:bg-[#F7F7F7]">
          Cancel
        </button>
      </div>
    </form>
  );
}
