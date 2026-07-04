import Loader from "../components/Loader";
import { useHistory } from "../hooks/useHistory";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RISK_COLOR = {
  Critical: "text-red-400",
  High:     "text-orange-400",
  Medium:   "text-yellow-400",
  Low:      "text-green-400",
};

const TYPE_COLOR = {
  Blocked:   "bg-red-500/20 text-red-400",
  Sanitized: "bg-yellow-500/20 text-yellow-400",
  Allowed:   "bg-green-500/20 text-green-400",
};

export default function History() {
  const { logs, total, page, loading, error, nextPage, prevPage } = useHistory(20);

  return (
    <section className="pb-20 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-semibold">History</h1>
      <p className="mt-3 text-slate-400 max-w-2xl">
        Full audit trail — every prompt scanned, rewritten, or blocked.
      </p>

      {loading && <Loader variant="inline" message="Loading history..." />}
      {error   && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 glass-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Prompt</th>
                  <th className="px-5 py-4">Risk</th>
                  <th className="px-5 py-4">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                      No history yet. Go sanitize some prompts!
                    </td>
                  </tr>
                )}
                {logs.map((row, i) => (
                  <tr key={row.id ?? i} className="border-t border-white/5 hover:bg-white/3 transition">
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                                       ${TYPE_COLOR[row.type] ?? "bg-white/10 text-slate-300"}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-300 max-w-xs truncate">{row.prompt}</td>
                    <td className={`px-5 py-4 font-medium ${RISK_COLOR[row.risk] ?? "text-slate-300"}`}>
                      {row.risk}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <span>Total: {total} records</span>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5
                           disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-3">Page {page}</span>
              <button
                onClick={nextPage}
                disabled={logs.length < 20}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5
                           disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
