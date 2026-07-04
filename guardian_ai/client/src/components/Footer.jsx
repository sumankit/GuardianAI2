import { Link } from "react-router-dom";
import { Linkedin, Twitter, Youtube, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

const columns = [
  {
    title: "Product",
    links: [
      { name: "Home",      href: "/"          },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Analytics", href: "/analytics" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "History",  href: "/history"   },
      { name: "About",    href: "/about"     },
      { name: "Features", href: "/#features" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "#" },
      { name: "Terms",   href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 px-4 md:px-16 lg:px-24 xl:px-32 py-8 border-t border-white/5 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
        <motion.div
          className="flex flex-wrap items-start gap-10 md:gap-20"
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <a href="/">
            <img src="/assets/footer-logo.svg" alt="GuardianAI" className="w-8 h-8" />
          </a>

          {columns.map((section) => (
            <div key={section.title}>
              <p className="text-white font-semibold">{section.title}</p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-pink-500 transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="max-w-sm"
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
        >
          <p className="text-slate-300">
            GuardianAI protects your product from unsafe prompts, harmful outputs, and policy breaches.
          </p>

          <div className="flex items-center gap-4 mt-5 text-slate-300">
            <a href="#" aria-label="Website">
              <ExternalLink className="size-5 hover:text-pink-500" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="size-5 hover:text-pink-500" />
            </a>
            <a href="#" aria-label="X">
              <Twitter className="size-5 hover:text-pink-500" />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube className="size-5 hover:text-pink-500" />
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            © {new Date().getFullYear()} GuardianAI
          </p>
        </motion.div>
      </div>
    </footer>
  );
}