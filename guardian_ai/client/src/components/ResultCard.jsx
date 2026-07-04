import { motion } from "motion/react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Copy, Check, RefreshCw } from "lucide-react";
import { useState } from "react";

const RISK_CONFIG = {
  HIGH:     { border: "border-red-500/30",    bg: "bg-red-500/10",     badge: "bg-red-500/20 text-red-400",    icon: ShieldAlert,   label: "HIGH RISK"    },
  CRITICAL: { border: "border-red-600/40",    bg: "bg-red-600/15",     badge: "bg-red-600/20 text-red-500",    icon: ShieldAlert,   label: "CRITICAL"     },
  MEDIUM:   { border: "border-yellow-500/30", bg: "bg-yellow-500/10",  badge: "bg-yellow-500/20 text-yellow-400", icon: AlertTriangle, label: "MEDIUM RISK"},
  LOW:      { border: "border-green-500/30",  bg: "bg-green-500/10",   badge: "bg-green-500/20 text-green-400", icon: ShieldCheck,   label: "LOW RISK"     },
};

/**
 * ResultCard
 *
 * Props:
 *   result — { original_prompt, sanitized_prompt, risk_level, attempts, validation_passed }
 *   onReset — called when user clicks "Try another"
 */
export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);
  const config = RISK_CONFIG[result.risk_level] ?? RISK_CONFIG.LOW;
  const Icon   = config.icon;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result.sanitized_prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      {/* Risk level badge */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.badge}`}>
          <Icon className="size-3.5" />
          {config.label}
        </div>
        <span className="text-xs text-slate-500">
          {result.attempts} attempt{result.attempts !== 1 ? "s" : ""} ·{" "}
          {result.validation_passed ? "✓ Passed" : "⚠ Fallback used"}
        </span>
      </div>

      {/* Original prompt */}
      <div className={`rounded-2xl border p-4 ${config.border} ${config.bg}`}>
        <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">
          Original (unsafe)
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">{result.original_prompt}</p>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-px h-6 bg-gradient-to-b from-transparent via-pink-600 to-transparent" />
      </div>

      {/* Sanitized output */}
      <div className="glass-card rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-green-400 uppercase tracking-wide">
            Sanitized (safe rewrite)
          </p>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            {copied ? <Check className="size-3.5 text-green-400" /> : <Copy className="size-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{result.sanitized_prompt}</p>
      </div>

      {/* Reset button */}
      {onReset && (
        <motion.button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          whileHover={{ x: 2 }}
        >
          <RefreshCw className="size-4" />
          Try another prompt
        </motion.button>
      )}
    </motion.div>
  );
}
