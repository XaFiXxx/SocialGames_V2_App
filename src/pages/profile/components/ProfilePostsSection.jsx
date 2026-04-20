import FeedPostCard from "../../../components/feed/FeedPostCard";
import GlassCard from "./GlassCard";

export default function ProfilePostsSection({
  posts,
  postsCount,
  authUser,
  onDeletePost,
}) {
  const safePosts = Array.isArray(posts) ? posts : [];

  const postsWithOwnership = safePosts.map((post) => ({
    ...post,
    is_owner:
      typeof post?.is_owner === "boolean"
        ? post.is_owner
        : Number(post?.user_id) === Number(authUser?.id),
  }));

  return (
    <GlassCard
      title="Posts récents"
      action={
        postsCount > 0 ? (
          <span className="text-xs text-[var(--text-secondary)]">
            {postsCount} au total
          </span>
        ) : null
      }
    >
      {postsWithOwnership.length > 0 ? (
        <div className="space-y-4">
          {postsWithOwnership.map((post) => (
            <FeedPostCard
              key={post.id}
              post={post}
              onPostDeleted={onDeletePost}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--text-secondary)]">
          Aucun post récent à afficher pour le moment.
        </div>
      )}
    </GlassCard>
  );
}