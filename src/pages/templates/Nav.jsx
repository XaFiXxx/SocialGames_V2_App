import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, MessageSquare, TriangleAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationsDropdown from "../../components/notifications/NotificationsDropdown";
import echo from "../../services/echo";
import api from "../../services/api";
import NavbarSearch from "./components/NavbarSearch";
import NavbarProfileMenu from "./components/NavbarProfileMenu";
import MessageToasts from "./components/MessageToasts";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isLight, setIsLight] = useState(() =>
    document.documentElement.classList.contains("light")
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const profileMenuRef = useRef(null);
  const searchRef = useRef(null);
  const receivedMessageIdsRef = useRef(new Set());

  const isEmailVerified = !!user?.email_verified_at;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchMessageNotifications = async () => {
      try {
        const response = await api.get("/api/notifications");

        const unreadMessageNotifications = (response.data || []).filter(
          (notification) =>
            notification.type === "message" && !notification.is_read
        );

        receivedMessageIdsRef.current = new Set(
          unreadMessageNotifications.map((notification) =>
            Number(notification.id)
          )
        );

        setMessageUnreadCount(unreadMessageNotifications.length);
      } catch (error) {
        console.error("Erreur chargement notifications messages :", error);
      }
    };

    fetchMessageNotifications();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const channelName = `messages-notifications.${user.id}`;
    const channel = echo.private(channelName);

    channel.stopListening(".message.notification.sent");

    channel.listen(".message.notification.sent", (incomingNotification) => {
      const notificationId = Number(incomingNotification.id);

      if (receivedMessageIdsRef.current.has(notificationId)) {
        return;
      }

      receivedMessageIdsRef.current.add(notificationId);

      setMessageNotifications((prev) =>
        [
          incomingNotification,
          ...prev.filter(
            (notification) => Number(notification.id) !== notificationId
          ),
        ].slice(0, 3)
      );

      setMessageUnreadCount((prev) => prev + 1);
    });

    return () => {
      channel.stopListening(".message.notification.sent");
      echo.leave(channelName);
    };
  }, [user?.id]);

  useEffect(() => {
    if (messageNotifications.length === 0) return;

    const timeout = setTimeout(() => {
      setMessageNotifications((prev) => prev.slice(0, -1));
    }, 4000);

    return () => clearTimeout(timeout);
  }, [messageNotifications]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setIsSearchOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setIsSearching(true);

        const response = await api.get("/api/search/users", {
          params: { q: trimmedQuery },
        });

        setSearchResults(response.data ?? []);
        setIsSearchOpen(true);
      } catch (error) {
        console.error("Erreur recherche utilisateurs :", error);
        setSearchResults([]);
        setIsSearchOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

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

  const handleMessagesClick = async () => {
    try {
      const response = await api.get("/api/notifications");

      const unreadMessageNotifications = (response.data || []).filter(
        (notification) =>
          notification.type === "message" && !notification.is_read
      );

      await Promise.all(
        unreadMessageNotifications.map((notification) =>
          api.post(`/api/notifications/${notification.id}/read`)
        )
      );

      receivedMessageIdsRef.current = new Set();
      setMessageUnreadCount(0);
      setMessageNotifications([]);
      navigate("/messages");
    } catch (error) {
      console.error("Erreur lecture notifications messages :", error);
      navigate("/messages");
    }
  };

  const removeToast = (notificationId) => {
    setMessageNotifications((prev) =>
      prev.filter(
        (notification) => Number(notification.id) !== Number(notificationId)
      )
    );
  };

  const handleOpenNotification = async (notification) => {
    try {
      await api.post(`/api/notifications/${notification.id}/read`);
    } catch (error) {
      console.error("Erreur lecture notification message :", error);
    }

    receivedMessageIdsRef.current.delete(Number(notification.id));
    removeToast(notification.id);
    setMessageUnreadCount((prev) => Math.max(prev - 1, 0));
    navigate(`/messages?conversation=${notification.data?.conversation_id}`);
  };

  const handleOpenUser = (userId) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
    navigate(`/users/${userId}`);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL}/${path}`;
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

  const avatarSrc = useMemo(() => {
    return getImageUrl(user?.avatar_url);
  }, [user]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:var(--bg-card)]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="min-w-0 flex items-center gap-3">
            <Link
              to="/feed"
              className="group flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-white/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
                <img
                  src={isLight ? "/img/LogoBlanc.png" : "/img/Logo.png"}
                  alt="SquadBase"
                  className="h-8 w-auto"
                />
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tight text-[var(--text-main)]">
                  SquadBase
                </h1>
                <p className="text-xs text-[var(--text-secondary)]">
                  Gaming social network
                </p>
              </div>
            </Link>
          </div>

          <div className="hidden flex-1 justify-center px-2 md:flex">
            <NavbarSearch
              searchRef={searchRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              isSearching={isSearching}
              searchResults={searchResults}
              onOpenUser={handleOpenUser}
              getImageUrl={getImageUrl}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleMessagesClick}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--text-main)] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition hover:bg-white/10"
            >
              <MessageSquare size={18} />

              {messageUnreadCount > 0 && (
                <>
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-md">
                    {messageUnreadCount > 9 ? "9+" : messageUnreadCount}
                  </span>
                </>
              )}
            </button>

            <NotificationsDropdown />

            <NavbarProfileMenu
              user={user}
              avatarSrc={avatarSrc}
              displayName={displayName}
              userInitials={userInitials}
              isOpen={isProfileMenuOpen}
              onToggleOpen={() => setIsProfileMenuOpen((prev) => !prev)}
              onLogout={handleLogout}
              isLight={isLight}
              onToggleTheme={toggleTheme}
              profileMenuRef={profileMenuRef}
            />
          </div>
        </div>

        {!isEmailVerified && user && (
          <div className="border-t border-amber-400/15 bg-[linear-gradient(90deg,rgba(251,191,36,0.12),rgba(34,211,238,0.08))]">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                  <TriangleAlert size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-200">
                    Adresse email non vérifiée
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-100/75">
                    Certaines fonctionnalités comme publier, suivre, ajouter en
                    ami ou envoyer des messages sont limitées tant que ton email
                    n’est pas confirmé.
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/verify-email")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/15"
                >
                  <Mail size={16} />
                  Vérifier maintenant
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <MessageToasts
        notifications={messageNotifications}
        onOpenNotification={handleOpenNotification}
        onRemove={removeToast}
      />
    </>
  );
}