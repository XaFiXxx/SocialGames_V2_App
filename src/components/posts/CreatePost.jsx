import { useState } from "react";
import { Image, Smile, Send } from "lucide-react";
import api from "../../services/api";

export default function CreatePost({
  onPostCreated,
  groupId = null,
  teamId = null,
}) {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] font-semibold text-white">
          SB
        </div>

        <div className="min-w-0 flex-1">
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Partage une recherche de team, un highlight ou une discussion gaming..."
            className="w-full resize-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)]"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)] outline-none focus:border-[var(--primary)]"
              >
                <option value="public">Public</option>
                <option value="friends">Amis</option>
                <option value="private">Privé</option>
              </select>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)] transition hover:opacity-90"
              >
                <Image size={16} />
                Image
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)] transition hover:opacity-90"
              >
                <Smile size={16} />
                Mood
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
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