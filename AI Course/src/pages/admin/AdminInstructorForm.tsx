import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import {
  fetchAllInstructors,
  createInstructor,
  updateInstructor,
  uploadInstructorPhoto,
  type InstructorDoc,
} from "@/services/instructors";

type FormData = Omit<InstructorDoc, "id">;

const EMPTY: FormData = {
  name: "",
  title: "",
  bio: "",
  courses: 0,
  learners: 0,
  photoUrl: "",
};

export default function AdminInstructorForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== "new");
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(EMPTY);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit && id) {
      fetchAllInstructors().then((all) => {
        const found = all.find((i) => i.id === id);
        if (found) {
          const { id: _id, ...rest } = found;
          setForm(rest);
          setPhotoPreview(found.photoUrl ?? "");
        }
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handlePhotoPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let photoUrl = form.photoUrl ?? "";

      if (isEdit && id) {
        if (photoFile) {
          photoUrl = await uploadInstructorPhoto(photoFile, id);
        }
        await updateInstructor(id, { ...form, photoUrl });
      } else {
        const newId = await createInstructor({ ...form, photoUrl });
        if (photoFile) {
          photoUrl = await uploadInstructorPhoto(photoFile, newId);
          await updateInstructor(newId, { photoUrl });
        }
      }

      navigate("/admin/instructors");
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

  return (
    <div className="p-8 max-w-2xl">
      <button
        onClick={() => navigate("/admin/instructors")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Instructors
      </button>
      <h1 className="text-2xl font-bold text-foreground mb-8">
        {isEdit ? "Edit Instructor" : "Add Instructor"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo */}
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Photo
          </h2>
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-full border-2 border-dashed border-[#E0E0E0] flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden bg-[#F7F7F7]"
              onClick={() => fileRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload size={20} className="text-muted-foreground" />
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
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG — recommended 400x400px</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoPick}
            />
          </div>
        </section>

        {/* Details */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Details
          </h2>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Dr. Priya Nambiar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title / Role *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Healthcare AI Researcher"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Bio *</label>
            <textarea
              required
              rows={4}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Brief biography (2-4 sentences)"
            />
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
            Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Courses taught
              </label>
              <input
                type="number"
                min={0}
                value={form.courses}
                onChange={(e) => set("courses", Number(e.target.value))}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Total learners
              </label>
              <input
                type="number"
                min={0}
                value={form.learners}
                onChange={(e) => set("learners", Number(e.target.value))}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
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
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Instructor"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/instructors")}
            className="px-6 py-2.5 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-foreground hover:bg-[#F7F7F7] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
