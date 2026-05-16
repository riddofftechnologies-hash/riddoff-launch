import { useState } from "react";
import type { FirestorePath, PathFormat } from "@/types/firestore";

const FORMATS: PathFormat[] = ["live-cohort", "self-paced", "self-paced-group-call", "ala-carte"];
const FORMAT_LABELS: Record<PathFormat, string> = {
  "live-cohort": "Live Cohort",
  "self-paced": "Self-Paced",
  "self-paced-group-call": "Self-Paced + Group Calls",
  "ala-carte": "À la carte / Custom Bundle",
};

const EMPTY: FirestorePath & { docId: string } = {
  docId: "",
  slug: "",
  name: "",
  tagline: "",
  description: "",
  price: 0,
  format: "self-paced",
  duration: "",
  includesResidency: false,
  color: "#3525cd",
  unitIds: [],
  outcomes: [],
  ctaUrl: "",
  published: false,
  order: 0,
};

interface Props {
  initial?: FirestorePath & { id: string };
  onSave: (id: string, data: FirestorePath) => Promise<void>;
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

export default function PathForm({ initial, onSave, onCancel }: Props) {
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
        tagline: form.tagline,
        description: form.description,
        price: Number(form.price),
        format: form.format,
        duration: form.duration,
        includesResidency: form.includesResidency,
        color: form.color,
        unitIds: form.unitIds,
        outcomes: form.outcomes,
        ctaUrl: form.ctaUrl,
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
          placeholder="get-ai-job"
        />
      </Row>
      <Row label="Name" required>
        <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inp} placeholder="Path A — Get the AI Job" />
      </Row>
      <Row label="Tagline">
        <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inp} placeholder="Land a GCC AI/ML role in 12 weeks" />
      </Row>
      <Row label="Description">
        <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={inp} placeholder="2-3 sentence overview shown on the path page" />
      </Row>
      <div className="grid grid-cols-2 gap-3">
        <Row label="Price (INR)">
          <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={inp} placeholder="74999" />
        </Row>
        <Row label="Order">
          <input type="number" value={form.order} onChange={(e) => set("order", e.target.value)} className={inp} placeholder="0" />
        </Row>
      </div>
      <Row label="Format">
        <select value={form.format} onChange={(e) => set("format", e.target.value as PathFormat)} className={inp} title="Format">
          {FORMATS.map((f) => <option key={f} value={f}>{FORMAT_LABELS[f]}</option>)}
        </select>
      </Row>
      <Row label="Duration">
        <input value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inp} placeholder="12 weeks" />
      </Row>
      <Row label="Accent colour (hex or Tailwind)">
        <div className="flex items-center gap-2">
          <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} className="h-9 w-12 rounded border border-[#E0E0E0] p-0.5 cursor-pointer" />
          <input value={form.color} onChange={(e) => set("color", e.target.value)} className={`${inp} flex-1`} placeholder="#3525cd" />
        </div>
      </Row>
      <Row label="Enroll CTA URL">
        <input value={form.ctaUrl} onChange={(e) => set("ctaUrl", e.target.value)} className={inp} placeholder="https://graphy.com/path-a" />
      </Row>
      <Row label="Outcomes (one per line)">
        <textarea
          rows={4}
          value={form.outcomes.join("\n")}
          onChange={(e) => set("outcomes", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
          className={inp}
          placeholder="One outcome per line"
        />
      </Row>

      {/* Checkboxes */}
      <div className="flex items-center gap-6 pt-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.includesResidency}
            onChange={(e) => set("includesResidency", e.target.checked)}
            className="accent-primary"
          />
          <span className="text-sm font-medium text-foreground">Residency eligible</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="accent-primary"
          />
          <span className="text-sm font-medium text-foreground">Published</span>
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60">
          {saving ? "Saving…" : "Save Path"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#E0E0E0] text-sm rounded-lg hover:bg-[#F7F7F7]">
          Cancel
        </button>
      </div>
    </form>
  );
}
