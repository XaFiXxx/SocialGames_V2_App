import { Users, UserRound, Swords, Gamepad2, Trophy, LayoutGrid, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import GlassCard from "./GlassCard";
import StatTile from "./StatTile";

export default function ProfileSidebar({
  friends,
  friendsCount,
  followersCount,
  followingCount,
  gamesCount,
  postsCount,
  platformsCount,
  user,
  memberSince,
  getImageUrl,
}) {
  return (
    <aside className="space-y-6">
      <GlassCard title="Statistiques">
        <div className="grid grid-cols-2 gap-4">
          <StatTile icon={Users} label="Followers" value={followersCount} />
          <StatTile icon={UserRound} label="Following" value={followingCount} />
          <StatTile icon={Swords} label="Amis" value={friendsCount} />
          <StatTile icon={Gamepad2} label="Jeux" value={gamesCount} />
          <StatTile icon={Trophy} label="Posts" value={postsCount} />
          <StatTile icon={LayoutGrid} label="Plateformes" value={platformsCount} />
        </div>
      </GlassCard>

      <GlassCard
        title="Amis"
        action={
          friendsCount > 0 ? (
            <span className="text-xs text-[var(--text-secondary)]">
              {friendsCount} au total
            </span>
          ) : null
        }
      >
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
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white/5 text-sm font-bold text-[var(--text-main)]">
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
            {user?.newsletter ? "Inscrit à la newsletter" : "Non inscrit à la newsletter"}
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
  );
}