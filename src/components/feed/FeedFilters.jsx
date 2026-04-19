const filters = [
  { key: "for-you", label: "Pour toi", active: true },
  { key: "recruitment", label: "Recrutement" },
  { key: "highlights", label: "Highlights" },
  { key: "discussions", label: "Discussions" },
];

export default function FeedFilters() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
              filter.active
                ? "bg-gradient-to-r from-[var(--primary)] to-cyan-400 text-white shadow-lg"
                : "border border-white/10 bg-white/5 text-[var(--text-main)] hover:bg-white/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}