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
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
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
              <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-sm text-[var(--text-secondary)] shadow-sm">
                Chargement des publications...
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 text-sm text-[var(--text-secondary)] shadow-sm">
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