import { CalendarDays, Mail, Trophy, Users, Swords, Gamepad2 } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  const fullName =
    user?.name && user?.surname
      ? `${user.name} ${user.surname}`
      : user?.username || "Utilisateur";

  const initials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
      : user?.username?.slice(0, 2).toUpperCase() || "U";

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-sm">
          <div className="h-40 bg-gradient-to-r from-[var(--primary)] to-purple-500" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-[var(--bg-card)] bg-[var(--bg-main)] text-2xl font-bold text-[var(--text-main)] shadow-sm">
                  {initials}
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
              Joueur passionné, toujours à la recherche de nouvelles teams, de
              groupes actifs et de bonnes sessions gaming. Cette section pourra
              accueillir plus tard une vraie bio utilisateur.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-main)]">
                FPS
              </span>
              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-main)]">
                Ranked
              </span>
              <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-main)]">
                Teamplay
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
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
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
                    {user?.birthday || "Non renseignée"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-3">
                    <Gamepad2
                      size={18}
                      className="text-[var(--text-secondary)]"
                    />
                    <span className="text-sm font-medium text-[var(--text-main)]">
                      Jeu principal
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    Valorant
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-3">
                    <Trophy size={18} className="text-[var(--text-secondary)]" />
                    <span className="text-sm font-medium text-[var(--text-main)]">
                      Niveau
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    Compétitif
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                À propos
              </h2>

              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                Ici tu pourras afficher plus tard une vraie bio, les plateformes
                du joueur, ses disponibilités, son style de jeu et ses
                objectifs. Pour l’instant, cette zone sert de base visuelle
                propre pour ton profil utilisateur.
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
                    5
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Swords size={16} />
                    <span className="text-xs">Teams</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    2
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Trophy size={16} />
                    <span className="text-xs">Succès</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    12
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--bg-main)] p-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Gamepad2 size={16} />
                    <span className="text-xs">Jeux</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">
                    7
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                Jeux favoris
              </h2>

              <div className="mt-4 space-y-3">
                {["Valorant", "League of Legends", "Apex Legends"].map((game) => (
                  <div
                    key={game}
                    className="rounded-2xl bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)]"
                  >
                    {game}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}