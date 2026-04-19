import { useEffect, useState } from "react";
import api from "../services/api";
import CreatePost from "../components/posts/CreatePost";
import FeedLeftSidebar from "../components/feed/FeedLeftSidebar";
import FeedFilters from "../components/feed/FeedFilters";
import FeedPostCard from "../components/feed/FeedPostCard";
import FeedRightSidebar from "../components/feed/FeedRightSidebar";

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const response = await api.get("/api/posts");
      setPosts(response.data?.data ?? []);
    } catch (error) {
      console.error("Erreur chargement posts :", error);
      setPosts([]);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute left-[8%] top-[4%] h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute bottom-[8%] right-[6%] h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.10),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.08),_transparent_35%)]" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <FeedLeftSidebar postsCount={posts.length} />

        <main className="min-w-0 space-y-6">
          <CreatePost
            onPostCreated={(newPost) => {
              setPosts((prev) => [newPost, ...prev]);
            }}
          />

          <FeedFilters />

          <div className="space-y-5">
            {isLoadingPosts ? (
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-[var(--text-secondary)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                Chargement des publications...
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-sm text-[var(--text-secondary)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                Aucune publication pour le moment.
              </div>
            ) : (
              posts.map((post) => <FeedPostCard key={post.id} post={post} />)
            )}
          </div>
        </main>

        <FeedRightSidebar />
      </div>
    </section>
  );
}