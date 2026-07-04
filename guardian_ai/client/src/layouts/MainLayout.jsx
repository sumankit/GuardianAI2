import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="pt-20">
      <Outlet />
    </main>
  );
}