import { useEffect, useMemo, useState } from "react";
import { MapPin, UserRound, Users, Swords } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import ProfileHero from "./components/ProfileHero";
import ProfileMainColumn from "./components/ProfileMainColumn";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileImageModal from "./components/ProfileImageModal";
import ProfilePostsSection from "./components/ProfilePostsSection";

import {
  getImageUrl,
  formatDate,
  formatDateTime,
  memberSince,
  getPostMedia,
  getFirstImageFromPost,
} from "./utils/profileHelpers";

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({
    type: null,
    isOpen: false,
  });
  const [imageVersion, setImageVersion] = useState(Date.now());

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/api/profile");
      setProfile(data);
    } catch (error) {
      console.error("Erreur chargement profil :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const user = profile?.user ?? authUser;
  const meta = profile?.meta ?? {};
  const friends = profile?.friends ?? [];
  const followers = profile?.followers ?? [];
  const following = profile?.following ?? [];
  const games = profile?.games ?? [];
  const platforms = profile?.platforms ?? [];
  const posts = profile?.posts ?? [];

  const followersCount = meta?.followers_count ?? followers.length ?? 0;
  const followingCount = meta?.following_count ?? following.length ?? 0;
  const friendsCount = meta?.friends_count ?? friends.length ?? 0;
  const gamesCount = meta?.games_count ?? games.length ?? 0;
  const platformsCount = meta?.platforms_count ?? platforms.length ?? 0;
  const postsCount = meta?.posts_count ?? posts.length ?? 0;

  const openModal = (type) => {
    setModal({ type, isOpen: true });
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();

    if (modal.type === "avatar") {
      formData.append("avatar", file);
    } else if (modal.type === "cover") {
      formData.append("cover", file);
    }

    try {
      await api.post(`/api/profile/${modal.type}`, formData);
      await refreshUser();
      await fetchProfile();
      setImageVersion(Date.now());
      closeModal();
    } catch (error) {
      console.error("Erreur upload image :", error);
    }
  };

  const fullName =
    user?.name && user?.surname
      ? `${user.name} ${user.surname}`
      : user?.username || "Utilisateur";

  const initials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
      : user?.username?.slice(0, 2).toUpperCase() || "U";

  const avatarSrc = getImageUrl(user?.avatar_url, imageVersion);
  const coverSrc = getImageUrl(user?.cover_url, imageVersion);

  const profileBadges = useMemo(() => {
    const badges = [];

    if (user?.location) {
      badges.push({
        key: "location",
        icon: <MapPin size={14} />,
        label: user.location,
      });
    }

    badges.push({
      key: "member",
      icon: <UserRound size={14} />,
      label: `Membre depuis ${memberSince(user?.created_at)}`,
    });

    badges.push({
      key: "followers",
      icon: <Users size={14} />,
      label: `${followersCount} follower${followersCount > 1 ? "s" : ""}`,
    });

    badges.push({
      key: "friends",
      icon: <Swords size={14} />,
      label: `${friendsCount} ami${friendsCount > 1 ? "s" : ""}`,
    });

    return badges;
  }, [user?.location, user?.created_at, followersCount, friendsCount]);

  if (isLoading) {
    return (
      <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.10),_transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-sm text-[var(--text-secondary)] shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            Chargement du profil...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute left-[8%] top-[4%] h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute bottom-[8%] right-[6%] h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.10),_transparent_26%),radial-gradient(circle_at_bottom,_rgba(99,102,241,0.08),_transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl space-y-6">
        <ProfileHero
          user={user}
          fullName={fullName}
          initials={initials}
          avatarSrc={avatarSrc}
          coverSrc={coverSrc}
          followersCount={followersCount}
          followingCount={followingCount}
          friendsCount={friendsCount}
          gamesCount={gamesCount}
          profileBadges={profileBadges}
          openModal={openModal}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <ProfileMainColumn
            user={user}
            platforms={platforms}
            games={games}
            followersCount={followersCount}
            followingCount={followingCount}
            friendsCount={friendsCount}
            gamesCount={gamesCount}
            formatDate={formatDate}
            getImageUrl={(path) => getImageUrl(path, imageVersion)}
          />

          <ProfileSidebar
            friends={friends}
            friendsCount={friendsCount}
            followersCount={followersCount}
            followingCount={followingCount}
            gamesCount={gamesCount}
            postsCount={postsCount}
            platformsCount={platformsCount}
            user={user}
            memberSince={memberSince}
            getImageUrl={(path) => getImageUrl(path, imageVersion)}
          />
        </div>

        <ProfilePostsSection
          posts={posts}
          postsCount={postsCount}
          formatDateTime={formatDateTime}
          getPostMedia={getPostMedia}
          getFirstImageFromPost={(post) =>
            getFirstImageFromPost(post, imageVersion)
          }
        />
      </div>

      <ProfileImageModal
        modal={modal}
        closeModal={closeModal}
        avatarSrc={avatarSrc}
        coverSrc={coverSrc}
        initials={initials}
        handleImageUpload={handleImageUpload}
      />
    </section>
  );
}