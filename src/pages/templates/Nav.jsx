import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  Moon,
  Sun,
  MessageSquare,
  ChevronDown,
  User,
  LogOut,
  Monitor,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationsDropdown from "../../components/notifications/NotificationsDropdown";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isLight, setIsLight] = useState(() =>
    document.documentElement.classList.contains("light")
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("light");

    const isNowLight = html.classList.contains("light");
    setIsLight(isNowLight);

    localStorage.setItem("theme", isNowLight ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setIsProfileMenuOpen(false);
    }
  };

  const displayName = useMemo(() => {
    if (!user) return "Utilisateur";

    if (user.username) return user.username;
    if (user.name && user.surname) return `${user.name} ${user.surname}`;
    if (user.name) return user.name;

    return "Utilisateur";
  }, [user]);

  const userInitials = useMemo(() => {
    if (!user) return "U";

    if (user.name && user.surname) {
      return `${user.name[0] ?? ""}${user.surname[0] ?? ""}`.toUpperCase();
    }

    if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }

    if (user.name) {
      return user.name.slice(0, 2).toUpperCase();
    }

    return "U";
  }, [user]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/feed" className="flex items-center gap-3">
            <img
              src={isLight ? "/img/LogoBlanc.png" : "/img/Logo.png"}
              alt="SquadBase"
              className="h-10 w-auto"
            />

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight text-[var(--text-main)]">
                SquadBase
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Gaming social network
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              placeholder="Rechercher un joueur, un groupe, une team..."
              className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] py-3 pl-11 pr-4 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] transition hover:opacity-90 md:hidden"
          >
            <Search size={18} />
          </button>

          <NotificationsDropdown />

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] transition hover:opacity-90 sm:inline-flex"
          >
            <MessageSquare size={18} />
          </button>

          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-2 py-2 text-left transition hover:opacity-90"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-semibold text-white">
                {userInitials}
              </div>

              <div className="hidden sm:block">
                <p className="max-w-[140px] truncate text-sm font-medium text-[var(--text-main)]">
                  {displayName}
                </p>
                <p className="max-w-[140px] truncate text-xs text-[var(--text-secondary)]">
                  {user?.email ?? "Compte utilisateur"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="hidden text-[var(--text-secondary)] sm:block"
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl">
                <div className="border-b border-[var(--border-color)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--text-main)]">
                    {displayName}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
                  >
                    <User size={16} />
                    Mon profil
                  </Link>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
                  >
                    <span className="flex items-center gap-3">
                      <Monitor size={16} />
                      Apparence
                    </span>

                    <span className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      {isLight ? (
                        <>
                          Clair
                          <Moon size={14} />
                        </>
                      ) : (
                        <>
                          Sombre
                          <Sun size={14} />
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition hover:bg-[var(--bg-main)]"
                  >
                    <LogOut size={16} />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}