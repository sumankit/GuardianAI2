import { NavLink } from "react-router-dom";
import { LayoutDashboard, History, BarChart2, LogOut, ShieldCheck } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { useAuthContext } from "../context/AuthContext";
import { motion } from "motion/react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "History",   href: "/history",   icon: History },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
];

export default function Sidebar() {
  const { user } = useAuthContext();
  const { signOut } = useClerk();

  return (
    <motion.aside
      className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 hidden md:flex flex-col
                 bg-black/60 backdrop-blur-xl border-r border-white/5 px-4 py-6 z-40"
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 mb-8">
        <ShieldCheck className="size-6 text-pink-500" />
        <span className="font-semibold text-white">GuardianAI</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium
               ${isActive
                ? "bg-pink-600/20 text-pink-400 border border-pink-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + sign out */}
      <div className="border-t border-white/5 pt-4 mt-4">
        {user && (
          <div className="flex items-center gap-3 px-2 mb-4">
            <img
              src={user.imageUrl}
              alt={user.firstName}
              className="size-8 rounded-full border border-white/10"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-400
                     hover:text-red-400 hover:bg-red-500/5 transition text-sm font-medium"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </motion.aside>
  );
}
