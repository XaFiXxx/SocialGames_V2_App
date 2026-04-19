export default function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-[var(--text-main)]">{value}</p>
    </div>
  );
}