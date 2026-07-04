import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, X, AlertTriangle, Info } from "lucide-react";

const RISK_CONFIG = {
  HIGH:     { color: "border-red-500/40 bg-red-500/10",    icon: ShieldAlert,    text: "text-red-400",    label: "HIGH RISK"     },
  CRITICAL: { color: "border-red-600/50 bg-red-600/15",    icon: ShieldAlert,    text: "text-red-500",    label: "CRITICAL"      },
  MEDIUM:   { color: "border-yellow-500/40 bg-yellow-500/10", icon: AlertTriangle, text: "text-yellow-400", label: "MEDIUM RISK"  },
  LOW:      { color: "border-blue-500/30 bg-blue-500/10",  icon: Info,           text: "text-blue-400",   label: "LOW RISK"      },
};

export function AttackAlert({ alert, onDismiss }) {
  const config = RISK_CONFIG[alert.risk_level] ?? RISK_CONFIG.LOW;
  const Icon   = config.icon;

  const time = alert.timestamp
    ? new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "now";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,   scale: 1     }}
      exit={{    opacity: 0, x: 30,  scale: 0.95  }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={`rounded-2xl border p-4 ${config.color} flex items-start gap-3`}
    >
      <Icon className={`size-5 mt-0.5 shrink-0 ${config.text}`} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
          <span className="text-xs text-slate-500 uppercase tracking-wide">{alert.type}</span>
          <span className="ml-auto text-xs text-slate-600">{time}</span>
        </div>
        <p className="mt-1 text-sm text-slate-300 truncate">{alert.prompt}</p>
      </div>

      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="shrink-0 text-slate-500 hover:text-white transition"
          aria-label="Dismiss alert"
        >
          <X className="size-4" />
        </button>
      )}
    </motion.div>
  );
}

export function AttackAlertList({ alerts = [], max = 5, onClear }) {
  const [dismissed, setDismissed] = useState(new Set());

  const visible = alerts
    .filter((a) => !dismissed.has(a.id))
    .slice(0, max);

  const dismiss = (id) => setDismissed((prev) => new Set([...prev, id]));

  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Live alerts ({visible.length})
        </p>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            Clear all
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {visible.map((alert) => (
          <AttackAlert key={alert.id} alert={alert} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}