import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import {
  Search,
  Send,
  Image as ImageIcon,
  Users,
  X,
  MessageSquare,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

function formatConversationTime(dateString) {
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

function formatMessageTime(dateString) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("fr-BE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getConversationName(conversation, authUser) {
  if (conversation.type === "group") {
    return conversation.name || "Groupe sans nom";
  }

  const otherUser = conversation.users?.find(
    (participant) => Number(participant.id) !== Number(authUser?.id)
  );

  if (!otherUser) return "Conversation";

  if (otherUser.name && otherUser.surname) {
    return `${otherUser.name} ${otherUser.surname}`;
  }

  return otherUser.username || "Utilisateur";
}

function getConversationAvatar(conversation, authUser) {
  if (conversation.type === "group") {
    return getImageUrl(conversation.image_url);
  }

  const otherUser = conversation.users?.find(
    (participant) => Number(participant.id) !== Number(authUser?.id)
  );

  return getImageUrl(otherUser?.avatar_url);
}

function getConversationInitials(conversation, authUser) {
  if (conversation.type === "group") {
    return "GR";
  }

  const otherUser = conversation.users?.find(
    (participant) => Number(participant.id) !== Number(authUser?.id)
  );

  if (!otherUser) return "U";

  if (otherUser.name && otherUser.surname) {
    return `${otherUser.name[0]}${otherUser.surname[0]}`.toUpperCase();
  }

  return (otherUser.username || "U").slice(0, 2).toUpperCase();
}

function getLastMessagePreview(conversation) {
  const lastMessage = conversation.last_message;

  if (!lastMessage) return "Aucun message pour le moment.";
  if (lastMessage.type === "image") return "📷 Image";
  if (lastMessage.type === "mixed") {
    return `📷 ${lastMessage.content || "Image"}`;
  }

  return lastMessage.content || "Message";
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const conversationIdFromUrl = searchParams.get("conversation");

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchConversations = async ({ preserveSelection = true } = {}) => {
    try {
      setIsLoadingConversations(true);

      const response = await api.get("/api/conversations");
      const data = response.data || [];

      setConversations(data);

      if (data.length === 0) {
        setSelectedConversation(null);
        return;
      }

      if (conversationIdFromUrl) {
        const targetConversation = data.find(
          (conversation) =>
            Number(conversation.id) === Number(conversationIdFromUrl)
        );

        if (targetConversation) {
          setSelectedConversation(targetConversation);
          return;
        }
      }

      if (preserveSelection && selectedConversation?.id) {
        const refreshedSelectedConversation = data.find(
          (conversation) =>
            Number(conversation.id) === Number(selectedConversation.id)
        );

        if (refreshedSelectedConversation) {
          setSelectedConversation(refreshedSelectedConversation);
          return;
        }
      }

      setSelectedConversation(data[0]);
    } catch (error) {
      console.error("Erreur chargement conversations :", error);
      setConversations([]);
      setSelectedConversation(null);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setIsLoadingMessages(true);

      const response = await api.get(
        `/api/conversations/${conversationId}/messages`
      );

      setMessages(response.data || []);
    } catch (error) {
      console.error("Erreur chargement messages :", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations({ preserveSelection: false });
  }, []);

  useEffect(() => {
    if (selectedConversation?.id) {
      fetchMessages(selectedConversation.id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const interval = setInterval(() => {
      fetchMessages(selectedConversation.id);
      fetchConversations();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return conversations;

    return conversations.filter((conversation) => {
      const displayName = getConversationName(conversation, user);
      return displayName.toLowerCase().includes(term);
    });
  }, [conversations, search, user]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("conversation", conversation.id);
      return next;
    });
  };

  const handleRemoveImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedConversation?.id) return;
    if (!content.trim() && !image) return;

    try {
      setIsSending(true);

      const formData = new FormData();

      if (content.trim()) {
        formData.append("content", content.trim());
      }

      if (image) {
        formData.append("image", image);
      }

      await api.post(
        `/api/conversations/${selectedConversation.id}/messages`,
        formData
      );

      setContent("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchMessages(selectedConversation.id);
      await fetchConversations();
    } catch (error) {
      console.error("Erreur envoi message :", error);
    } finally {
      setIsSending(false);
    }
  };

  const currentConversationName = selectedConversation
    ? getConversationName(selectedConversation, user)
    : "Sélectionne une conversation";

  const currentConversationAvatar = selectedConversation
    ? getConversationAvatar(selectedConversation, user)
    : null;

  const currentConversationInitials = selectedConversation
    ? getConversationInitials(selectedConversation, user)
    : "C";

  return (
    <section className="mx-auto h-[calc(100vh-5rem)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid h-full overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="flex h-full min-h-0 flex-col border-b border-[var(--border-color)] lg:border-b-0 lg:border-r">
          <div className="border-b border-[var(--border-color)] p-4">
            <h1 className="text-xl font-bold text-[var(--text-main)]">
              Messages
            </h1>
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

          <div className="flex-1 overflow-y-auto p-2">
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
                    onClick={() => handleSelectConversation(conversation)}
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

        <div className="flex h-full min-w-0 flex-col">
          {selectedConversation ? (
            <>
              <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-4 py-4">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg-main)] text-sm font-semibold text-[var(--text-main)]">
                  {currentConversationAvatar ? (
                    <img
                      src={currentConversationAvatar}
                      alt={currentConversationName}
                      className="h-full w-full object-cover"
                    />
                  ) : selectedConversation.type === "group" ? (
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
                    {selectedConversation.type === "group"
                      ? `${selectedConversation.users?.length || 0} membres`
                      : "Conversation privée"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-[var(--bg-main)]/40 px-4 py-4">
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
                      const isMine =
                        Number(message.user_id) === Number(user?.id);

                      const authorName =
                        message.user?.username ||
                        `${message.user?.name || ""} ${
                          message.user?.surname || ""
                        }`.trim() ||
                        "Utilisateur";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
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

              <form
                onSubmit={handleSubmit}
                className="border-t border-[var(--border-color)] bg-[var(--bg-card)] p-4"
              >
                {image && (
                  <div className="mb-3 flex items-center justify-between rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]">
                    <span className="truncate pr-3">
                      Image sélectionnée : {image.name}
                    </span>

                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-[var(--text-secondary)] transition hover:bg-[var(--bg-card)]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-3">
                  <label className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] transition hover:opacity-90">
                    <ImageIcon size={18} />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                  </label>

                  <textarea
                    rows={1}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écris ton message..."
                    className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)]"
                  />

                  <button
                    type="submit"
                    disabled={isSending || (!content.trim() && !image)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--bg-main)] text-[var(--text-secondary)]">
                <MessageSquare size={24} />
              </div>

              <p className="mt-4 text-base font-semibold text-[var(--text-main)]">
                Sélectionne une conversation
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Choisis une conversation à gauche pour commencer à discuter.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}