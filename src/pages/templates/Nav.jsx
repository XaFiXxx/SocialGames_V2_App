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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Link to="/feed" className="flex items-center gap-3">
            <img
              src={isLight ? "/img/LogoBlanc.png" : "/img/Logo.png"}
              alt="SquadBase"
              className="h-10"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">SquadBase</h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Gaming social network
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full rounded-2xl border py-3 pl-10"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Messages */}
          <Link
            to="/messages"
            className="h-10 w-10 flex items-center justify-center rounded-xl border"
          >
            <MessageSquare size={18} />
          </Link>

          {/* Notifications (temps réel ici) */}
          <NotificationsDropdown />

          {/* Profil */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              className="flex items-center gap-3 rounded-2xl border px-2 py-2"
            >
              <div className="h-10 w-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-xl">
                {userInitials}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {user?.email}
                </p>
              </div>

              <ChevronDown size={16} />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-[var(--bg-card)] rounded-2xl shadow-xl">
                <div className="p-4 border-b">
                  <p className="font-semibold">{displayName}</p>
                  <p className="text-xs">{user?.email}</p>
                </div>

                <div className="p-2">
                  <Link to="/profile" className="flex gap-2 p-2">
                    <User size={16} /> Profil
                  </Link>

                  <button onClick={toggleTheme} className="flex gap-2 p-2">
                    <Monitor size={16} />
                    {isLight ? "Clair" : "Sombre"}
                  </button>

                  <button onClick={handleLogout} className="flex gap-2 p-2 text-red-400">
                    <LogOut size={16} /> Déconnexion
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