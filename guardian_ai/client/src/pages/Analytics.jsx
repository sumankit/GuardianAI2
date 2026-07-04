import Loader from "../components/Loader";
import { useAnalytics } from "../hooks/useAnalytics";

// Fallback static data shown while real data loads or on error
const FALLBACK_CATEGORIES = [
  { label: "Injection",  value: 84 },
  { label: "Phishing",   value: 67 },
  { label: "Policy",     value: 91 },
  { label: "Spam",       value: 49 },
];

const METRIC_CARDS = [
  { key: "avg_confidence",   label: "Avg confidence",  suffix: "%" },
  { key: "auto_block_rate",  label: "Auto block rate", suffix: "%" },
  { key: "rewrite_success",  label: "Rewrite success", suffix: "%" },
  { key: "false_positives",  label: "False positives", suffix: "%" },
];

export default function Analytics() {
  const { data, loading, error } = useAnalytics();

  const categories = data?.by_category ?? FALLBACK_CATEGORIES;

  return (
    <section className="pb-20 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-semibold">Analytics</h1>
      <p className="mt-3 text-slate-400 max-w-2xl">
        See what GuardianAI catches most and where your guardrails are strongest.
      </p>

      {loading && <Loader variant="inline" message="Loading analytics..." />}
      {error   && <p className="mt-6 text-sm text-red-400">{error}</p>}

      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        {/* Risk categories bar chart */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold mb-6">Risk categories</h3>
          <div className="space-y-5">
            {categories.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2 text-sm">
                  <span>{item.label}</span>
                  <span className="text-slate-400">{item.value}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-pink-600 transition-all duration-700"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model confidence metrics */}
        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-semibold mb-6">Model performance</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {METRIC_CARDS.map(({ key, label, suffix }) => (
              <div key={key} className="rounded-2xl bg-white/5 p-5">
                <p className="text-slate-400 text-sm">{label}</p>
                <h4 className="mt-2 text-3xl font-semibold">
                  {data?.[key] != null ? `${data[key]}${suffix}` : "—"}
                </h4>
              </div>
            ))}
          </div>
        </div>

        {/* Summary totals */}
        {data && (
          <div className="lg:col-span-2 glass-card rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-6">Summary</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                ["Total scanned",  data.total_scanned],
                ["Total blocked",  data.total_blocked],
                ["Sanitized",      data.sanitized],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/5 p-5">
                  <p className="text-slate-400 text-sm">{label}</p>
                  <h4 className="mt-2 text-3xl font-semibold">{value?.toLocaleString() ?? "—"}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
