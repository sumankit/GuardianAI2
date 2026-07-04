import { Check, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const bullets = ["No credit card", "Setup in 10 minutes", "Policy-ready from day one"];

export default function HeroSection() {
  return (
    <section className="relative px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="absolute left-1/2 top-24 -translate-x-1/2 size-80 bg-pink-600 blur-[220px] opacity-40" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center pt-14">
        <motion.div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-pink-200/10 border border-pink-700/40 text-pink-100"
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <span className="px-3 py-1 rounded-full bg-pink-700 text-white text-xs font-medium">
            NEW
          </span>

          <span className="flex items-center gap-1">
            GuardianAI safety layer is live <ChevronRight size={16} />
          </span>
        </motion.div>

        <motion.h1
          className="mt-6 text-5xl md:text-7xl font-semibold leading-[1.05] max-w-4xl"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
        >
          Welcome to
          <span className="move-gradient px-3 ml-3 rounded-2xl text-nowrap">
            GuardianAI
          </span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-base md:text-lg text-slate-300 leading-relaxed"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 28 }}
        >
          A Multi-Agent RAG-Powered LLM Security Framework combining Generative AI,
          AI Agents, and RAG for real-time prompt attack detection, sanitization,
          and response — with full multilingual support including Hindi and Hinglish.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <a
            href="/dashboard"
            className="px-7 py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
          >
            Get started
          </a>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-4 md:gap-10">
          {bullets.map((item) => (
            <p key={item} className="flex items-center gap-2 text-slate-400">
              <Check className="size-4 text-pink-500" />
              <span>{item}</span>
            </p>
          ))}
        </div>

        <motion.div
          className="mt-14 w-full max-w-6xl"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          <div className="relative rounded-[28px] border border-white/10 overflow-hidden soft-shadow">
            <img
              src="/assets/hero-section-showcase.png"
              alt="GuardianAI showcase"
              className="w-full h-auto object-cover"
            />

            <div className="absolute right-4 md:right-8 top-4 md:top-8 glass-card rounded-[20px] p-5 md:p-6 max-w-[240px] text-left">
              <div className="flex items-center gap-2 text-pink-400">
                <ShieldCheck className="size-5" />
                <span className="font-medium">Live protection</span>
              </div>

              <h3 className="mt-3 text-3xl font-semibold">99.71%</h3>

              <p className="mt-1 text-slate-300 text-sm">
                Detection accuracy
              </p>
            </div>

            <div className="absolute left-4 md:left-8 bottom-4 md:bottom-8 bg-pink-600 rounded-2xl p-5 md:p-6 w-[90%] md:w-[70%]">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex items-center -space-x-3">
                  <img
                    src="/assets/footer-logo.svg"
                    alt=""
                    className="size-11 rounded-full border border-white/30 bg-black"
                  />

                  <div className="size-11 rounded-full bg-white text-black flex items-center justify-center font-semibold">
                    +
                  </div>
                </div>

                <div>
                  <p className="text-white text-lg font-semibold">
                    First Hinglish Prompt Injection Detector
                  </p>

                  <p className="text-white/80 text-sm">
                    Multilingual security for 850M+ Indian internet users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}