export default function About() {
  return (
    <section className="px-4 md:px-16 lg:px-24 xl:px-32 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold">About GuardianAI</h1>
        <p className="mt-5 text-slate-300 text-lg leading-relaxed">
          GuardianAI is a safety-focused agent layer for modern AI products. It helps teams detect unsafe input, protect users, and keep compliance checks out of the way of good UX.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Detection</h3>
            <p className="mt-3 text-slate-400">Catch risky prompts before they reach your model.</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Sanitization</h3>
            <p className="mt-3 text-slate-400">Rewrite or remove unsafe content with consistent policy rules.</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-xl font-semibold">Visibility</h3>
            <p className="mt-3 text-slate-400">Track logs, alerts, and safety performance from one place.</p>
          </div>
        </div>
      </div>
    </section>
  );
}