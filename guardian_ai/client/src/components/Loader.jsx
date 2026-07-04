import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";

/**
 * Loader
 * @param {"page"|"inline"|"overlay"} variant
 * @param {string} message
 */
export default function Loader({ variant = "page", message = "Loading..." }) {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3 text-slate-400 py-4">
        <Spinner size={18} />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <LoaderCard message={message} />
      </div>
    );
  }

  // Default: full page
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoaderCard message={message} />
    </div>
  );
}

function LoaderCard({ message }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-5"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      {/* Pulsing shield icon */}
      <motion.div
        className="size-16 rounded-2xl bg-pink-600/20 border border-pink-600/30
                   flex items-center justify-center"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck className="size-8 text-pink-500" />
      </motion.div>

      {/* Spinning ring */}
      <Spinner size={28} />

      <p className="text-slate-400 text-sm">{message}</p>
    </motion.div>
  );
}

function Spinner({ size = 24 }) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-white/10 border-t-pink-500"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
    />
  );
}
