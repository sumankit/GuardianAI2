import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { navlinks } from "../data/navlinks";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 w-full px-4 md:px-16 lg:px-24 xl:px-32 py-4
                   backdrop-blur-xl bg-black/40 border-b border-white/5"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/logo.svg" alt="GuardianAI" className="h-8 w-auto" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-slate-300">
            {navlinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `transition hover:text-pink-500 ${isActive ? "text-white" : ""}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-full border border-pink-900 hover:bg-pink-950/40
                           transition text-white font-medium text-sm"
              >
                Sign in
              </Link>
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-full bg-pink-600 hover:bg-pink-700
                           transition text-white font-medium text-sm"
              >
                Get started
              </Link>
            </SignedOut>

            <SignedIn>
              {/* Clerk's built-in avatar + dropdown (sign out, manage account, etc.) */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "size-9 border border-pink-500/40",
                  },
                }}
              />
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-full bg-white text-black hover:bg-slate-200
                           transition font-medium text-sm"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={26} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="flex flex-col h-full items-center justify-center gap-7 text-lg">
              {navlinks.map((link) => (
                <NavLink key={link.name} to={link.href} onClick={() => setOpen(false)}>
                  {link.name}
                </NavLink>
              ))}

              <SignedOut>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition text-white"
                >
                  Get started
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-full bg-pink-600 hover:bg-pink-700 transition text-white"
                >
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <button
                onClick={() => setOpen(false)}
                className="mt-4 p-3 rounded-full bg-white/10"
                aria-label="Close menu"
              >
                <X />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
