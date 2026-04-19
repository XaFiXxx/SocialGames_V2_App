import { Image as ImageIcon, FileText } from "lucide-react";
import GlassCard from "./GlassCard";

export default function ProfilePostsSection({
  posts,
  postsCount,
  formatDateTime,
  getPostMedia,
  getFirstImageFromPost,
}) {
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
          {posts.map((post) => {
            const firstImage = getFirstImageFromPost(post);
            const mediaCount = getPostMedia(post).length;

            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                {firstImage && (
                  <div className="h-56 w-full overflow-hidden bg-white/5">
                    <img
                      src={firstImage}
                      alt="Post media"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-secondary)]">
                      <FileText size={14} />
                      Post
                    </div>

                    <span className="text-xs text-[var(--text-secondary)]">
                      {formatDateTime(post.created_at)}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                    {post.content?.trim()
                      ? post.content
                      : "Publication sans texte."}
                  </p>

                  {mediaCount > 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--text-secondary)]">
                      <ImageIcon size={14} />
                      {mediaCount} média{mediaCount > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--text-secondary)]">
          Aucun post récent à afficher pour le moment.
        </div>
      )}
    </GlassCard>
  );
}