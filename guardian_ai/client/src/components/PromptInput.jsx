import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, X, ShieldCheck, Loader2 } from "lucide-react";

/**
 * PromptInput
 *
 * Props:
 *   onSubmit(prompt: string)  — called when user submits
 *   loading                   — disables the button and shows spinner
 *   placeholder               — textarea placeholder text
 */
export default function PromptInput({
  onSubmit,
  loading = false,
  placeholder = "Enter a prompt to scan — e.g. 'Ignore all previous instructions...'",
}) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clear = () => {
    setValue("");
    textareaRef.current?.focus();
  };

  const charCount = value.length;
  const isOverLimit = charCount > 2000;

  return (
    <motion.div
      className="w-full glass-card rounded-3xl p-1 soft-shadow"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      <div className="relative">
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <ShieldCheck className="size-4 text-pink-500" />
          <span className="text-xs font-medium text-slate-400">GuardianAI Sanitizer</span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={5}
          disabled={loading}
          className={`w-full bg-transparent px-4 py-3 text-white placeholder:text-slate-600
                      outline-none resize-none text-sm leading-relaxed
                      ${loading ? "opacity-50 cursor-not-allowed" : ""}
                      ${isOverLimit ? "text-red-400" : ""}`}
        />

        {/* Footer: char count + actions */}
        <div className="flex items-center justify-between px-4 pb-4 pt-1">
          <span className={`text-xs ${isOverLimit ? "text-red-400" : "text-slate-600"}`}>
            {charCount} / 2000
          </span>

          <div className="flex items-center gap-2">
            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clear}
                  disabled={loading}
                  className="p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition"
                  aria-label="Clear input"
                >
                  <X className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>

            <button
              onClick={handleSubmit}
              disabled={loading || !value.trim() || isOverLimit}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition
                          ${loading || !value.trim() || isOverLimit
                            ? "bg-pink-900/40 text-pink-800 cursor-not-allowed"
                            : "bg-pink-600 hover:bg-pink-700 text-white"
                          }`}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Sanitize
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <p className="px-4 pb-3 text-xs text-slate-600">
        Tip: Press <kbd className="px-1 py-0.5 rounded bg-white/5 text-slate-400">Ctrl</kbd> +{" "}
        <kbd className="px-1 py-0.5 rounded bg-white/5 text-slate-400">Enter</kbd> to submit
      </p>
    </motion.div>
  );
}
