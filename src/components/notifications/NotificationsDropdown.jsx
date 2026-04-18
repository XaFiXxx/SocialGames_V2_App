import { useEffect, useMemo, useRef, useState } from "react";
import { Bell } from "lucide-react";
import api from "../../services/api";
import NotificationItem from "./NotificationItem";
import echo from "../../services/echo";
import { useAuth } from "../../context/AuthContext";

export default function NotificationsDropdown() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadingAll, setIsReadingAll] = useState(false);

  const dropdownRef = useRef(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/api/notifications");
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Erreur chargement notifications :", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    const channelName = `notifications.${user.id}`;
    const channel = echo.private(channelName);

    channel.listen(".notification.sent", (incomingNotification) => {
      setNotifications((prev) => {
        const exists = prev.some(
          (notification) =>
            Number(notification.id) === Number(incomingNotification.id)
        );

        if (exists) return prev;

        return [incomingNotification, ...prev];
      });
    });

    return () => {
      echo.leave(channelName);
    };
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = async () => {
    const next = !isOpen;
    setIsOpen(next);

    if (next) {
      await fetchNotifications();
    }
  };

  const handleReadOne = async (id) => {
    try {
      await api.post(`/api/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          Number(notification.id) === Number(id)
            ? {
                ...notification,
                is_read: true,
                read_at: notification.read_at || new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Erreur lecture notification :", error);
    }
  };

  const handleReadAll = async () => {
    try {
      setIsReadingAll(true);

      await api.post("/api/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          is_read: true,
          read_at: notification.read_at || new Date().toISOString(),
        }))
      );
    } catch (error) {
      console.error("Erreur lecture de toutes les notifications :", error);
    } finally {
      setIsReadingAll(false);
    }
  };

  return (
    <div className="relative hidden sm:block" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] transition hover:opacity-90"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <>
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[380px] overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                Notifications
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {unreadCount > 0
                  ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                  : "Tout est lu"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReadAll}
              disabled={isReadingAll || unreadCount === 0}
              className="text-xs font-medium text-[var(--primary)] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tout marquer comme lu
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto p-2">
            {isLoading ? (
              <div className="px-3 py-8 text-center text-sm text-[var(--text-secondary)]">
                Chargement des notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-[var(--text-secondary)]">
                Aucune notification pour le moment.
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleReadOne}
                  onActionDone={fetchNotifications}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}