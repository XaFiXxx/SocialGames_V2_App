import { Outlet } from "react-router";
import Navbar from "../pages/templates/Nav";
import Footer from "../pages/templates/Footer";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)] text-[var(--text-main)]">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}