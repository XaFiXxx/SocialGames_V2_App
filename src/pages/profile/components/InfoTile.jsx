export default function InfoTile({ icon: Icon, label, value, breakAll = false }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-[var(--text-secondary)]">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-[var(--text-main)]">
          {label}
        </span>
      </div>

      <p
        className={`mt-3 text-sm text-[var(--text-secondary)] ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}