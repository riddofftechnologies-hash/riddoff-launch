import { useState } from "react";
import { motion } from "framer-motion";
import { Puzzle } from "lucide-react";
import type { FirestoreUnit } from "@/types/firestore";
import UnitPickerPanel from "./UnitPickerPanel";

interface Props {
  units: (FirestoreUnit & { id: string })[];
  index?: number;
}

export default function BuildYourOwnCard({ units, index = 3 }: Props) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: index * 0.06 }}
        whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
        className="bg-white rounded-xl overflow-hidden border-2 border-dashed border-[#C7C4D8] shadow-sm flex flex-col h-full cursor-pointer"
        onClick={() => setPanelOpen(true)}
      >
        <div className="p-5 flex flex-col flex-1">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
            <Puzzle size={20} className="text-primary" />
          </div>

          {/* Title */}
          <h3 className="font-bold text-[15px] leading-snug text-foreground mb-1">
            Build Your Own Bundle
          </h3>
          <p className="text-[12px] text-muted-foreground leading-snug mb-4">
            Pick exactly the units you need. Pay only for what you use.
          </p>

          {/* Feature list */}
          <ul className="space-y-1.5 mb-6 text-[11px] text-foreground/75">
            <li>✓ Choose any mix of {units.filter((u) => u.published).length || "20"} learning units</li>
            <li>✓ Self-paced — no deadline pressure</li>
            <li>✓ Stack with any path later</li>
          </ul>

          <div className="mt-auto">
            <p className="text-[12px] text-muted-foreground mb-3">Price on selection</p>
            <button
              type="button"
              className="w-full border-2 border-primary text-primary rounded-lg px-4 py-2.5 text-[13px] font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Browse Units →
            </button>
          </div>
        </div>
      </motion.div>

      {panelOpen && (
        <UnitPickerPanel units={units} onClose={() => setPanelOpen(false)} />
      )}
    </>
  );
}
