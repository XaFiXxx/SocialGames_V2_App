import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Mail,
  Trophy,
  Users,
  Swords,
  Gamepad2,
  MapPin,
  UserRound,
  X,
  Upload,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

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

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return `${path}?v=${imageVersion}`;
    return `${import.meta.env.VITE_API_URL}/${path}?v=${imageVersion}`;
  };

  const openModal = (type) => {
    setModal({ type, isOpen: true });
  };

  const closeModal = () => {
    setModal({ type: null, isOpen: false });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
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

  const formatDate = (dateString) => {
    if (!dateString) return "Non renseignée";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("fr-BE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const memberSince = (dateString) => {
    if (!dateString) return "Non renseigné";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("fr-BE", {
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const avatarSrc = getImageUrl(user?.avatar_url);
  const coverSrc = getImageUrl(user?.cover_url);

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
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 text-sm text-[var(--text-secondary)] shadow-sm">
          Chargement du profil...
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
          <div
            onClick={() => openModal("cover")}
            className="h-56 cursor-pointer sm:h-64 lg:h-80"
          >
            {coverSrc ? (
              <img
                src={coverSrc}
                alt="Cover"
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-[var(--primary)] to-purple-500" />
            )}
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-4 pt-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div
                  onClick={() => openModal("avatar")}
                  className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-4 border-[var(--bg-card)] bg-[var(--bg-main)] text-2xl font-bold text-[var(--text-main)] shadow-sm"
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
                  <h1 className="text-2xl font-bold text-[var(--text-main)]">
                    {fullName}
                  </h1>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    @{user?.username || "username"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                  Modifier le profil
                </Link>

                <Link
                  to={`/users/${user?.id}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-5 py-3 text-sm font-semibold text-[var(--text-main)] transition hover:opacity-90"
                >
                  Voir mon profil public
                </Link>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              {user?.biography?.trim()
                ? user.biography
                : "Aucune biographie renseignée pour le moment."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {profileBadges.map((badge) => (
                <span
                  key={badge.key}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-main)]"
                >
                  {badge.icon}
                  {badge.label}
                </span>
              ))}

              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-main)]">
                {user?.newsletter
                  ? "Newsletter activée"
                  : "Newsletter désactivée"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                Informations du profil
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-main)]">
                      Email
                    </span>
                  </div>
                  <p className="mt-3 break-all text-sm text-[var(--text-secondary)]">
                    {user?.email || "Non renseigné"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      className="text-[var(--text-secondary)]"
                    />
                    <span className="text-sm font-medium text-[var(--text-main)]">
                      Date de naissance
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    {formatDate(user?.birthday)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-main)]">
                      Localisation
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    {user?.location || "Non renseignée"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-3">
                    <Gamepad2
                      size={18}
                      className="text-[var(--text-secondary)]"
                    />
                    <span className="text-sm font-medium text-[var(--text-main)]">
                      Compte
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    {user?.is_admin ? "Administrateur" : "Utilisateur"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                À propos
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                {user?.biography?.trim()
                  ? user.biography
                  : "Cet utilisateur n’a pas encore ajouté de biographie."}
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                Réseau
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Followers
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {followersCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Abonnements
                  </p>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {followingCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <p className="text-xs text-[var(--text-secondary)]">Amis</p>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {friendsCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                Statistiques
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Users size={16} />
                    <span className="text-xs">Followers</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {followersCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <UserRound size={16} />
                    <span className="text-xs">Following</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {followingCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Swords size={16} />
                    <span className="text-xs">Amis</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {friendsCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Gamepad2 size={16} />
                    <span className="text-xs">Jeux</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {gamesCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Trophy size={16} />
                    <span className="text-xs">Posts</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {postsCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Gamepad2 size={16} />
                    <span className="text-xs">Plateformes</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    {platformsCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[var(--text-main)]">
                  Amis
                </h2>

                {friendsCount > 0 && (
                  <span className="text-xs text-[var(--text-secondary)]">
                    {friendsCount} au total
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-3">
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
                        className="flex items-center gap-3 rounded-2xl bg-[var(--bg-main)] px-4 py-3 transition hover:opacity-90"
                      >
                        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-[var(--bg-card)] text-sm font-bold text-[var(--text-main)]">
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

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                            {friendName}
                          </p>
                          <p className="truncate text-xs text-[var(--text-secondary)]">
                            @{friend?.username}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-2xl bg-[var(--bg-main)] px-4 py-4 text-sm text-[var(--text-secondary)]">
                    Aucun ami affiché pour le moment.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                Profil
              </h2>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]">
                  @{user?.username || "username"}
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]">
                  {user?.newsletter
                    ? "Inscrit à la newsletter"
                    : "Non inscrit à la newsletter"}
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]">
                  Compte créé en {memberSince(user?.created_at)}
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]">
                  {platformsCount} plateforme{platformsCount > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {modal.isOpen && (
        <div onClick={closeModal} className="fixed inset-0 z-50 bg-black/90">
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
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
                    className="max-h-[82vh] max-w-[82vw] rounded-3xl object-contain shadow-2xl"
                  />
                ) : (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-72 w-72 items-center justify-center rounded-3xl bg-[var(--bg-main)] text-6xl font-bold text-[var(--text-main)] shadow-2xl"
                  >
                    {initials}
                  </div>
                )
              ) : coverSrc ? (
                <img
                  onClick={(e) => e.stopPropagation()}
                  src={coverSrc}
                  alt="Cover preview"
                  className="max-h-[82vh] max-w-[96vw] rounded-3xl object-contain shadow-2xl"
                />
              ) : (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="h-[40vh] w-[96vw] max-w-6xl rounded-3xl bg-gradient-to-r from-[var(--primary)] to-purple-500 shadow-2xl"
                />
              )}

              <div className="pointer-events-auto absolute bottom-2 left-1/2 -translate-x-1/2 sm:bottom-4">
                <label
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--primary-hover)]"
                >
                  <Upload size={18} />
                  Changer l'image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}