import { useEffect, useMemo, useState } from "react";
import { MapPin, UserRound, Users, Swords } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import ProfileHero from "./components/ProfileHero";
import ProfileMainColumn from "./components/ProfileMainColumn";
import ProfileSidebar from "./components/ProfileSidebar";
import ProfileImageModal from "./components/ProfileImageModal";
import ProfilePostsSection from "./components/ProfilePostsSection";
import AddUserGameModal from "./components/AddUserGameModal";
import AddUserPlatformModal from "./components/AddUserPlatformModale";

import {
  getImageUrl,
  formatDate,
  formatDateTime,
  memberSince,
  getPostMedia,
  getFirstImageFromPost,
} from "./utils/ProfileHelpers";

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({
    type: null,
    isOpen: false,
  });
  const [imageVersion, setImageVersion] = useState(Date.now());

  const [availableGames, setAvailableGames] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [isLoadingAvailableGames, setIsLoadingAvailableGames] = useState(false);
  const [isLoadingAvailablePlatforms, setIsLoadingAvailablePlatforms] =
    useState(false);

  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [isEditGameModalOpen, setIsEditGameModalOpen] = useState(false);
  const [isAddPlatformModalOpen, setIsAddPlatformModalOpen] = useState(false);
  const [isEditPlatformModalOpen, setIsEditPlatformModalOpen] = useState(false);

  const [isSubmittingAddGame, setIsSubmittingAddGame] = useState(false);
  const [isSubmittingEditGame, setIsSubmittingEditGame] = useState(false);
  const [isDeletingGame, setIsDeletingGame] = useState(false);

  const [isSubmittingAddPlatform, setIsSubmittingAddPlatform] = useState(false);
  const [isSubmittingEditPlatform, setIsSubmittingEditPlatform] =
    useState(false);
  const [isDeletingPlatform, setIsDeletingPlatform] = useState(false);

  const [addGameError, setAddGameError] = useState("");
  const [addPlatformError, setAddPlatformError] = useState("");

  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

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

  const fetchAvailableGames = async () => {
    try {
      setIsLoadingAvailableGames(true);
      setAddGameError("");

      const { data } = await api.get("/api/games");
      setAvailableGames(Array.isArray(data) ? data : data?.data ?? []);
    } catch (error) {
      console.error("Erreur chargement catalogue jeux :", error);
      setAddGameError("Impossible de charger la liste des jeux.");
      setAvailableGames([]);
    } finally {
      setIsLoadingAvailableGames(false);
    }
  };

  const fetchAvailablePlatforms = async () => {
    try {
      setIsLoadingAvailablePlatforms(true);
      setAddPlatformError("");

      const { data } = await api.get("/api/platforms");
      setAvailablePlatforms(Array.isArray(data) ? data : data?.data ?? []);
    } catch (error) {
      console.error("Erreur chargement catalogue plateformes :", error);
      setAddPlatformError("Impossible de charger la liste des plateformes.");
      setAvailablePlatforms([]);
    } finally {
      setIsLoadingAvailablePlatforms(false);
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

  const handleOpenAddGameModal = async () => {
    setSelectedGame(null);
    setAddGameError("");
    setIsAddGameModalOpen(true);

    if (availableGames.length === 0) {
      await fetchAvailableGames();
    }
  };

  const handleCloseAddGameModal = () => {
    if (isSubmittingAddGame) return;
    setIsAddGameModalOpen(false);
    setAddGameError("");
  };

  const handleOpenEditGameModal = async (game) => {
    setSelectedGame(game);
    setAddGameError("");
    setIsEditGameModalOpen(true);

    if (availableGames.length === 0) {
      await fetchAvailableGames();
    }
  };

  const handleCloseEditGameModal = () => {
    if (isSubmittingEditGame) return;
    setIsEditGameModalOpen(false);
    setSelectedGame(null);
    setAddGameError("");
  };

  const handleDeleteGame = async (game) => {
    const confirmed = window.confirm(`Retirer "${game.name}" de ton profil ?`);
    if (!confirmed) return;

    try {
      setIsDeletingGame(true);
      setAddGameError("");
      await api.delete(`/api/user/games/${game.id}`);
      await fetchProfile();
    } catch (error) {
      console.error("Erreur suppression jeu :", error);
      setAddGameError(
        error.response?.data?.message ||
          "Impossible de supprimer ce jeu du profil."
      );
    } finally {
      setIsDeletingGame(false);
    }
  };

  const handleAddUserGame = async (payload) => {
    try {
      setIsSubmittingAddGame(true);
      setAddGameError("");

      await api.post("/api/user/games", payload);

      await fetchProfile();
      setIsAddGameModalOpen(false);
    } catch (error) {
      console.error("Erreur ajout jeu utilisateur :", error);
      setAddGameError(
        error.response?.data?.message ||
          "Impossible d'ajouter ce jeu au profil."
      );
      throw error;
    } finally {
      setIsSubmittingAddGame(false);
    }
  };

  const handleUpdateUserGame = async (payload) => {
    if (!selectedGame) return;

    try {
      setIsSubmittingEditGame(true);
      setAddGameError("");

      await api.patch(`/api/user/games/${selectedGame.id}`, {
        skill_level: payload.skill_level,
        favorite: payload.favorite,
      });

      await fetchProfile();
      setIsEditGameModalOpen(false);
      setSelectedGame(null);
    } catch (error) {
      console.error("Erreur modification jeu utilisateur :", error);
      setAddGameError(
        error.response?.data?.message ||
          "Impossible de modifier ce jeu du profil."
      );
      throw error;
    } finally {
      setIsSubmittingEditGame(false);
    }
  };

  const handleOpenAddPlatformModal = async () => {
    setSelectedPlatform(null);
    setAddPlatformError("");
    setIsAddPlatformModalOpen(true);

    if (availablePlatforms.length === 0) {
      await fetchAvailablePlatforms();
    }
  };

  const handleCloseAddPlatformModal = () => {
    if (isSubmittingAddPlatform) return;
    setIsAddPlatformModalOpen(false);
    setAddPlatformError("");
  };

  const handleOpenEditPlatformModal = async (platform) => {
    setSelectedPlatform(platform);
    setAddPlatformError("");
    setIsEditPlatformModalOpen(true);

    if (availablePlatforms.length === 0) {
      await fetchAvailablePlatforms();
    }
  };

  const handleCloseEditPlatformModal = () => {
    if (isSubmittingEditPlatform) return;
    setIsEditPlatformModalOpen(false);
    setSelectedPlatform(null);
    setAddPlatformError("");
  };

  const handleDeletePlatform = async (platform) => {
    const confirmed = window.confirm(
      `Retirer "${platform.name}" de ton profil ?`
    );
    if (!confirmed) return;

    try {
      setIsDeletingPlatform(true);
      setAddPlatformError("");
      await api.delete(`/api/user/platforms/${platform.id}`);
      await fetchProfile();
    } catch (error) {
      console.error("Erreur suppression plateforme :", error);
      setAddPlatformError(
        error.response?.data?.message ||
          "Impossible de supprimer cette plateforme du profil."
      );
    } finally {
      setIsDeletingPlatform(false);
    }
  };

  const handleAddUserPlatform = async (payload) => {
    try {
      setIsSubmittingAddPlatform(true);
      setAddPlatformError("");

      await api.post("/api/user/platforms", payload);

      await fetchProfile();
      setIsAddPlatformModalOpen(false);
    } catch (error) {
      console.error("Erreur ajout plateforme utilisateur :", error);
      setAddPlatformError(
        error.response?.data?.message ||
          "Impossible d'ajouter cette plateforme au profil."
      );
      throw error;
    } finally {
      setIsSubmittingAddPlatform(false);
    }
  };

  const handleUpdateUserPlatform = async (payload) => {
    if (!selectedPlatform) return;

    try {
      setIsSubmittingEditPlatform(true);
      setAddPlatformError("");

      await api.patch(`/api/user/platforms/${selectedPlatform.id}`, payload);

      await fetchProfile();
      setIsEditPlatformModalOpen(false);
      setSelectedPlatform(null);
    } catch (error) {
      console.error("Erreur modification plateforme utilisateur :", error);
      setAddPlatformError(
        error.response?.data?.message ||
          "Impossible de modifier cette plateforme du profil."
      );
      throw error;
    } finally {
      setIsSubmittingEditPlatform(false);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer ce post ?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/posts/${postId}`);

      setProfile((prev) => {
        if (!prev) return prev;

        const updatedPosts = (prev.posts ?? []).filter(
          (post) => Number(post.id) !== Number(postId)
        );

        return {
          ...prev,
          posts: updatedPosts,
          meta: {
            ...prev.meta,
            posts_count: Math.max(
              (prev.meta?.posts_count ?? updatedPosts.length) - 1,
              0
            ),
          },
        };
      });
    } catch (error) {
      console.error("Erreur suppression post profil :", error);
    }
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

  const availableGamesWithImages = (Array.isArray(availableGames)
    ? availableGames
    : []
  ).map((game) => ({
    ...game,
    cover_img: game.cover_img
      ? getImageUrl(game.cover_img, imageVersion)
      : null,
  }));

  const availablePlatformsWithImages = (Array.isArray(availablePlatforms)
    ? availablePlatforms
    : []
  ).map((platform) => ({
    ...platform,
    logo: platform.logo ? getImageUrl(platform.logo, imageVersion) : null,
  }));

  const selectedGameWithImage = selectedGame
    ? {
        ...selectedGame,
        cover_img: selectedGame.cover_img
          ? getImageUrl(selectedGame.cover_img, imageVersion)
          : null,
      }
    : null;

  const selectedPlatformWithImage = selectedPlatform
    ? {
        ...selectedPlatform,
        logo: selectedPlatform.logo
          ? getImageUrl(selectedPlatform.logo, imageVersion)
          : null,
      }
    : null;

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
          platforms={platforms}
          getImageUrl={(path) => getImageUrl(path, imageVersion)}
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
            platformsCount={platformsCount}
            formatDate={formatDate}
            getImageUrl={(path) => getImageUrl(path, imageVersion)}
            onOpenAddGameModal={handleOpenAddGameModal}
            onEditGame={handleOpenEditGameModal}
            onDeleteGame={handleDeleteGame}
            onOpenAddPlatformModal={handleOpenAddPlatformModal}
            onEditPlatform={handleOpenEditPlatformModal}
            onDeletePlatform={handleDeletePlatform}
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
          authUser={authUser}
          onDeletePost={handleDeletePost}
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

      <AddUserGameModal
        isOpen={isAddGameModalOpen}
        onClose={handleCloseAddGameModal}
        games={availableGamesWithImages}
        onSubmit={handleAddUserGame}
        isSubmitting={isSubmittingAddGame || isLoadingAvailableGames}
        mode="add"
      />

      <AddUserGameModal
        isOpen={isEditGameModalOpen}
        onClose={handleCloseEditGameModal}
        games={availableGamesWithImages}
        onSubmit={handleUpdateUserGame}
        isSubmitting={isSubmittingEditGame || isLoadingAvailableGames}
        mode="edit"
        initialGame={selectedGameWithImage}
      />

      <AddUserPlatformModal
        isOpen={isAddPlatformModalOpen}
        onClose={handleCloseAddPlatformModal}
        platforms={availablePlatformsWithImages}
        onSubmit={handleAddUserPlatform}
        isSubmitting={isSubmittingAddPlatform || isLoadingAvailablePlatforms}
        mode="add"
      />

      <AddUserPlatformModal
        isOpen={isEditPlatformModalOpen}
        onClose={handleCloseEditPlatformModal}
        platforms={availablePlatformsWithImages}
        onSubmit={handleUpdateUserPlatform}
        isSubmitting={isSubmittingEditPlatform || isLoadingAvailablePlatforms}
        mode="edit"
        initialPlatform={selectedPlatformWithImage}
      />

      {addGameError &&
      (isAddGameModalOpen || isEditGameModalOpen || isDeletingGame) ? (
        <div className="fixed bottom-4 left-1/2 z-[60] w-full max-w-md -translate-x-1/2 px-4">
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 backdrop-blur-md">
            {addGameError}
          </div>
        </div>
      ) : null}

      {addPlatformError &&
      (isAddPlatformModalOpen ||
        isEditPlatformModalOpen ||
        isDeletingPlatform) ? (
        <div className="fixed bottom-20 left-1/2 z-[60] w-full max-w-md -translate-x-1/2 px-4">
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 backdrop-blur-md">
            {addPlatformError}
          </div>
        </div>
      ) : null}
    </section>
  );
}