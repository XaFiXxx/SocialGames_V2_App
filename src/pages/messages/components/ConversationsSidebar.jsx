import { MessageSquare, Search, Users } from "lucide-react";
import {
  formatConversationTime,
  getConversationAvatar,
  getConversationInitials,
  getConversationName,
  getLastMessagePreview,
} from "../utils/messageHelpers";

export default function ConversationsSidebar({
  user,
  search,
  setSearch,
  isLoadingConversations,
  filteredConversations,
  selectedConversation,
  onSelectConversation,
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-b border-[var(--border-color)] lg:border-b-0 lg:border-r">
      <div className="border-b border-[var(--border-color)] p-4 shrink-0">
        <h1 className="text-xl font-bold text-[var(--text-main)]">Messages</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Tes conversations privées et de groupe.
        </p>

        <div className="relative mt-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] py-3 pl-10 pr-4 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)]"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-2">
        {isLoadingConversations ? (
          <div className="px-3 py-8 text-center text-sm text-[var(--text-secondary)]">
            Chargement des conversations...
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-main)] text-[var(--text-secondary)]">
              <MessageSquare size={22} />
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--text-main)]">
              Aucune conversation trouvée
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Lance une discussion depuis le profil d’un utilisateur.
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const isActive =
              Number(selectedConversation?.id) === Number(conversation.id);
            const avatar = getConversationAvatar(conversation, user);
            const initials = getConversationInitials(conversation, user);
            const name = getConversationName(conversation, user);

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  isActive
                    ? "bg-[var(--bg-main)] shadow-sm"
                    : "hover:bg-[var(--bg-main)]/70"
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg-main)] text-sm font-semibold text-[var(--text-main)]">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      className="h-full w-full object-cover"
                    />
                  ) : conversation.type === "group" ? (
                    <Users size={18} />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                      {name}
                    </p>
                    <span className="shrink-0 text-xs text-[var(--text-secondary)]">
                      {formatConversationTime(
                        conversation.last_message?.created_at ||
                          conversation.updated_at
                      )}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">
                    {getLastMessagePreview(conversation)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}