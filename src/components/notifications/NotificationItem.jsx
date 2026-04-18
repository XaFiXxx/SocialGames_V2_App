import { useState } from "react";
import { Heart, UserPlus, Check, Bell, X } from "lucide-react";
import api from "../../services/api";

function formatRelativeDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "À l’instant";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours} h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Il y a ${diffInDays} j`;
  }

  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getNotificationConfig(notification) {
  const username = notification?.data?.username || "Un utilisateur";

  switch (notification.type) {
    case "follow":
      return {
        icon: Heart,
        title: "Nouveau follower",
        message: `${username} a commencé à te suivre.`,
      };

    case "friend_request":
      return {
        icon: UserPlus,
        title: "Demande d’ami",
        message: `${username} t’a envoyé une demande d’ami.`,
      };

    case "friend_accepted":
      return {
        icon: Check,
        title: "Demande acceptée",
        message: `${username} a accepté ta demande d’ami.`,
      };

    default:
      return {
        icon: Bell,
        title: "Notification",
        message: "Tu as une nouvelle notification.",
      };
  }
}

export default function NotificationItem({
  notification,
  onRead,
  onActionDone,
}) {
  const { icon: Icon, title, message } = getNotificationConfig(notification);
  const [isLoading, setIsLoading] = useState(false);

  const handleRead = async () => {
    if (!notification.is_read && onRead) {
      await onRead(notification.id);
    }
  };

  const deleteNotification = async () => {
    await api.delete(`/api/notifications/${notification.id}`);
  };

  const handleAcceptFriendRequest = async () => {
    try {
      setIsLoading(true);

      await api.post(`/api/user/${notification.data.user_id}/friend-accept`);
      await handleRead();
      await deleteNotification();

      if (onActionDone) {
        await onActionDone();
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineFriendRequest = async () => {
    try {
      setIsLoading(true);

      await api.delete(`/api/user/${notification.data.user_id}/friendship`);
      await handleRead();
      await deleteNotification();

      if (onActionDone) {
        await onActionDone();
      }
    } catch (error) {
      console.error("Erreur lors du refus de la demande :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFriendRequest = notification.type === "friend_request";

  return (
    <div
      className={`rounded-xl px-3 py-3 transition hover:bg-[var(--bg-main)] ${
        !notification.is_read ? "bg-[var(--bg-main)]/60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-main)] text-[var(--text-main)]">
          <Icon size={16} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-[var(--text-main)]">
              {title}
            </p>

            {!notification.is_read && (
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--primary)]" />
            )}
          </div>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {message}
          </p>

          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            {formatRelativeDate(notification.created_at)}
          </p>

          {isFriendRequest && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleAcceptFriendRequest}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Check size={14} />
                Accepter
              </button>

              <button
                type="button"
                onClick={handleDeclineFriendRequest}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={14} />
                Refuser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}