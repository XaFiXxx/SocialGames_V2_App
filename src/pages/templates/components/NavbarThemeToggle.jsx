import { Moon, Sun, Monitor } from "lucide-react";

export default function NavbarThemeToggle({ isLight, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
    >
      <span className="flex items-center gap-3">
        <Monitor size={16} />
        Thème
      </span>

      <span className="flex items-center rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] p-1">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            !isLight
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "text-[var(--text-secondary)]"
          }`}
        >
          <Moon size={15} />
        </span>

        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
            isLight
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "text-[var(--text-secondary)]"
          }`}
        >
          <Sun size={15} />
        </span>
      </span>
    </button>
  );
}