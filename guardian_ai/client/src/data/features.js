export const features = [
  {
    icon: "/assets/zap-icon.svg",
    title: "Detector Agent",
    description: "XLM-RoBERTa fine-tuned on 80K+ multilingual samples. Classifies prompts as SAFE or ATTACK with 99.71% accuracy in English and 94.8% in Hinglish — in real time.",
  },
  {
    icon: "/assets/thumb-icon.svg",
    title: "RAG + Sanitizer Agent",
    description: "FAISS vector database with 50,000+ attack embeddings retrieves similar past threats. The Sanitizer Agent rewrites harmful prompts into safe alternatives with 97.3% success rate.",
  },
  {
    icon: "/assets/shape-icon.svg",
    title: "Explainer + Escalation Agent",
    description: "Explainer Agent generates human-readable justifications in the user's language. Escalation Agent logs incidents, alerts admins, and auto-updates the threat database — no retraining needed.",
  },
];