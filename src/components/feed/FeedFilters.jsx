export default function FeedFilters() {
  return (
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
  );
}