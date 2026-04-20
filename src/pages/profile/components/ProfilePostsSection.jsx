import FeedPostCard from "../../../components/feed/FeedPostCard";
import GlassCard from "./GlassCard";

export default function ProfilePostsSection({ posts, postsCount }) {
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
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedPostCard key={post.id} post={post} />
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