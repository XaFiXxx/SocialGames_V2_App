import { useEffect, useRef } from "react";
import { formatMessageTime, getImageUrl } from "../utils/messageHelpers";

export default function MessagesList({
  messages,
  user,
  isLoadingMessages,
  messagesEndRef,
}) {
  const containerRef = useRef(null);

  // scroll intelligent
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-main)]/40 px-4 py-4"
    >
      {isLoadingMessages ? (
        <div className="py-8 text-center text-sm text-[var(--text-secondary)]">
          Chargement des messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full items-center justify-center py-8 text-center text-sm text-[var(--text-secondary)]">
          Aucun message pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isMine = Number(message.user_id) === Number(user?.id);

            const authorName =
              message.user?.username ||
              `${message.user?.name || ""} ${message.user?.surname || ""}`.trim() ||
              "Utilisateur";

            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-sm ${
                    isMine
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--bg-card)] text-[var(--text-main)]"
                  }`}
                >
                  {!isMine && (
                    <p className="mb-1 text-xs font-semibold opacity-80">
                      {authorName}
                    </p>
                  )}

                  {message.content && (
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {message.content}
                    </p>
                  )}

                  {message.image_url && (
                    <img
                      src={getImageUrl(message.image_url)}
                      alt="Message"
                      className="mt-2 max-h-72 rounded-2xl object-cover"
                    />
                  )}

                  <p
                    className={`mt-2 text-right text-[11px] ${
                      isMine
                        ? "text-white/75"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {formatMessageTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}