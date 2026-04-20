import { useMemo, useRef, useState } from "react";
import { Image, Smile, Send, X, Video } from "lucide-react";
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
  const fileInputRef = useRef(null);

  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const avatarSrc = getImageUrl(user?.avatar_url);
  const authorName = getUserName(user);
  const authorInitials = getUserInitials(user);

  const previews = useMemo(() => {
    return selectedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      isVideo: file.type.startsWith("video/"),
      isImage: file.type.startsWith("image/"),
    }));
  }, [selectedFiles]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (event) => {
    const incomingFiles = Array.from(event.target.files || []);
    if (!incomingFiles.length) return;

    const mergedFiles = [...selectedFiles, ...incomingFiles];

    if (mergedFiles.length > 6) {
      setErrorMessage("Tu peux ajouter максимум 6 médias par post.");
      event.target.value = "";
      return;
    }

    const videoCount = mergedFiles.filter((file) =>
      file.type.startsWith("video/")
    ).length;

    if (videoCount > 1) {
      setErrorMessage("Une seule vidéo est autorisée par post.");
      event.target.value = "";
      return;
    }

    const hasVideo = videoCount === 1;
    if (hasVideo && mergedFiles.length > 1) {
      setErrorMessage("Tu ne peux pas mélanger une vidéo avec d'autres médias.");
      event.target.value = "";
      return;
    }

    setSelectedFiles(mergedFiles);
    setErrorMessage("");
    event.target.value = "";
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((current) =>
      current.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    const hasFiles = selectedFiles.length > 0;

    if (!trimmedContent && !hasFiles) {
      setErrorMessage("Le post doit contenir un texte ou au moins un média.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const formData = new FormData();

      if (trimmedContent) {
        formData.append("content", trimmedContent);
      }

      formData.append("visibility", visibility);

      if (groupId) {
        formData.append("group_id", groupId);
      }

      if (teamId) {
        formData.append("team_id", teamId);
      }

      selectedFiles.forEach((file) => {
        formData.append("media[]", file);
      });

      const response = await api.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.post && onPostCreated) {
        onPostCreated(response.data.post);
      }

      setContent("");
      setVisibility("public");
      setSelectedFiles([]);
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
      className="rounded-[30px] border border-white/10 bg-[var(--bg-card)] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime"
        multiple
        className="hidden"
        onChange={handleFilesChange}
      />

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
            className="w-full resize-none rounded-[24px] border border-white/10 bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-cyan-400"
          />

          {previews.length > 0 && (
            <div
              className={`mt-4 grid gap-3 ${
                previews.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {previews.map((item, index) => (
                <div
                  key={`${item.file.name}-${index}`}
                  className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[var(--bg-secondary)]"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:scale-105"
                  >
                    <X size={16} />
                  </button>

                  {item.isVideo ? (
                    <video
                      src={item.previewUrl}
                      controls
                      className="max-h-[420px] w-full bg-black object-cover"
                    />
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt={`Prévisualisation ${index + 1}`}
                      className="max-h-[420px] w-full object-cover"
                    />
                  )}

                  <div className="flex items-center gap-2 border-t border-white/10 px-3 py-2 text-xs text-[var(--text-secondary)]">
                    {item.isVideo ? <Video size={14} /> : <Image size={14} />}
                    <span className="truncate">{item.file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="rounded-xl border border-white/10 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-main)] outline-none transition focus:border-cyan-400"
              >
                <option value="public">Public</option>
                <option value="friends">Amis</option>
                <option value="private">Privé</option>
              </select>

              <button
                type="button"
                onClick={openFilePicker}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-main)] transition hover:border-cyan-400 hover:bg-[var(--bg-card)]"
              >
                <Image size={16} />
                Média
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-main)] transition hover:bg-[var(--bg-card)]"
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

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
            <span>Jusqu’à 6 médias</span>
            <span>1 seule vidéo max</span>
            <span>Texte ou média requis</span>
          </div>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-400">{errorMessage}</p>
          )}
        </div>
      </div>
    </form>
  );
}