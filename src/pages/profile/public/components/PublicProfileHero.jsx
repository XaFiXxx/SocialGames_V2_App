import {
  Users,
  Gamepad2,
  UserPlus,
  Heart,
  Check,
  UserCheck,
  MessageSquare,
  Swords,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";
import StatTile from "../../components/StatTile";

export default function PublicProfileHero({
  user,
  meta,
  fullName,
  initials,
  avatarSrc,
  coverSrc,
  followersCount,
  followingCount,
  friendsCount,
  gamesCount,
  profileBadges,
  isOwnProfile,
  actionLoading,
  openModal,
  handleFollowToggle,
  handleFriendAction,
  handleStartConversation,
}) {
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
      </div>

      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-14 flex flex-col gap-6 pt-4 lg:-mt-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end">
            <div
              onClick={() => openModal("avatar")}
              className="relative z-20 flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[30px] border-4 border-[#060816] bg-white/5 text-3xl font-black text-[var(--text-main)] shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:h-32 sm:w-32"
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
  );
}