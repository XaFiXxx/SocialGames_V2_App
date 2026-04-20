import { useEffect, useMemo, useState } from "react";
import { MapPin, UserRound, Users, Swords } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

import PublicProfileHero from "./components/PublicProfileHero";
import PublicProfileImageModal from "./components/PublicProfileImageModal";
import PublicProfileMainColumn from "./components/PublicProfileMainColumn";
import PublicProfilePostsSection from "./components/PublicProfilePostsSection";
import PublicProfileSidebar from "./components/PublicProfileSidebar";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState({ type: null, isOpen: false });

  const openModal = (type) => setModal({ type, isOpen: true });
  const closeModal = () => setModal({ type: null, isOpen: false });

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL}/${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non renseignée";

    return new Intl.DateTimeFormat("fr-BE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const memberSince = (dateString) => {
    if (!dateString) return "Non renseigné";

    return new Intl.DateTimeFormat("fr-BE", {
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/user/${id}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const user = profile?.user ?? null;
  const meta = profile?.meta ?? null;
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

  const fullName =
    user?.name && user?.surname
      ? `${user.name} ${user.surname}`
      : user?.username || "Utilisateur";

  const initials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
      : user?.username?.slice(0, 2).toUpperCase() || "U";

  const avatarSrc = getImageUrl(user?.avatar_url);
  const coverSrc = getImageUrl(user?.cover_url);

  const isOwnProfile = Number(authUser?.id) === Number(user?.id);

  const profileBadges = useMemo(() => {
    if (!user) return [];

    const badges = [];

    if (user.location) {
      badges.push({
        key: "location",
        icon: <MapPin size={14} />,
        label: user.location,
      });
    }

    badges.push({
      key: "member",
      icon: <UserRound size={14} />,
      label: `Membre depuis ${memberSince(user.created_at)}`,
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
  }, [user, followersCount, friendsCount]);

  const handleFollowToggle = async () => {
    if (!user || !meta || actionLoading) return;

    try {
      setActionLoading(true);

      if (meta.is_following) {
        await api.delete(`/api/user/${user.id}/follow`);
      } else {
        await api.post(`/api/user/${user.id}/follow`);
      }

      await fetchUserProfile();
    } catch (error) {
      console.error("Erreur follow :", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFriendAction = async () => {
    if (!user || !meta || actionLoading) return;

    try {
      setActionLoading(true);

      if (!meta.friend_status) {
        await api.post(`/api/user/${user.id}/friend-request`);
      } else if (
        meta.friend_status === "pending" &&
        !meta.friend_request_sent_by_me
      ) {
        await api.post(`/api/user/${user.id}/friend-accept`);
      } else {
        await api.delete(`/api/user/${user.id}/friendship`);
      }

      await fetchUserProfile();
    } catch (error) {
      console.error("Erreur friend action :", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!user || actionLoading) return;

    try {
      setActionLoading(true);

      const response = await api.post("/api/conversations/direct", {
        user_id: user.id,
      });

      navigate(`/messages?conversation=${response.data.conversation_id}`);
    } catch (error) {
      console.error("Erreur création conversation :", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-sm text-[var(--text-secondary)] shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          Chargement du profil...
        </div>
      </section>
    );
  }

  if (!user || !meta) {
    return (
      <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-[var(--text-main)] shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          Profil introuvable.
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
        <PublicProfileHero
          user={user}
          meta={meta}
          fullName={fullName}
          initials={initials}
          avatarSrc={avatarSrc}
          coverSrc={coverSrc}
          followersCount={followersCount}
          followingCount={followingCount}
          friendsCount={friendsCount}
          gamesCount={gamesCount}
          profileBadges={profileBadges}
          isOwnProfile={isOwnProfile}
          actionLoading={actionLoading}
          openModal={openModal}
          handleFollowToggle={handleFollowToggle}
          handleFriendAction={handleFriendAction}
          handleStartConversation={handleStartConversation}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <PublicProfileMainColumn
            user={user}
            platforms={platforms}
            games={games}
            followersCount={followersCount}
            followingCount={followingCount}
            friendsCount={friendsCount}
            gamesCount={gamesCount}
            formatDate={formatDate}
            getImageUrl={getImageUrl}
          />

          <PublicProfileSidebar
            friends={friends}
            followersCount={followersCount}
            followingCount={followingCount}
            friendsCount={friendsCount}
            gamesCount={gamesCount}
            postsCount={postsCount}
            platformsCount={platformsCount}
            user={user}
            memberSince={memberSince}
            getImageUrl={getImageUrl}
          />
        </div>

        <PublicProfilePostsSection posts={posts} postsCount={postsCount} />
      </div>

      <PublicProfileImageModal
        modal={modal}
        closeModal={closeModal}
        avatarSrc={avatarSrc}
        coverSrc={coverSrc}
        initials={initials}
      />
    </section>
  );
}