import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Mail,
  Trophy,
  Users,
  Gamepad2,
  MapPin,
  UserRound,
  X,
  UserPlus,
  Heart,
  Check,
  UserCheck,
  MessageSquare,
  Swords,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Monitor,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../services/api";

function GlassCard({ title, children, action }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-[var(--text-main)]">{value}</p>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, breakAll = false }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-[var(--text-secondary)]">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-[var(--text-main)]">
          {label}
        </span>
      </div>
      <p
        className={`mt-3 text-sm text-[var(--text-secondary)] ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [modal, setModal] = useState({
    type: null,
    isOpen: false,
  });

  const openModal = (type) => {
    setModal({ type, isOpen: true });
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL}/${path}`;
  };

  const getPostMedia = (post) => {
    if (!post?.media || !Array.isArray(post.media)) return [];
    return post.media;
  };

  const getFirstImageFromPost = (post) => {
    const media = getPostMedia(post);
    const image = media.find((item) =>
      item.type?.toLowerCase().includes("image")
    );
    return image?.url ? getImageUrl(image.url) : null;
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

  const formatDate = (dateString) => {
    if (!dateString) return "Non renseignée";

    return new Intl.DateTimeFormat("fr-BE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Date inconnue";

    return new Intl.DateTimeFormat("fr-BE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const memberSince = (dateString) => {
    if (!dateString) return "Non renseigné";

    return new Intl.DateTimeFormat("fr-BE", {
      month: "long",
      year: "numeric",
    }).format(new Date(dateString));
  };

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

  const renderFriendButton = () => {
    if (!meta?.friend_status) {
      return (
        <button
          type="button"
          onClick={handleFriendAction}
          disabled={actionLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserPlus size={18} />
          Ajouter en ami
        </button>
      );
    }

    if (meta.friend_status === "pending" && meta.friend_request_sent_by_me) {
      return (
        <button
          type="button"
          onClick={handleFriendAction}
          disabled={actionLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserCheck size={18} />
          Demande envoyée
        </button>
      );
    }

    if (meta.friend_status === "pending" && !meta.friend_request_sent_by_me) {
      return (
        <button
          type="button"
          onClick={handleFriendAction}
          disabled={actionLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Check size={18} />
          Accepter la demande
        </button>
      );
    }

    if (meta.friend_status === "accepted") {
      return (
        <button
          type="button"
          onClick={handleFriendAction}
          disabled={actionLoading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <UserCheck size={18} />
          Ami
        </button>
      );
    }

    return null;
  };

  if (loading) {
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

  if (!user || !meta) {
    return (
      <section className="relative overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(6,182,212,0.10),_transparent_26%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 text-[var(--text-main)] shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            Profil introuvable.
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
        <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div
            onClick={() => openModal("cover")}
            className="group relative h-64 cursor-pointer overflow-hidden sm:h-72 lg:h-[360px]"
          >
            {coverSrc ? (
              <img
                src={coverSrc}
                alt="Cover"
                className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-cyan-400" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#060816] via-[#060816]/20 to-transparent" />
          </div>

          <div className="px-6 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-6 pt-4 lg:-mt-16 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-end">
                <div
                  onClick={() => openModal("avatar")}
                  className="flex z-10 h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[30px] border-4 border-[#060816] bg-white/5 text-3xl font-black text-[var(--text-main)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:h-32 sm:w-32"
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="pb-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
                    <Sparkles size={14} />
                    Profil public
                  </div>

                  <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-4xl">
                    {fullName}
                  </h1>

                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    @{user?.username || "username"}
                  </p>
                </div>
              </div>

              {!isOwnProfile ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    disabled={actionLoading}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      meta.is_following
                        ? "border border-white/10 bg-white/5 text-[var(--text-main)] backdrop-blur-sm hover:bg-white/10"
                        : "bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-white shadow-lg hover:scale-[1.01]"
                    }`}
                  >
                    <Heart size={18} />
                    {meta.is_following ? "Ne plus suivre" : "Suivre"}
                  </button>

                  {renderFriendButton()}

                  <button
                    type="button"
                    onClick={handleStartConversation}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MessageSquare size={18} />
                    Envoyer un message
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                  >
                    Voir mon profil privé
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div>
                <p className="max-w-3xl text-sm leading-8 text-[var(--text-secondary)] sm:text-[15px]">
                  {user?.biography?.trim()
                    ? user.biography
                    : "Aucune biographie renseignée pour le moment."}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {profileBadges.map((badge) => (
                    <span
                      key={badge.key}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-main)] backdrop-blur-sm"
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  ))}

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[var(--text-main)] backdrop-blur-sm">
                    <ShieldCheck size={14} />
                    {user?.newsletter
                      ? "Newsletter activée"
                      : "Newsletter désactivée"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatTile icon={Users} label="Followers" value={followersCount} />
                <StatTile icon={Heart} label="Following" value={followingCount} />
                <StatTile icon={Swords} label="Amis" value={friendsCount} />
                <StatTile icon={Gamepad2} label="Jeux" value={gamesCount} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <GlassCard title="Informations du profil">
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoTile
                  icon={Mail}
                  label="Email"
                  value={user?.email || "Non renseigné"}
                  breakAll
                />
                <InfoTile
                  icon={CalendarDays}
                  label="Date de naissance"
                  value={formatDate(user?.birthday)}
                />
                <InfoTile
                  icon={MapPin}
                  label="Localisation"
                  value={user?.location || "Non renseignée"}
                />
                <InfoTile
                  icon={Gamepad2}
                  label="Compte"
                  value={user?.is_admin ? "Administrateur" : "Utilisateur"}
                />
              </div>
            </GlassCard>

            <GlassCard title="Plateformes">
              {platforms.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                    >
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                        {platform.logo ? (
                          <img
                            src={getImageUrl(platform.logo)}
                            alt={platform.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Monitor size={18} className="text-[var(--text-secondary)]" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-[var(--text-main)]">
                        {platform.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--text-secondary)]">
                  Aucune plateforme ajoutée pour le moment.
                </div>
              )}
            </GlassCard>

            <GlassCard
              title="Jeux"
              action={
                gamesCount > 0 ? (
                  <span className="text-xs text-[var(--text-secondary)]">
                    {gamesCount} au total
                  </span>
                ) : null
              }
            >
              {games.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {games.map((game) => (
                    <div
                      key={game.id}
                      className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                      <div className="h-44 w-full overflow-hidden bg-white/5">
                        {game.cover_img ? (
                          <img
                            src={getImageUrl(game.cover_img)}
                            alt={game.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Gamepad2 size={28} className="text-[var(--text-secondary)]" />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="line-clamp-1 text-sm font-semibold text-[var(--text-main)]">
                          {game.name}
                        </p>

                        <p className="mt-2 text-xs text-[var(--text-secondary)]">
                          {game.developer ||
                            game.publisher ||
                            "Informations non renseignées"}
                        </p>

                        <p className="mt-2 text-xs text-[var(--text-secondary)]">
                          {game.release_at
                            ? `Sortie : ${formatDate(game.release_at)}`
                            : "Date de sortie non renseignée"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--text-secondary)]">
                  Aucun jeu ajouté au profil pour le moment.
                </div>
              )}
            </GlassCard>

            <GlassCard title="À propos">
              <p className="text-sm leading-8 text-[var(--text-secondary)]">
                {user?.biography?.trim()
                  ? user.biography
                  : "Cet utilisateur n’a pas encore ajouté de biographie."}
              </p>
            </GlassCard>

            <GlassCard title="Réseau">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                    Followers
                  </p>
                  <p className="mt-3 text-3xl font-black text-[var(--text-main)]">
                    {followersCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                    Abonnements
                  </p>
                  <p className="mt-3 text-3xl font-black text-[var(--text-main)]">
                    {followingCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                    Amis
                  </p>
                  <p className="mt-3 text-3xl font-black text-[var(--text-main)]">
                    {friendsCount}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          <aside className="space-y-6">
            <GlassCard title="Statistiques">
              <div className="grid grid-cols-2 gap-4">
                <StatTile icon={Users} label="Followers" value={followersCount} />
                <StatTile icon={Heart} label="Following" value={followingCount} />
                <StatTile icon={Swords} label="Amis" value={friendsCount} />
                <StatTile icon={Gamepad2} label="Jeux" value={gamesCount} />
                <StatTile icon={Trophy} label="Posts" value={postsCount} />
                <StatTile
                  icon={LayoutGrid}
                  label="Plateformes"
                  value={platformsCount}
                />
              </div>
            </GlassCard>

            <GlassCard title="Amis">
              <div className="space-y-3">
                {friends.length > 0 ? (
                  friends.slice(0, 5).map((friend) => {
                    const friendName =
                      friend?.name && friend?.surname
                        ? `${friend.name} ${friend.surname}`
                        : friend?.username || "Utilisateur";

                    const friendInitials =
                      friend?.name && friend?.surname
                        ? `${friend.name[0]}${friend.surname[0]}`.toUpperCase()
                        : friend?.username?.slice(0, 2).toUpperCase() || "U";

                    const friendAvatar = getImageUrl(friend?.avatar_url);

                    return (
                      <Link
                        key={friend.id}
                        to={`/users/${friend.id}`}
                        className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition hover:bg-white/10"
                      >
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white/5 text-sm font-bold text-[var(--text-main)]">
                          {friendAvatar ? (
                            <img
                              src={friendAvatar}
                              alt={friendName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            friendInitials
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                            {friendName}
                          </p>
                          <p className="truncate text-xs text-[var(--text-secondary)]">
                            @{friend?.username}
                          </p>
                        </div>

                        <ChevronRight
                          size={16}
                          className="text-[var(--text-secondary)] transition group-hover:translate-x-0.5"
                        />
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--text-secondary)]">
                    Aucun ami affiché pour le moment.
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard title="Résumé du profil">
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-main)]">
                  @{user?.username || "username"}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-main)]">
                  {user?.newsletter
                    ? "Inscrit à la newsletter"
                    : "Non inscrit à la newsletter"}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-main)]">
                  Compte créé en {memberSince(user?.created_at)}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-main)]">
                  {platformsCount} plateforme{platformsCount > 1 ? "s" : ""}
                </div>
              </div>
            </GlassCard>
          </aside>
        </div>

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
      </div>

      {modal.isOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-[#02040b]/95 backdrop-blur-md"
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur transition hover:bg-white/10"
            aria-label="Fermer"
          >
            <X size={22} />
          </button>

          <div className="flex h-full w-full items-center justify-center px-4 py-6 sm:px-8">
            <div className="relative flex h-full w-full items-center justify-center">
              {modal.type === "avatar" ? (
                avatarSrc ? (
                  <img
                    onClick={(e) => e.stopPropagation()}
                    src={avatarSrc}
                    alt="Avatar preview"
                    className="max-h-[82vh] max-w-[82vw] rounded-[32px] object-contain shadow-2xl"
                  />
                ) : (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-72 w-72 items-center justify-center rounded-[32px] border border-white/10 bg-white/5 text-6xl font-black text-[var(--text-main)] shadow-2xl backdrop-blur-xl"
                  >
                    {initials}
                  </div>
                )
              ) : coverSrc ? (
                <img
                  onClick={(e) => e.stopPropagation()}
                  src={coverSrc}
                  alt="Cover preview"
                  className="max-h-[82vh] max-w-[96vw] rounded-[32px] object-contain shadow-2xl"
                />
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="h-[40vh] w-[96vw] max-w-6xl rounded-[32px] bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-cyan-400 shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}