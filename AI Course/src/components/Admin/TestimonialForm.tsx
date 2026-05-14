import { useState } from "react";
import type { FirestoreTestimonial } from "@/types/firestore";

const EMPTY: Omit<FirestoreTestimonial, "id"> = {
  name: "",
  role: "",
  quote: "",
  initials: "",
  order: 0,
};

interface Props {
  initial?: FirestoreTestimonial & { id: string };
  onSave: (data: Omit<FirestoreTestimonial, "id">) => Promise<void>;
  onUpdate?: (id: string, data: Partial<FirestoreTestimonial>) => Promise<void>;
  onCancel: () => void;
}

export default function TestimonialForm({ initial, onSave, onUpdate, onCancel }: Props) {
  const [form, setForm] = useState<Omit<FirestoreTestimonial, "id">>(
    initial ? { name: initial.name, role: initial.role, quote: initial.quote, initials: initial.initials, order: initial.order ?? 0 } : { ...EMPTY }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: unknown) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (initial && onUpdate) {
        await onUpdate(initial.id, form);
      } else {
        await onSave(form);
      }
    } catch {
      setError("Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Row label="Name" required>
        <input value={form.name} onChange={(e) => { set("name", e.target.value); if (!form.initials) set("initials", e.target.value.split(" ").map((n) => n[0]).join("")); }} className={inp} />
      </Row>
      <Row label="Role / company">
        <input value={form.role} onChange={(e) => set("role", e.target.value)} className={inp} placeholder="ML Engineer at Infosys" />
      </Row>
      <Row label="Quote">
        <textarea rows={3} value={form.quote} onChange={(e) => set("quote", e.target.value)} className={inp} />
      </Row>
      <Row label="Initials (auto-filled)">
        <input value={form.initials} onChange={(e) => set("initials", e.target.value)} className={inp} maxLength={3} />
      </Row>
      <Row label="Order (lower = first)">
        <input type="number" value={form.order ?? 0} onChange={(e) => set("order", Number(e.target.value))} className={inp} />
      </Row>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60">
          {saving ? "Saving…" : "Save Testimonial"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2 border border-[#E0E0E0] text-sm rounded-lg hover:bg-[#F7F7F7]">
          Cancel
        </button>
      </div>
    </form>
  );
}

const inp = "w-full border border-[#E0E0E0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-white";

function Row({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
