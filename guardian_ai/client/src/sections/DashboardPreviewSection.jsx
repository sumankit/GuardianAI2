import SectionTitle from "../components/SectionTitle";
import MetricCard from "../components/MetricCard";
import { stats } from "../data/stats";
import { motion } from "motion/react";

export default function DashboardPreviewSection() {
  return (
    <section className="px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <SectionTitle
        badge="Dashboard"
        title="Monitor safety in real time"
        subtitle="A polished admin feel with alerts, metrics, and logs that look great on demo day."
      />

      <div className="max-w-7xl mx-auto mt-14 grid lg:grid-cols-3 gap-5">
        <motion.div
          className="lg:col-span-2 glass-card rounded-[28px] p-5 md:p-7 overflow-hidden"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">Monthly Invoice</p>
              <h3 className="text-4xl font-semibold mt-2">$180.00</h3>
            </div>
            <div className="px-4 py-2 rounded-full bg-pink-600/20 text-pink-400 border border-pink-500/20">
              Live dashboard
            </div>
          </div>

          <div className="mt-8 grid grid-cols-12 gap-4 items-end h-64">
            {[80, 30, 52, 44, 68, 56, 92, 58, 26, 48, 40, 64].map((h, i) => (
              <div key={i} className="flex items-end justify-center h-full">
                <div
                  className={`w-6 rounded-full ${i === 6 ? "bg-pink-600" : "bg-slate-200/70"}`}
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid gap-5"
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
        >
          {stats.map((item, index) => (
            <MetricCard key={item.label} {...item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}