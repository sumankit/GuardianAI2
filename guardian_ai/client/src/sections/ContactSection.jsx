import SectionTitle from "../components/SectionTitle";
import { ArrowRight, Mail, User } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
  return (
    <section className="px-4 md:px-16 lg:px-24 xl:px-32 mt-28">
      <SectionTitle
        badge="Contact"
        title="Let’s build your GuardianAI setup"
        subtitle="Use this form as the frontend foundation for lead capture or product inquiries."
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="max-w-3xl mx-auto mt-14 grid sm:grid-cols-2 gap-4"
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <label className="block mb-2 text-slate-300">Your name</label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5">
            <User className="size-5 text-slate-400" />
            <input
              type="text"
              placeholder="Enter your name"
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <label className="block mb-2 text-slate-300">Email</label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-white/5">
            <Mail className="size-5 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent outline-none w-full text-white placeholder:text-slate-500"
            />
          </div>
        </motion.div>

        <motion.div
          className="sm:col-span-2"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <label className="block mb-2 text-slate-300">Message</label>
          <textarea
            rows="6"
            placeholder="Tell us what you want GuardianAI to protect"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none text-white placeholder:text-slate-500 resize-none"
          />
        </motion.div>

        <motion.button
          type="submit"
          className="sm:col-span-2 w-max inline-flex items-center gap-2 px-7 py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition text-white font-medium"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          Submit
          <ArrowRight className="size-4" />
        </motion.button>
      </form>
    </section>
  );
}