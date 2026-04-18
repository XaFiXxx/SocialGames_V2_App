export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-[var(--text-secondary)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-[var(--text-main)]">SquadBase</p>
          <p className="text-xs">Community platform for gamers.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="transition hover:text-[var(--text-main)]">
            About
          </a>
          <a href="#" className="transition hover:text-[var(--text-main)]">
            Privacy
          </a>
          <a href="#" className="transition hover:text-[var(--text-main)]">
            Terms
          </a>
          <a href="#" className="transition hover:text-[var(--text-main)]">
            Contact
          </a>
        </div>

        <div className="text-xs">
          © {new Date().getFullYear()} SquadBase. All rights reserved.
        </div>
      </div>
    </footer>
  );
}