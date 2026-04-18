import { useState } from "react";
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
  const { user, refreshUser } = useAuth();

  const [modal, setModal] = useState({
    type: null,
    isOpen: false,
  });

  const [imageVersion, setImageVersion] = useState(Date.now());

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
      await api.post(`/api/user/${modal.type}`, formData);
      await refreshUser();
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
            <div className="-mt-12 pt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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

              <Link
                to="/profile/edit"
                className="inline-flex items-center justify-center rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
              >
                Modifier le profil
              </Link>
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              {user?.biography?.trim()
                ? user.biography
                : "Aucune biographie renseignée pour le moment."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {user?.location && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-main)]">
                  <MapPin size={14} />
                  {user.location}
                </span>
              )}

              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-main)]">
                <UserRound size={14} />
                Membre depuis {memberSince(user?.created_at)}
              </span>

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
                    <span className="text-xs">Groupes</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    0
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Swords size={16} />
                    <span className="text-xs">Teams</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    0
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Trophy size={16} />
                    <span className="text-xs">Succès</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    0
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Gamepad2 size={16} />
                    <span className="text-xs">Jeux</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    0
                  </p>
                </div>
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
              </div>
            </div>
          </aside>
        </div>
      </div>

      {modal.isOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-black/90"
        >
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