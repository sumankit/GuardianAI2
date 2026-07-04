import { motion } from "motion/react";

export default function StatCard({ label, value, index }) {
  return (
    <motion.div
      className="glass-card rounded-2xl p-5 soft-shadow"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 260, damping: 28 }}
    >
      <p className="text-slate-400">{label}</p>
      <h3 className="mt-2 text-2xl font-semibold">{value}</h3>
    </motion.div>
  );
}