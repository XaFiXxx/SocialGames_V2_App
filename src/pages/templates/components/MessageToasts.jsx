import { MessageSquare, X } from "lucide-react";

function getPreviewMessage(message) {
  if (!message?.trim()) return "t’a envoyé un message";
  return message.length > 60 ? `${message.slice(0, 60)}...` : message;
}

function getInitials(username) {
  if (!username) return "U";
  return username.slice(0, 2).toUpperCase();
}

export default function MessageToasts({
  notifications,
  onOpenNotification,
  onRemove,
}) {
  return (
    <div className="pointer-events-none fixed right-4 top-24 z-[60] flex w-full max-w-sm flex-col gap-3">
      {notifications.map((notification) => {
        const username = notification.data?.username || "Utilisateur";
        const preview = getPreviewMessage(notification.data?.message);

        return (
          <div
            key={notification.id}
            className="pointer-events-auto overflow-hidden rounded-[24px] border border-white/10 bg-white/8 shadow-[0_18px_40px_rgba(0,0,0,0.30)] backdrop-blur-2xl"
          >
            <button
              type="button"
              onClick={() => onOpenNotification(notification)}
              className="w-full p-4 text-left transition hover:bg-white/8"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-white shadow-lg">
                  <MessageSquare size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-main)]">
                        Nouveau message
                      </p>
                      <p className="mt-1 text-xs text-cyan-300">
                        {getInitials(username)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(notification.id);
                      }}
                      className="rounded-full p-1 text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-main)]"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    <span className="font-medium text-[var(--text-main)]">
                      {username}
                    </span>
                    {" · "}
                    {preview}
                  </p>
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}