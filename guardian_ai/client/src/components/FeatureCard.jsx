import { motion } from "motion/react";

export default function FeatureCard({ feature, index }) {
  return (
    <motion.div
      className={`rounded-2xl p-px ${index === 1 ? "bg-linear-to-br from-pink-600 to-slate-800" : "bg-white/10"}`}
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 260, damping: 28 }}
    >
      <div className="glass-card rounded-[15px] p-6 h-full min-h-52">
        <img src={feature.icon} alt="" className="w-8 h-8" />
        <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
        <p className="mt-3 text-slate-400 leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}