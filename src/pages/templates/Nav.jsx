export default function Navbar() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
  };

  const isLight = document.documentElement.classList.contains("light");

  return (
    <header className="border-b border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">SquadBase</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Gaming social network
          </p>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm font-medium transition hover:opacity-90"
        >
          {isLight ? "Dark mode" : "Light mode"}
        </button>
      </div>
    </header>
  );
}