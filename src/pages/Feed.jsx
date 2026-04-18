import {
  Flame,
  Trophy,
  Users,
  Swords,
  Image,
  Smile,
  Send,
  MessageCircle,
  Heart,
  Share2,
} from "lucide-react";

const posts = [
  {
    id: 1,
    author: "NovaStrike",
    handle: "@novastrike",
    game: "Valorant",
    time: "Il y a 12 min",
    content:
      "On recrute un main smokes pour compléter la line-up. Niveau platine / diamant minimum. Ambiance chill mais sérieuse.",
    likes: 24,
    comments: 8,
    shares: 3,
    tag: "Recrutement",
  },
  {
    id: 2,
    author: "LinaKitsune",
    handle: "@linakitsune",
    game: "League of Legends",
    time: "Il y a 35 min",
    content:
      "Premier pentakill de la saison, ça fait trop plaisir. J’hésite à monter une team flex pour jouer régulièrement le soir.",
    likes: 52,
    comments: 14,
    shares: 6,
    tag: "Highlight",
  },
  {
    id: 3,
    author: "RoguePixel",
    handle: "@roguepixel",
    game: "Apex Legends",
    time: "Il y a 1 h",
    content:
      "Quelqu’un connaît un bon groupe FR chill pour ranked ce week-end ? Je cherche des mates avec micro et bonne com.",
    likes: 17,
    comments: 11,
    shares: 2,
    tag: "Discussion",
  },
];

const suggestedGroups = [
  { id: 1, name: "Valorant FR", members: "12,4k membres" },
  { id: 2, name: "League Chill & Flex", members: "8,9k membres" },
  { id: 3, name: "Apex Ranked Europe", members: "6,1k membres" },
];

const suggestedTeams = [
  { id: 1, name: "Night Owls", game: "Valorant" },
  { id: 2, name: "Blue Nexus", game: "League of Legends" },
  { id: 3, name: "Drop Masters", game: "Apex Legends" },
];

export default function FeedPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
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
                    12
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

        <main className="min-w-0 space-y-6">
          <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] font-semibold text-white">
                SB
              </div>

              <div className="min-w-0 flex-1">
                <textarea
                  rows={4}
                  placeholder="Partage une recherche de team, un highlight ou une discussion gaming..."
                  className="w-full resize-none rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)]"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)] transition hover:opacity-90"
                    >
                      <Image size={16} />
                      Image
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-3 py-2 text-sm text-[var(--text-main)] transition hover:opacity-90"
                    >
                      <Smile size={16} />
                      Mood
                    </button>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                  >
                    <Send size={16} />
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
            >
              Pour toi
            </button>

            <button
              type="button"
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-main)]"
            >
              Recrutement
            </button>

            <button
              type="button"
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-main)]"
            >
              Highlights
            </button>

            <button
              type="button"
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-main)]"
            >
              Discussions
            </button>
          </div>

          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] font-semibold text-white">
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="text-sm font-semibold text-[var(--text-main)]">
                        {post.author}
                      </h2>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {post.handle}
                      </span>
                      <span className="text-sm text-[var(--text-secondary)]">
                        •
                      </span>
                      <span className="text-sm text-[var(--text-secondary)]">
                        {post.time}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--bg-main)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
                        {post.game}
                      </span>
                      <span className="rounded-full border border-[var(--border-color)] px-3 py-1 text-xs font-medium text-[var(--text-main)]">
                        {post.tag}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--text-main)]">
                      {post.content}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--border-color)] pt-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]"
                      >
                        <Heart size={16} />
                        {post.likes}
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]"
                      >
                        <MessageCircle size={16} />
                        {post.comments}
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]"
                      >
                        <Share2 size={16} />
                        {post.shares}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-main)]">
                Groupes suggérés
              </h3>

              <div className="mt-4 space-y-3">
                {suggestedGroups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl bg-[var(--bg-main)] p-4"
                  >
                    <p className="text-sm font-medium text-[var(--text-main)]">
                      {group.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {group.members}
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-xl bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                    >
                      Rejoindre
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-main)]">
                Teams à découvrir
              </h3>

              <div className="mt-4 space-y-3">
                {suggestedTeams.map((team) => (
                  <div
                    key={team.id}
                    className="rounded-2xl bg-[var(--bg-main)] p-4"
                  >
                    <p className="text-sm font-medium text-[var(--text-main)]">
                      {team.name}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {team.game}
                    </p>
                    <button
                      type="button"
                      className="mt-3 rounded-xl border border-[var(--border-color)] px-3 py-2 text-xs font-semibold text-[var(--text-main)] transition hover:bg-[var(--bg-card)]"
                    >
                      Voir la team
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--text-main)]">
                Tendances gaming
              </h3>

              <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
                <p>#ValorantRecruitment</p>
                <p>#LoLFlexNight</p>
                <p>#ApexRankedEU</p>
                <p>#SquadBaseTeams</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}