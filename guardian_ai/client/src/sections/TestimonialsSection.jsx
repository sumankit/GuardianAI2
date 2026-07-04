import SectionTitle from "../components/SectionTitle";
import { testimonials } from "../data/testimonials";
import { motion } from "motion/react";

export default function TestimonialsSection() {
  return (
    <section className="px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <SectionTitle
        badge="Testimonials"
        title="Teams trust GuardianAI"
        subtitle="The same premium SaaS look, but now with a security-first story."
      />

      <div className="max-w-7xl mx-auto mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {testimonials.map((item, index) => (
          <motion.div
            key={item.name}
            className="glass-card rounded-2xl p-5"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, type: "spring", stiffness: 240, damping: 28 }}
          >
            <p className="text-white font-medium">{item.name}</p>
            <p className="text-xs text-slate-500">{item.handle}</p>
            <p className="mt-4 text-slate-400 leading-relaxed">{item.quote}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}