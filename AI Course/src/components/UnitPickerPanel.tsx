import { useState } from "react";
import { X, ExternalLink } from "lucide-react";
import type { FirestoreUnit } from "@/types/firestore";

interface Props {
  units: (FirestoreUnit & { id: string })[];
  onClose: () => void;
}

export default function UnitPickerPanel({ units, onClose }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const published = units.filter((u) => u.published);

  function toggle(slug: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  const total = published
    .filter((u) => checked.has(u.slug))
    .reduce((sum, u) => sum + u.priceAlaCart, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E0E0]">
          <div>
            <h2 className="font-bold text-[15px] text-foreground">Build Your Own Bundle</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">Pick exactly what you need</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Unit list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {published.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Units will be listed here soon.
            </p>
          )}
          {published.map((unit) => (
            <label
              key={unit.id}
              className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border border-[#E0E0E0] hover:border-primary/40 transition-colors"
            >
              <input
                type="checkbox"
                checked={checked.has(unit.slug)}
                onChange={() => toggle(unit.slug)}
                className="mt-0.5 accent-primary shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground leading-snug">{unit.name}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{unit.outcome}</p>
              </div>
              <span className="text-[12px] font-bold text-foreground shrink-0">
                ₹{unit.priceAlaCart.toLocaleString("en-IN")}
              </span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#E0E0E0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-muted-foreground">
              {checked.size} unit{checked.size !== 1 ? "s" : ""} selected
            </span>
            <span className="text-[16px] font-bold text-foreground">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
          <a
            href="mailto:hello@riddoff.com?subject=Build-Your-Own Bundle Enquiry"
            className="flex items-center justify-center gap-1.5 w-full bg-primary text-white rounded-lg px-4 py-2.5 text-[13px] font-semibold hover:bg-primary/90 transition-colors"
          >
            Enquire About Bundle
            <ExternalLink size={12} />
          </a>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            We'll reply within 24 hours with a custom access link.
          </p>
        </div>
      </div>
    </div>
  );
}
