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
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationsDropdown from "../../components/notifications/NotificationsDropdown";
import echo from "../../services/echo";
import api from "../../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isLight, setIsLight] = useState(() =>
    document.documentElement.classList.contains("light")
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState([]);
  const [messageUnreadCount, setMessageUnreadCount] = useState(0);

  const profileMenuRef = useRef(null);
  const receivedMessageIdsRef = useRef(new Set());

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

      setMessageNotifications((prev) => [
        incomingNotification,
        ...prev.filter(
          (notification) => Number(notification.id) !== notificationId
        ),
      ].slice(0, 3));

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
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-card)]/90 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
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

          <div className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={18}
              />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full rounded-2xl border py-3 pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMessagesClick}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] transition hover:opacity-90"
            >
              <MessageSquare size={18} />

              {messageUnreadCount > 0 && (
                <>
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {messageUnreadCount > 9 ? "9+" : messageUnreadCount}
                  </span>
                </>
              )}
            </button>

            <NotificationsDropdown />

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border px-2 py-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
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
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-[var(--bg-card)] shadow-xl">
                  <div className="border-b p-4">
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

                    <button
                      onClick={handleLogout}
                      className="flex gap-2 p-2 text-red-400"
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="pointer-events-none fixed right-4 top-24 z-[60] flex w-full max-w-sm flex-col gap-3">
        {messageNotifications.map((notification) => (
          <div
            key={notification.id}
            className="pointer-events-auto overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl"
          >
            <button
              type="button"
              onClick={async () => {
                try {
                  await api.post(`/api/notifications/${notification.id}/read`);
                } catch (error) {
                  console.error("Erreur lecture notification message :", error);
                }

                receivedMessageIdsRef.current.delete(Number(notification.id));
                removeToast(notification.id);
                setMessageUnreadCount((prev) => Math.max(prev - 1, 0));
                navigate(
                  `/messages?conversation=${notification.data?.conversation_id}`
                );
              }}
              className="w-full p-4 text-left transition hover:bg-[var(--bg-main)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-main)] text-[var(--text-main)]">
                  <MessageSquare size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text-main)]">
                      Nouveau message
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeToast(notification.id);
                      }}
                      className="text-[var(--text-secondary)] transition hover:opacity-70"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-main)]">
                      {notification.data?.username || "Utilisateur"}
                    </span>
                    {" · "}
                    {notification.data?.message?.trim()
                      ? notification.data.message.length > 60
                        ? `${notification.data.message.slice(0, 60)}...`
                        : notification.data.message
                      : "t’a envoyé un message"}
                  </p>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}