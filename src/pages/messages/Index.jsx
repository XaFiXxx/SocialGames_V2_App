import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { MessageSquare } from "lucide-react";
import api from "../../services/api";
import echo from "../../services/echo";
import { useAuth } from "../../context/AuthContext";
import ConversationsSidebar from "./components/ConversationsSidebar";
import ConversationHeader from "./components/ConversationHeader";
import MessagesList from "./components/MessagesList";
import MessageComposer from "./components/MessageComposer";
import {
  getConversationName,
  sortConversations,
} from "./utils/messageHelpers";

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

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: "end",
    });
  };

  const fetchConversations = async ({ preserveSelection = true } = {}) => {
    try {
      setIsLoadingConversations(true);

      const response = await api.get("/api/conversations");
      const data = sortConversations(response.data || []);

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
      const response = await api.get(`/api/conversations/${conversationId}/messages`);
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
    scrollToBottom("auto");
  }, [selectedConversation?.id]);

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const channelName = `chat.${selectedConversation.id}`;
    const channel = echo.private(channelName);

    channel.listen(".message.sent", (incomingMessage) => {
      setMessages((prev) => {
        const exists = prev.some(
          (message) => Number(message.id) === Number(incomingMessage.id)
        );

        if (exists) return prev;
        return [...prev, incomingMessage];
      });

      setConversations((prev) => {
        const updated = prev.map((conversation) =>
          Number(conversation.id) === Number(incomingMessage.conversation_id)
            ? {
                ...conversation,
                last_message: incomingMessage,
                updated_at: incomingMessage.created_at,
              }
            : conversation
        );

        return sortConversations(updated);
      });
    });

    return () => {
      echo.leave(channelName);
    };
  }, [selectedConversation?.id]);

  useEffect(() => {
    scrollToBottom();
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

      const response = await api.post(
        `/api/conversations/${selectedConversation.id}/messages`,
        formData
      );

      const newMessage = response.data;

      setMessages((prev) => {
        const exists = prev.some(
          (message) => Number(message.id) === Number(newMessage.id)
        );

        if (exists) return prev;
        return [...prev, newMessage];
      });

      setConversations((prev) => {
        const updated = prev.map((conversation) =>
          Number(conversation.id) === Number(selectedConversation.id)
            ? {
                ...conversation,
                last_message: newMessage,
                updated_at: newMessage.created_at,
              }
            : conversation
        );

        return sortConversations(updated);
      });

      setContent("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Erreur envoi message :", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="mx-auto h-[calc(100vh-5rem)] max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid h-full overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
        <ConversationsSidebar
          user={user}
          search={search}
          setSearch={setSearch}
          isLoadingConversations={isLoadingConversations}
          filteredConversations={filteredConversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
        />

        <div className="flex h-full min-w-0 min-h-0 flex-col">
          {selectedConversation ? (
            <>
              <ConversationHeader
                conversation={selectedConversation}
                user={user}
              />

              <MessagesList
                messages={messages}
                user={user}
                isLoadingMessages={isLoadingMessages}
                messagesEndRef={messagesEndRef}
              />

              <MessageComposer
                content={content}
                setContent={setContent}
                image={image}
                fileInputRef={fileInputRef}
                isSending={isSending}
                onRemoveImage={handleRemoveImage}
                onSubmit={handleSubmit}
                onImageChange={(e) => setImage(e.target.files?.[0] || null)}
              />
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