import { useEffect, useRef } from "react";
import { CheckCheck } from "lucide-react";
import { formatMessageTime, getImageUrl } from "../utils/messageHelpers";

export default function MessagesList({
  messages,
  user,
  isLoadingMessages,
  messagesEndRef,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg-main)]/40 px-4 py-5"
    >
      {isLoadingMessages ? (
        <div className="py-8 text-center text-sm text-[var(--text-secondary)]">
          Chargement des messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center py-8 text-center">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-5 py-4 shadow-sm">
            <p className="text-sm font-medium text-[var(--text-main)]">
              Aucun message pour le moment
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Lance la conversation avec ton premier message.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((message, index) => {
            const isMine = Number(message.user_id) === Number(user?.id);

            const authorName =
              message.user?.username ||
              `${message.user?.name || ""} ${message.user?.surname || ""}`.trim() ||
              "Utilisateur";

            const avatar = getImageUrl(message.user?.avatar_url);

            const previousMessage = messages[index - 1];
            const isSameAuthorAsPrevious =
              previousMessage &&
              Number(previousMessage.user_id) === Number(message.user_id);

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!isMine && !isSameAuthorAsPrevious && (
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-[var(--bg-card)]">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={authorName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[var(--text-main)]">
                        {authorName.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {!isMine && isSameAuthorAsPrevious && <div className="w-9" />}

                <div className="max-w-[80%]">
                  {!isMine && !isSameAuthorAsPrevious && (
                    <p className="mb-1 text-xs font-semibold text-[var(--text-secondary)]">
                      {authorName}
                    </p>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isMine
                        ? "rounded-br-md bg-[var(--primary)] text-white"
                        : "rounded-bl-md border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)]"
                    }`}
                  >
                    {message.content && (
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.content}
                      </p>
                    )}

                    {message.image_url && (
                      <img
                        src={getImageUrl(message.image_url)}
                        alt="Message"
                        className={`${
                          message.content ? "mt-3" : ""
                        } max-h-80 rounded-xl object-cover`}
                      />
                    )}

                    <div
                      className={`mt-2 flex items-center justify-end gap-2 text-[11px] ${
                        isMine
                          ? "text-white/75"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      <span>{formatMessageTime(message.created_at)}</span>

                      {isMine && message.seen_at && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90">
                          <CheckCheck size={12} />
                          {/* vu */}
                        </span>
                      )}
                    </div>
                  </div>
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