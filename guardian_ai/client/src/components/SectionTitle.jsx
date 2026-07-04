import { motion } from "motion/react";

export default function SectionTitle({ badge, title, subtitle }) {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <motion.p
        className="text-pink-500 font-medium px-5 py-2 rounded-full bg-pink-950/70 border border-pink-900 w-max mx-auto"
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {badge}
      </motion.p>

      <motion.h2
        className="mt-4 text-3xl md:text-5xl font-semibold leading-tight"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="mt-3 text-slate-300 text-base md:text-lg max-w-2xl mx-auto"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}