import { Routes, Route } from "react-router";
import Navbar from "./pages/templates/Nav";
import Footer from "./pages/templates/Footer";
import LoginPage from "./pages/connections/Login";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-main)] text-[var(--text-main)]">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}