import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { Link } from "react-router-dom";

export function Reveal({ children, className = "", delay = 0, y = 22 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.13 }}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function DrawRule({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`rx-draw-rule ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.12, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export function KineticWords({ children, className = "" }: { children: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = children.split(" ");
  if (reduce) return <span className={className}>{children}</span>;
  return (
    <span className={`rx-kinetic ${className}`}>
      {words.map((word, index) => (
        <span className="rx-word-window" key={index}>
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >{word}</motion.span>{" "}
        </span>
      ))}
    </span>
  );
}

export function ActionLink({ to, children, quiet = false }: { to: string; children: ReactNode; quiet?: boolean }) {
  return (
    <Link to={to} className={quiet ? "rx-action rx-action-quiet" : "rx-action rx-action-primary"}>
      {children}<ArrowUpRight size={18} aria-hidden="true"/>
    </Link>
  );
}

export function VisualFrame({ src, alt, caption, label = "Internal interface capture", className = "" }: { src: string; alt: string; caption: string; label?: string; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <div className={`rx-visual-frame ${className}`}>
      <div className="rx-visual-toolbar"><span className="rx-visual-dots" aria-hidden="true"><i/><i/><i/></span><span>{label}</span><button type="button" title="Expand image" aria-label={`Expand ${alt}`} onClick={() => dialog.current?.showModal()}><Maximize2 size={15}/></button></div>
      <button type="button" className="rx-visual-image-button" onClick={() => dialog.current?.showModal()} aria-label={`View larger image: ${alt}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async"/>
      </button>
      <p className="rx-visual-caption">{caption}</p>
      <dialog ref={dialog} className="rx-image-dialog" onClick={(event) => { if (event.target === dialog.current) dialog.current?.close(); }} aria-label={alt}>
        <div className="rx-image-dialog-bar"><span>{caption}</span><button type="button" onClick={() => dialog.current?.close()} aria-label="Close enlarged image"><X size={19}/></button></div>
        <img src={src} alt={alt} />
      </dialog>
    </div>
  );
}
