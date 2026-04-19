import { MessageSquare, X } from "lucide-react";

export default function MessageToasts({
  notifications,
  onOpenNotification,
  onRemove,
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[60] flex w-full max-w-sm flex-col gap-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xl"
        >
          <button
            type="button"
            onClick={() => onOpenNotification(notification)}
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
                      onRemove(notification.id);
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
  );
}