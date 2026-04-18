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
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours} h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `Il y a ${diffInDays} j`;

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
      onActionDone?.();
    } catch (error) {
      console.error(error);
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
      onActionDone?.();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFriendRequest = notification.type === "friend_request";

  return (
    <div
      onClick={handleRead}
      className={`cursor-pointer rounded-xl px-3 py-3 transition hover:bg-[var(--bg-main)] ${
        !notification.is_read ? "bg-[var(--bg-main)]/60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-main)]">
          <Icon size={16} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between">
            <p className="text-sm font-semibold">{title}</p>
            {!notification.is_read && (
              <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            )}
          </div>

          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {formatRelativeDate(notification.created_at)}
          </p>

          {isFriendRequest && (
            <div className="mt-2 flex gap-2">
              <button onClick={handleAcceptFriendRequest}>✔</button>
              <button onClick={handleDeclineFriendRequest}>✖</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}