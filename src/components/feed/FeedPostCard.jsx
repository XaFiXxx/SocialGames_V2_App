import { MessageCircle, Heart, Share2, Image as ImageIcon } from "lucide-react";

function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

function formatPostTime(dateString) {
  if (!dateString) return "";

  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getAuthorName(user) {
  if (!user) return "Utilisateur";
  if (user.name && user.surname) return `${user.name} ${user.surname}`;
  if (user.username) return user.username;
  return "Utilisateur";
}

function getAuthorInitials(user) {
  if (!user) return "U";

  if (user.name && user.surname) {
    return `${user.name[0] ?? ""}${user.surname[0] ?? ""}`.toUpperCase();
  }

  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }

  return "U";
}

function getPostMedia(post) {
  if (!post?.media || !Array.isArray(post.media)) return [];
  return post.media;
}

function getFirstImage(post) {
  const media = getPostMedia(post);
  const image = media.find((item) =>
    item?.type?.toLowerCase().includes("image")
  );

  return image?.url ? getImageUrl(image.url) : null;
}

export default function FeedPostCard({ post }) {
  const authorName = getAuthorName(post.user);
  const authorInitials = getAuthorInitials(post.user);
  const avatarSrc = getImageUrl(post?.user?.avatar_url);
  const firstImage = getFirstImage(post);
  const mediaCount = getPostMedia(post).length;

  return (
    <article className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="text-sm font-semibold text-[var(--text-main)]">
              {authorName}
            </h2>

            <span className="text-sm text-[var(--text-secondary)]">
              @{post?.user?.username || "username"}
            </span>

            <span className="text-sm text-[var(--text-secondary)]">•</span>

            <span className="text-sm text-[var(--text-secondary)]">
              {formatPostTime(post.created_at)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--text-main)]">
              {post.visibility || "public"}
            </span>

            {post.group_id && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                Groupe
              </span>
            )}

            {post.team_id && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                Team
              </span>
            )}

            {mediaCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                <ImageIcon size={12} />
                {mediaCount} média{mediaCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--text-main)]">
            {post.content}
          </p>
        </div>
      </div>

      {firstImage && (
        <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
          <img
            src={firstImage}
            alt="Post media"
            className="h-auto max-h-[500px] w-full object-cover"
          />
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-main)]"
        >
          <Heart size={16} />
          {post.likes_count ?? 0}
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-main)]"
        >
          <MessageCircle size={16} />
          {post.comments_count ?? 0}
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-white/10 hover:text-[var(--text-main)]"
        >
          <Share2 size={16} />
          0
        </button>
      </div>
    </article>
  );
}