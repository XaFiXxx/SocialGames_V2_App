import { Hash, Shield, Users } from "lucide-react";
import {
  getConversationAvatar,
  getConversationInitials,
  getConversationName,
} from "../utils/messageHelpers";

export default function ConversationHeader({ conversation, user }) {
  const currentConversationName = conversation
    ? getConversationName(conversation, user)
    : "Sélectionne une conversation";

  const currentConversationAvatar = conversation
    ? getConversationAvatar(conversation, user)
    : null;

  const currentConversationInitials = conversation
    ? getConversationInitials(conversation, user)
    : "C";

  const isGroup = conversation?.type === "group";
  const membersCount = conversation?.users?.length || 0;

  return (
    <div className="shrink-0 border-b border-[var(--border-color)] bg-[var(--bg-card)]/95 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-sm font-semibold text-[var(--text-main)] shadow-sm">
            {currentConversationAvatar ? (
              <img
                src={currentConversationAvatar}
                alt={currentConversationName}
                className="h-full w-full object-cover"
              />
            ) : isGroup ? (
              <Users size={18} />
            ) : (
              currentConversationInitials
            )}
          </div>

          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[var(--bg-card)] bg-emerald-500">
            <span className="h-2 w-2 rounded-full bg-white" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[var(--text-main)] sm:text-base">
              {currentConversationName}
            </p>

            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[var(--text-secondary)]">
              {isGroup ? (
                <>
                  <Hash size={11} />
                  Groupe
                </>
              ) : (
                <>
                  <Shield size={11} />
                  Privé
                </>
              )}
            </span>
          </div>

          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {isGroup
              ? `${membersCount} membre${membersCount > 1 ? "s" : ""}`
              : "Conversation privée active"}
          </p>
        </div>
      </div>
    </div>
  );
}