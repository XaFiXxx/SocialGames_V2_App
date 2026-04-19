export default function GlassCard({ title, children, action }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[var(--text-main)]">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}