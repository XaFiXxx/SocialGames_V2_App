import { Flame, Trophy, Users, Swords, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL}/${path}`;
}

function getUserName(user) {
  if (!user) return "Ton espace";
  if (user.name && user.surname) return `${user.name} ${user.surname}`;
  if (user.username) return user.username;
  return "Ton espace";
}

function getUserInitials(user) {
  if (!user) return "SB";

  if (user.name && user.surname) {
    return `${user.name[0] ?? ""}${user.surname[0] ?? ""}`.toUpperCase();
  }

  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }

  return "SB";
}

function SidebarNavItem({ icon: Icon, label, active = false }) {
  return (
    <button
      type="button"
      className={`group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-white/10 text-[var(--text-main)]"
          : "text-[var(--text-main)] hover:bg-white/10"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </span>

      <ChevronRight
        size={16}
        className="text-[var(--text-secondary)] transition group-hover:translate-x-0.5"
      />
    </button>
  );
}

export default function FeedLeftSidebar({ postsCount }) {
  const { user } = useAuth();

  const avatarSrc = getImageUrl(user?.avatar_url);
  const displayName = getUserName(user);
  const initials = getUserInitials(user);

  return (
    <aside className="hidden self-start xl:block">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-lg font-bold text-white shadow-lg">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-[var(--text-main)]">
                {displayName}
              </h2>
              <p className="truncate text-sm text-[var(--text-secondary)]">
                {user?.username ? `@${user.username}` : "Gère ton profil et ton activité"}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <SidebarNavItem icon={Flame} label="Fil d’actualité" active />
            <SidebarNavItem icon={Users} label="Mes groupes" />
            <SidebarNavItem icon={Swords} label="Mes teams" />
            <SidebarNavItem icon={Trophy} label="Mes objectifs" />
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-[var(--text-main)]">
            Ton activité
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-[var(--text-secondary)]">Posts</p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                {postsCount}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-[var(--text-secondary)]">Groups</p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                5
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-[var(--text-secondary)]">Teams</p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                2
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-[var(--text-secondary)]">Likes</p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                84
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}