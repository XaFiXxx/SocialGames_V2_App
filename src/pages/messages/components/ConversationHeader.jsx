import { Users } from "lucide-react";
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

  return (
    <div className="shrink-0 flex items-center gap-3 border-b border-[var(--border-color)] px-4 py-4">
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg-main)] text-sm font-semibold text-[var(--text-main)]">
        {currentConversationAvatar ? (
          <img
            src={currentConversationAvatar}
            alt={currentConversationName}
            className="h-full w-full object-cover"
          />
        ) : conversation.type === "group" ? (
          <Users size={18} />
        ) : (
          currentConversationInitials
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--text-main)]">
          {currentConversationName}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          {conversation.type === "group"
            ? `${conversation.users?.length || 0} membres`
            : "Conversation privée"}
        </p>
      </div>
    </div>
  );
}