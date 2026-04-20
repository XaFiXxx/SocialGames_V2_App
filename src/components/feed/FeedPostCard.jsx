import { useMemo, useState } from "react";
import {
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Video,
  Heart,
  Flame,
  Trophy,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

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
  return [...post.media].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function isImageMedia(item) {
  return item?.type === "image";
}

function isVideoMedia(item) {
  return item?.type === "video";
}

function getMediaGridClass(mediaCount) {
  if (mediaCount <= 1) return "grid-cols-1";
  if (mediaCount === 2) return "grid-cols-2";
  return "grid-cols-2";
}

function buildReactionState(post) {
  return {
    like: post?.reactions_count?.like ?? 0,
    fire: post?.reactions_count?.fire ?? 0,
    gg: post?.reactions_count?.gg ?? 0,
    total: post?.reactions_count?.total ?? 0,
    userReaction: post?.user_reaction ?? null,
  };
}

function getUpdatedReactionState(prev, nextType) {
  const currentType = prev.userReaction;

  const next = {
    ...prev,
    like: prev.like ?? 0,
    fire: prev.fire ?? 0,
    gg: prev.gg ?? 0,
    total: prev.total ?? 0,
  };

  if (currentType === nextType) {
    next[nextType] = Math.max((next[nextType] ?? 0) - 1, 0);
    next.total = Math.max((next.total ?? 0) - 1, 0);
    next.userReaction = null;
    return next;
  }

  if (currentType) {
    next[currentType] = Math.max((next[currentType] ?? 0) - 1, 0);
  } else {
    next.total = (next.total ?? 0) + 1;
  }

  next[nextType] = (next[nextType] ?? 0) + 1;
  next.userReaction = nextType;

  return next;
}

function ReactionButton({
  icon: Icon,
  label,
  type,
  count,
  active,
  onClick,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(type)}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
        active
          ? "bg-white/10 text-[var(--text-main)] ring-1 ring-white/10"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      title={label}
    >
      <Icon size={16} />
      {count}
    </button>
  );
}

export default function FeedPostCard({ post, onPostDeleted }) {
  const authorName = getAuthorName(post.user);
  const authorInitials = getAuthorInitials(post.user);
  const avatarSrc = getImageUrl(post?.user?.avatar_url);
  const media = getPostMedia(post);
  const mediaCount = media.length;
  const hasVideo = media.some((item) => isVideoMedia(item));

  const [reactionState, setReactionState] = useState(() =>
    buildReactionState(post)
  );
  const [isReacting, setIsReacting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const commentsCount = useMemo(() => post.comments_count ?? 0, [post]);

  const handleReact = async (type) => {
    if (isReacting) return;

    const previousState = reactionState;
    const optimisticState = getUpdatedReactionState(previousState, type);

    setReactionState(optimisticState);
    setIsReacting(true);

    try {
      await api.post(`/api/posts/${post.id}/react`, { type });
    } catch (error) {
      console.error("Erreur réaction post :", error);
      setReactionState(previousState);
    } finally {
      setIsReacting(false);
    }
  };

  const handleDeletePost = async () => {
    if (isDeleting) return;

    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce post ?"
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await api.delete(`/api/posts/${post.id}`);
      onPostDeleted?.(post.id);
    } catch (error) {
      console.error("Erreur suppression post :", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-[30px] border border-white/10 bg-[var(--bg-card)] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
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
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
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
                <span className="rounded-full border border-white/10 bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium capitalize text-[var(--text-main)]">
                  {post.visibility || "public"}
                </span>

                {post.group_id && (
                  <span className="rounded-full border border-white/10 bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                    Groupe
                  </span>
                )}

                {post.team_id && (
                  <span className="rounded-full border border-white/10 bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                    Team
                  </span>
                )}

                {mediaCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[var(--bg-secondary)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                    {hasVideo ? <Video size={12} /> : <ImageIcon size={12} />}
                    {mediaCount} média{mediaCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {post.is_owner && (
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                title="Supprimer le post"
              >
                <Trash2 size={16} />
                {isDeleting ? "Suppression..." : "Supprimer"}
              </button>
            )}
          </div>

          {post.content ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--text-main)]">
              {post.content}
            </p>
          ) : null}
        </div>
      </div>

      {mediaCount > 0 && (
        <div className={`mt-5 grid gap-3 ${getMediaGridClass(mediaCount)}`}>
          {media.map((item) => {
            const mediaUrl = getImageUrl(item?.url);

            if (!mediaUrl) return null;

            if (isVideoMedia(item)) {
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[24px] border border-white/10 bg-[var(--bg-secondary)]"
                >
                  <video
                    src={mediaUrl}
                    controls
                    className="max-h-[520px] w-full bg-black object-cover"
                  />
                </div>
              );
            }

            if (isImageMedia(item)) {
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[24px] border border-white/10 bg-[var(--bg-secondary)]"
                >
                  <img
                    src={mediaUrl}
                    alt="Post media"
                    className="h-full max-h-[520px] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
        <ReactionButton
          icon={Heart}
          label="Like"
          type="like"
          count={reactionState.like}
          active={reactionState.userReaction === "like"}
          onClick={handleReact}
          disabled={isReacting}
        />

        <ReactionButton
          icon={Flame}
          label="Fire"
          type="fire"
          count={reactionState.fire}
          active={reactionState.userReaction === "fire"}
          onClick={handleReact}
          disabled={isReacting}
        />

        <ReactionButton
          icon={Trophy}
          label="GG"
          type="gg"
          count={reactionState.gg}
          active={reactionState.userReaction === "gg"}
          onClick={handleReact}
          disabled={isReacting}
        />

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]"
        >
          <MessageCircle size={16} />
          {commentsCount}
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]"
        >
          <Share2 size={16} />
          0
        </button>
      </div>
    </article>
  );
}