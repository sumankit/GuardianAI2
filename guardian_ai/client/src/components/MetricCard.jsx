export default function MetricCard({ title, value, hint }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <p className="text-slate-400">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  );
}