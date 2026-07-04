import SectionTitle from "../components/SectionTitle";
import { pricing } from "../data/pricing";
import { Check } from "lucide-react";
import { motion } from "motion/react";

export default function PricingSection() {
  return (
    <section id="pricing" className="px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <SectionTitle
        badge="Pricing"
        title="Simple plans for every team"
        subtitle="Start small, scale safely, and upgrade when your app starts growing."
      />

      <div className="max-w-7xl mx-auto mt-14 grid md:grid-cols-3 gap-6">
        {pricing.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`rounded-3xl border p-6 ${plan.popular ? "bg-pink-950 border-pink-700" : "glass-card border-white/10"}`}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 240, damping: 28 }}
          >
            {plan.popular && (
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-medium">
                Most popular
              </span>
            )}

            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <div className="mt-3 text-4xl font-semibold">
              ${plan.price}
              <span className="text-base text-slate-400 font-normal">/{plan.period}</span>
            </div>

            <ul className="mt-6 space-y-3 text-slate-300">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-pink-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              className={`mt-8 w-full py-3 rounded-full font-medium transition ${
                plan.popular
                  ? "bg-white text-pink-600 hover:bg-slate-200"
                  : "bg-pink-600 hover:bg-pink-700 text-white"
              }`}
            >
              Get started
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}