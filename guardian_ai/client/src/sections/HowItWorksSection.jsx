import SectionTitle from "../components/SectionTitle";
import { motion } from "motion/react";

const steps = [
  {
    step: "01",
    title: "User Prompt Received",
    text: "Raw prompt in any language — English, Hindi, or Hinglish — enters the GuardianAI pipeline via the Orchestrator Agent. No preprocessing required.",
  },
  {
    step: "02",
    title: "Detector Agent — Classification",
    text: "XLM-RoBERTa tokenizes and classifies the input as SAFE or ATTACK with a confidence score. 99.71% accuracy in English, 94.8% in Hinglish.",
  },
  {
    step: "03",
    title: "RAG Agent — Threat Retrieval",
    text: "The attack prompt is embedded and compared against 50,000+ vectors in FAISS. Top-3 most similar past attacks are retrieved as context in under 20ms.",
  },
  {
    step: "04",
    title: "Sanitizer + Explainer Agent",
    text: "Sanitizer Agent rewrites the attack into a safe alternative using Mistral LLM with RAG context. Explainer Agent generates a human-readable justification in the user's language.",
  },
  {
    step: "05",
    title: "Escalation Agent — Log & Learn",
    text: "Incident is logged, admin is alerted if confidence exceeds threshold, and the new attack is added to FAISS — enabling automatic continual learning without retraining.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="workflow" className="px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <SectionTitle
        badge="Workflow"
        title="How GuardianAI works"
        subtitle="A 5-step multi-agent pipeline that detects, retrieves, sanitizes, explains, and learns — all in real time with an average latency of 18ms."
      />

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 mt-14 max-w-7xl mx-auto">
        {steps.map((s, index) => (
          <motion.div
            key={s.step}
            className="glass-card rounded-3xl p-6"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 240, damping: 28 }}
          >
            <p className="text-pink-500 font-semibold">{s.step}</p>
            <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
            <p className="mt-3 text-slate-400 leading-relaxed text-sm">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}