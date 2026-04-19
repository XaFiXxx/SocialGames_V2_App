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

export default function FeedRightSidebar() {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-6">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <h3 className="text-base font-semibold text-[var(--text-main)]">
            Groupes suggérés
          </h3>

          <div className="mt-4 space-y-3">
            {suggestedGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-medium text-[var(--text-main)]">
                  {group.name}
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {group.members}
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:scale-[1.01]"
                >
                  Rejoindre
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
          <h3 className="text-base font-semibold text-[var(--text-main)]">
            Teams à découvrir
          </h3>

          <div className="mt-4 space-y-3">
            {suggestedTeams.map((team) => (
              <div
                key={team.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-sm font-medium text-[var(--text-main)]">
                  {team.name}
                </p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {team.game}
                </p>
                <button
                  type="button"
                  className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[var(--text-main)] transition hover:bg-white/10"
                >
                  Voir la team
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
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
  );
}