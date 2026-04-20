import { useState } from "react";
import { Image, Smile, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

function getUserName(user) {
  if (!user) return "Utilisateur";
  if (user.name && user.surname) return `${user.name} ${user.surname}`;
  if (user.username) return user.username;
  return "Utilisateur";
}

function getUserInitials(user) {
  if (!user) return "U";

  if (user.name && user.surname) {
    return `${user.name[0] ?? ""}${user.surname[0] ?? ""}`.toUpperCase();
  }

  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }

  return "U";
}

export default function CreatePost({
  onPostCreated,
  groupId = null,
  teamId = null,
}) {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const avatarSrc = getImageUrl(user?.avatar_url);
  const authorName = getUserName(user);
  const authorInitials = getUserInitials(user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setErrorMessage("Le contenu ne peut pas être vide.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const payload = {
        content: trimmedContent,
        visibility,
        group_id: groupId,
        team_id: teamId,
      };

      const response = await api.post("/api/posts", payload);

      if (response.data?.post && onPostCreated) {
        onPostCreated(response.data.post);
      }

      setContent("");
      setVisibility("public");
    } catch (error) {
      console.error("Erreur création post :", error);
      setErrorMessage(
        error.response?.data?.message || "Impossible de publier le post."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 font-semibold text-white shadow-md">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={authorName}
              className="h-full w-full object-cover"
            />
          ) : (
            authorInitials
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3">
            <p className="text-sm font-semibold text-[var(--text-main)]">
              {authorName}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {user?.username ? `@${user.username}` : "Nouvelle publication"}
            </p>
          </div>

          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partage une recherche de team, un highlight ou une discussion gaming..."
            className="w-full resize-none rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-cyan-400"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus:border-cyan-400"
              >
                <option value="public">Public</option>
                <option value="friends">Amis</option>
                <option value="private">Privé</option>
              </select>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text-main)] transition hover:bg-white/10"
              >
                <Image size={16} />
                Image
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--text-main)] transition hover:bg-white/10"
              >
                <Smile size={16} />
                Mood
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              {isSubmitting ? "Publication..." : "Publier"}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
          )}
        </div>
      </div>
    </form>
  );
}