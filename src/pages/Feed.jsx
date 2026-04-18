export default function FeedPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">
          Bienvenue sur SquadBase
        </h1>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">
          Ton feed apparaîtra ici une fois l’authentification et les publications mises en place.
        </p>
      </div>
    </section>
  );
}