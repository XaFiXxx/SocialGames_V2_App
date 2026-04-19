import {
  CalendarDays,
  Mail,
  Users,
  Swords,
  Gamepad2,
  MapPin,
  Monitor,
} from "lucide-react";
import GlassCard from "./GlassCard";
import InfoTile from "./InfoTile";

export default function ProfileMainColumn({
  user,
  platforms,
  games,
  followersCount,
  followingCount,
  friendsCount,
  gamesCount,
  formatDate,
  getImageUrl,
}) {
  return (
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
                      <Gamepad2
                        size={28}
                        className="text-[var(--text-secondary)]"
                      />
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
            : "Cet utilisateur n’a pas encore ajouté de biographie. Une belle bio permet de mieux présenter son univers, ses jeux et son style de joueur."}
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
  );
}