export default function GlassCard({
  title,
  children,
  action = null,
  className = "",
  contentClassName = "",
  noPadding = false,
  headerClassName = "",
}) {
  return (
    <div
      className={`rounded-[30px] border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl ${className}`}
    >
      {(title || action) && (
        <div
          className={`flex items-center justify-between gap-4 ${
            noPadding ? "px-5 pt-5" : "px-5 pt-5"
          } ${headerClassName}`}
        >
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-[var(--text-main)]">
                {title}
              </h2>
            ) : null}
          </div>

          {action}
        </div>
      )}

      <div
        className={`${
          noPadding ? "" : "p-5"
        } ${(title || action) && !noPadding ? "pt-4" : ""} ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}