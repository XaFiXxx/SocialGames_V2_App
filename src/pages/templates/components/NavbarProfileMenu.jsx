import { Link } from "react-router";
import { ChevronDown, LogOut, User } from "lucide-react";
import NavbarThemeToggle from "./NavbarThemeToggle";

export default function NavbarProfileMenu({
  user,
  avatarSrc,
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
        type="button"
        onClick={onToggleOpen}
        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition hover:bg-white/10"
      >
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-sm font-bold text-white shadow-md">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            userInitials
          )}
        </div>

        <div className="hidden min-w-0 text-left sm:block">
          <p className="truncate text-sm font-semibold text-[var(--text-main)]">
            {displayName}
          </p>
          <p className="truncate text-xs text-[var(--text-secondary)]">
            {user?.email}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-[var(--text-secondary)] transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-84 overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <div className="border-b border-[var(--border-color)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-sm font-bold text-white">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitials
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-[var(--text-main)]">
                  {displayName}
                </p>
                <p className="mt-1 truncate text-xs text-[var(--text-secondary)]">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] p-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-[var(--text-main)] transition hover:bg-[var(--bg-card)]"
            >
              <User size={16} />
              Profil
            </Link>

            <NavbarThemeToggle isLight={isLight} onToggle={onToggleTheme} />

            <button
              type="button"
              onClick={onLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
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