import { motion } from "motion/react";

export default function CTASection() {
  return (
    <section className="px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <motion.div
        className="max-w-7xl mx-auto rounded-[32px] bg-linear-to-b from-pink-900 to-pink-950 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div>
          <h2 className="text-3xl md:text-5xl font-semibold">
            Stop prompt attacks before they reach your model.
          </h2>

          <p className="mt-3 text-white/80 text-base md:text-lg">
            GuardianAI — the first multi-agent, RAG-powered, multilingual LLM
            security framework. Detect, sanitize, explain, and learn. In real
            time.
          </p>
        </div>

        <a
          href="/dashboard"
          className="px-8 py-3 rounded-full bg-white text-black hover:bg-slate-200 transition font-medium whitespace-nowrap"
        >
          Try GuardianAI
        </a>
      </motion.div>
    </section>
  );
}