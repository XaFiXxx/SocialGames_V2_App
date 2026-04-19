import { Flame, Trophy, Users, Swords } from "lucide-react";

export default function FeedLeftSidebar({ postsCount }) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-lg font-bold text-white">
              SB
            </div>

            <div>
              <h2 className="text-base font-semibold text-[var(--text-main)]">
                Ton espace
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Gère ton profil et ton activité
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
            >
              <Flame size={18} />
              Fil d’actualité
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
            >
              <Users size={18} />
              Mes groupes
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
            >
              <Swords size={18} />
              Mes teams
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-[var(--text-main)] transition hover:bg-[var(--bg-main)]"
            >
              <Trophy size={18} />
              Mes objectifs
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[var(--text-main)]">
            Ton activité
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--bg-main)] p-4">
              <p className="text-xs text-[var(--text-secondary)]">Posts</p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                {postsCount}
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--bg-main)] p-4">
              <p className="text-xs text-[var(--text-secondary)]">Groups</p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                5
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--bg-main)] p-4">
              <p className="text-xs text-[var(--text-secondary)]">Teams</p>
              <p className="mt-2 text-xl font-bold text-[var(--text-main)]">
                2
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--bg-main)] p-4">
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