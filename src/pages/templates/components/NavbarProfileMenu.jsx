import { Link } from "react-router";
import { ChevronDown, LogOut, User } from "lucide-react";
import NavbarThemeToggle from "./NavbarThemeToggle";

export default function NavbarProfileMenu({
  user,
  displayName,
  userInitials,
  isOpen,
  onToggleOpen,
  onLogout,
  isLight,
  onToggleTheme,
  profileMenuRef,
}) {
  return (
    <div className="relative" ref={profileMenuRef}>
      <button
        onClick={onToggleOpen}
        className="flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-2 py-2 transition hover:opacity-90"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm">
          {userInitials}
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-medium text-[var(--text-main)]">
            {displayName}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
        </div>

        <ChevronDown size={16} className="text-[var(--text-secondary)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl">
          <div className="border-b border-[var(--border-color)] bg-[var(--bg-main)]/50 p-4">
            <p className="font-semibold text-[var(--text-main)]">
              {displayName}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {user?.email}
            </p>
          </div>

          <div className="p-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
            >
              <User size={16} />
              Profil
            </Link>

            <NavbarThemeToggle isLight={isLight} onToggle={onToggleTheme} />

            <button
              onClick={onLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}