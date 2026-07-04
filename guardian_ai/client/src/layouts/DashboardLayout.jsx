import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen pt-20">
      <Sidebar />
      {/* Offset by sidebar width on md+ screens */}
      <main className="flex-1 md:ml-64 px-4 md:px-10 py-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
