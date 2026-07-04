import SectionTitle from "../components/SectionTitle";
import FeatureCard from "../components/FeatureCard";
import { features } from "../data/features";
import { motion } from "motion/react";

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <SectionTitle
        badge="Features"
        title="Everything GuardianAI needs"
        subtitle="A multi-agent RAG-powered security framework for real-time prompt attack detection, sanitization, and multilingual threat intelligence."
      />

      <div className="grid md:grid-cols-3 gap-5 mt-14 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>

      <div className="mt-24 grid lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
        >
          <p className="text-slate-300 text-lg leading-relaxed">
            GuardianAI is the first multi-agent LLM security system that detects, explains, sanitizes, and learns from prompt injection attacks — including Hindi and Hinglish — without ever needing manual retraining.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-white font-semibold">Prompt Injection Detection</h4>
              <p className="mt-2 text-slate-400">Detect jailbreaks, instruction overrides, roleplay attacks, and encoded payloads across English, Hindi, and Hinglish.</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-white font-semibold">Generative Sanitization</h4>
              <p className="mt-2 text-slate-400">Convert harmful prompts into safe, semantically equivalent alternatives — preserving user intent while neutralizing attacks.</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-white font-semibold">RAG Threat Memory</h4>
              <p className="mt-2 text-slate-400">50,000+ attack embeddings in FAISS. Retrieves similar past threats in under 20ms to provide context-aware decisions.</p>
            </div>
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-white font-semibold">Multilingual Support</h4>
              <p className="mt-2 text-slate-400">First system to support Hindi and Hinglish prompt injection detection — protecting 850M+ Indian internet users.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-4"
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 28 }}
        >
          <img src="/assets/features-showcase-1.png" alt="GuardianAI showcase 1" className="rounded-3xl border border-white/10 w-full h-full object-cover" />
          <img src="/assets/features-showcase-2.png" alt="GuardianAI showcase 2" className="rounded-3xl border border-white/10 w-full h-full object-cover" />
        </motion.div>
      </div>
    </section>
  );
}