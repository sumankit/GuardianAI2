import { motion } from "motion/react";
import { ShieldAlert, Activity, Lock, Sparkles } from "lucide-react";
import PromptInput from "../components/PromptInput";
import ResultCard from "../components/ResultCard";
import { AttackAlertList } from "../components/AttackAlert";
import Loader from "../components/Loader";
import { useSanitize } from "../hooks/useSanitize";
import { useDashboard } from "../hooks/useDashboard";
import { useAlerts } from "../hooks/useAlerts";

const STAT_ICONS = [Activity, ShieldAlert, Lock, Sparkles];
const STAT_KEYS  = ["requests_scanned", "unsafe_blocked", "rules_active", "auto_rewrites"];
const STAT_LABELS = ["Requests scanned", "Unsafe blocked", "Rules active", "Auto rewrites"];

export default function Dashboard() {
  const { sanitize, result, loading, error, reset } = useSanitize();
  const { stats, trend, loading: statsLoading } = useDashboard();
  const { alerts, connected, clearAlerts } = useAlerts();

  return (
    <section className="pb-20 max-w-7xl mx-auto">
      {/* Page title */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <h1 className="text-4xl md:text-5xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-slate-400 max-w-2xl">
          Scan prompts, monitor threats, and view live alerts.
        </p>
        {connected && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-400">
            <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            Live alerts connected
          </div>
        )}
      </motion.div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_KEYS.map((key, i) => {
          const Icon = STAT_ICONS[i];
          return (
            <motion.div
              key={key}
              className="glass-card rounded-2xl p-5"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 28 }}
            >
              <Icon className="size-5 text-pink-500" />
              <p className="mt-4 text-slate-400 text-sm">{STAT_LABELS[i]}</p>
              <h3 className="mt-1 text-2xl font-semibold">
                {statsLoading ? "—" : (stats?.[key] ?? "—")}
              </h3>
            </motion.div>
          );
        })}
      </div>

      {/* Main grid: sanitizer + alerts */}
      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Sanitizer column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-slate-300">Sanitize a prompt</h2>

          {!result ? (
            <PromptInput onSubmit={sanitize} loading={loading} />
          ) : (
            <ResultCard result={result} onReset={reset} />
          )}

          {error && (
            <p className="text-sm text-red-400 mt-2">{error}</p>
          )}

          {/* Threat trend chart */}
          {!statsLoading && trend.length > 0 && (
            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-base font-semibold mb-6">Threat trend</h3>
              <div className="flex items-end gap-2 h-48">
                {trend.map((point, i) => {
                  const max = Math.max(...trend.map((p) => p.count || p));
                  const h   = ((point.count ?? point) / (max || 1)) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                      <div
                        className={`w-full rounded-t-xl transition-all ${i === trend.length - 1 ? "bg-pink-600" : "bg-slate-200/60"}`}
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-xs text-slate-600">{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Alerts column */}
        <div className="space-y-4">
          <AttackAlertList alerts={alerts} max={8} onClear={clearAlerts} />

          {/* Live status card */}
          <div className="glass-card rounded-3xl p-5">
            <h3 className="text-base font-semibold mb-4">Live status</h3>
            <div className="space-y-3 text-sm">
              {[
                ["Model",    "Guardian v2"],
                ["Mode",     "Sanitize"],
                ["Latency",  "18ms"],
                ["Accuracy", "99.71%"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
