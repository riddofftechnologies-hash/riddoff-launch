import { useState } from "react";
import type { FirestoreUnit, FirestorePath } from "@/types/firestore";

const EMPTY: FirestoreUnit & { docId: string } = {
  docId: "",
  slug: "",
  name: "",
  outcome: "",
  sourceLectures: [],
  paths: [],
  priceAlaCart: 0,
  published: false,
  order: 0,
};

interface Props {
  initial?: FirestoreUnit & { id: string };
  paths: (FirestorePath & { id: string })[];
  onSave: (id: string, data: FirestoreUnit) => Promise<void>;
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

export default function UnitForm({ initial, paths, onSave, onCancel }: Props) {
  const [form, setForm] = useState<typeof EMPTY>(
    initial
      ? { ...EMPTY, ...initial, docId: initial.id }
      : { ...EMPTY }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function togglePath(pathSlug: string) {
    setForm((f) => ({
      ...f,
      paths: f.paths.includes(pathSlug)
        ? f.paths.filter((p) => p !== pathSlug)
        : [...f.paths, pathSlug],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.docId.trim()) { setError("Slug / ID is required"); return; }
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    try {
      await onSave(form.docId.trim(), {
        slug: form.docId.trim(),
        name: form.name,
        outcome: form.outcome,
        sourceLectures: form.sourceLectures,
        paths: form.paths,
        priceAlaCart: Number(form.priceAlaCart),
        published: form.published,
        order: Number(form.order),
      });
    } catch {
      setError("Failed to save. Check the console for details.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Row label="Slug (document ID)" required>
        <input
          value={form.docId}
          onChange={(e) => set("docId", e.target.value)}
          disabled={!!initial}
          className={inp}
          placeholder="u1-ai-foundations"
        />
      </Row>
      <Row label="Name" required>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} placeholder="AI Foundations & Setup" />
      </Row>
      <Row label="Outcome (one sentence)">
        <input value={form.outcome} onChange={(e) => set("outcome", e.target.value)} className={inp} placeholder="Get a working AI dev environment in 2 hours" />
      </Row>
      <Row label="Source Lectures (comma-separated)">
        <input
          value={form.sourceLectures.join(", ")}
          onChange={(e) => set("sourceLectures", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className={inp}
          placeholder="L1, L2, L3"
        />
      </Row>

      <div className="grid grid-cols-2 gap-3">
        <Row label="À la carte price (INR)">
          <input type="number" value={form.priceAlaCart} onChange={(e) => set("priceAlaCart", e.target.value)} className={inp} placeholder="4999" />
        </Row>
        <Row label="Order">
          <input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className={inp} placeholder="1" />
        </Row>
      </div>

      {/* Path membership */}
      {paths.length > 0 && (
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
            Included in paths
          </span>
          <div className="space-y-1.5">
            {paths.map((path) => {
              const slug = path.slug || path.id;
              return (
                <label key={path.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.paths.includes(slug)}
                    onChange={() => togglePath(slug)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{path.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => set("published", e.target.checked)}
          className="accent-primary"
        />
        <span className="text-sm font-medium text-foreground">Published (visible in unit picker)</span>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60">
          {saving ? "Saving…" : "Save Unit"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#E0E0E0] text-sm rounded-lg hover:bg-[#F7F7F7]">
          Cancel
        </button>
      </div>
    </form>
  );
}
