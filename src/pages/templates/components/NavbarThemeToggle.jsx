import { Moon, Sun, Monitor } from "lucide-react";

export default function NavbarThemeToggle({ isLight, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm text-[var(--text-main)] transition hover:bg-white/10"
    >
      <span className="flex items-center gap-3">
        <Monitor size={16} />
        Thème
      </span>

      <span className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            !isLight
              ? "bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-white shadow-md"
              : "text-[var(--text-secondary)]"
          }`}
        >
          <Moon size={15} />
        </span>

        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            isLight
              ? "bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-white shadow-md"
              : "text-[var(--text-secondary)]"
          }`}
        >
          <Sun size={15} />
        </span>
      </span>
    </button>
  );
}