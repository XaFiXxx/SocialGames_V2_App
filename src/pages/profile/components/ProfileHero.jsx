import { Link } from "react-router";
import {
  Upload,
  Sparkles,
  ShieldCheck,
  Users,
  UserRound,
  Swords,
  Gamepad2,
  Monitor,
} from "lucide-react";
import StatTile from "./StatTile";

export default function ProfileHero({
  user,
  fullName,
  initials,
  avatarSrc,
  coverSrc,
  followersCount,
  followingCount,
  friendsCount,
  gamesCount,
  profileBadges,
  platforms = [],
  getImageUrl,
  openModal,
}) {
  return (
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

        <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-medium text-white/80 backdrop-blur-md">
          <Upload size={14} />
          Changer la cover
        </div>
      </div>

      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-6 pt-4 lg:-mt-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 md:flex-row md:items-end">
            <div
              onClick={() => openModal("avatar")}
              className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[30px] border-4 border-[#060816] bg-white/5 text-3xl font-black text-[var(--text-main)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:h-32 sm:w-32"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                initials
              )}

              <div className="absolute inset-0 hidden items-center justify-center bg-black/35 text-white group-hover:flex">
                <Upload size={20} />
              </div>
            </div>

            <div className="pb-1">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
                <Sparkles size={14} />
                Mon espace joueur
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text-main)] sm:text-4xl">
                {fullName}
              </h1>

              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                @{user?.username || "username"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/profile/edit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01]"
            >
              Modifier le profil
            </Link>

            <Link
              to={`/users/${user?.id}`}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-[var(--text-main)] backdrop-blur-sm transition hover:bg-white/10"
            >
              Voir mon profil public
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="max-w-3xl text-sm leading-8 text-[var(--text-secondary)] sm:text-[15px]">
              {user?.biography?.trim()
                ? user.biography
                : "Aucune biographie renseignée pour le moment. Personnalise ton profil pour montrer ton univers gaming à la communauté."}
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
                {user?.newsletter ? "Newsletter activée" : "Newsletter désactivée"}
              </span>
            </div>

            {platforms.length > 0 ? (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Plateformes
                </p>

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
                          <Monitor
                            size={18}
                            className="text-[var(--text-secondary)]"
                          />
                        )}
                      </div>

                      <span className="text-sm font-medium text-[var(--text-main)]">
                        {platform.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile icon={Users} label="Followers" value={followersCount} />
            <StatTile icon={UserRound} label="Following" value={followingCount} />
            <StatTile icon={Swords} label="Amis" value={friendsCount} />
            <StatTile icon={Gamepad2} label="Jeux" value={gamesCount} />
          </div>
        </div>
      </div>
    </div>
  );
}