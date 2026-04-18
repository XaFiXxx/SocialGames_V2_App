export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

export function formatConversationTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "À l’instant";
  if (diffInMinutes < 60) return `${diffInMinutes} min`;
  if (diffInHours < 24) return `${diffInHours} h`;
  if (diffInDays < 7) return `${diffInDays} j`;

  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function formatMessageTime(dateString) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("fr-BE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

export function getConversationName(conversation, authUser) {
  if (conversation.type === "group") {
    return conversation.name || "Groupe sans nom";
  }

  const otherUser = conversation.users?.find(
    (participant) => Number(participant.id) !== Number(authUser?.id),
  );

  if (!otherUser) return "Conversation";

  if (otherUser.name && otherUser.surname) {
    return `${otherUser.name} ${otherUser.surname}`;
  }

  return otherUser.username || "Utilisateur";
}

export function getConversationAvatar(conversation, authUser) {
  if (conversation.type === "group") {
    return getImageUrl(conversation.image_url);
  }

  const otherUser = conversation.users?.find(
    (participant) => Number(participant.id) !== Number(authUser?.id),
  );

  return getImageUrl(otherUser?.avatar_url);
}

export function getConversationInitials(conversation, authUser) {
  if (conversation.type === "group") {
    return "GR";
  }

  const otherUser = conversation.users?.find(
    (participant) => Number(participant.id) !== Number(authUser?.id),
  );

  if (!otherUser) return "U";

  if (otherUser.name && otherUser.surname) {
    return `${otherUser.name[0]}${otherUser.surname[0]}`.toUpperCase();
  }

  return (otherUser.username || "U").slice(0, 2).toUpperCase();
}

export function getLastMessagePreview(conversation) {
  const lastMessage = conversation.last_message;

  if (!lastMessage) return "Aucun message pour le moment.";
  if (lastMessage.type === "image") return "📷 Image";
  if (lastMessage.type === "mixed") {
    return `📷 ${lastMessage.content || "Image"}`;
  }

  return lastMessage.content || "Message";
}

export function sortConversations(list) {
  return [...list].sort((a, b) => {
    const dateA = new Date(
      a.last_message?.created_at || a.updated_at,
    ).getTime();
    const dateB = new Date(
      b.last_message?.created_at || b.updated_at,
    ).getTime();
    return dateB - dateA;
  });
}
