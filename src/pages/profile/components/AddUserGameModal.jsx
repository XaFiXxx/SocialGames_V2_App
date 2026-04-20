import { useEffect, useMemo, useState } from "react";
import { X, Search, Gamepad2, Star, Pencil } from "lucide-react";

const SKILL_LEVELS = [
  "Débutant",
  "Intermédiaire",
  "Avancé",
  "Compétitif",
];

export default function AddUserGameModal({
  isOpen,
  onClose,
  games = [],
  onSubmit,
  isSubmitting = false,
  mode = "add",
  initialGame = null,
}) {
  const isEditMode = mode === "edit";

  const [search, setSearch] = useState("");
  const [selectedGameId, setSelectedGameId] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedGameId("");
      setSkillLevel("");
      setFavorite(false);
      setErrorMessage("");
      return;
    }

    if (isEditMode && initialGame) {
      setSearch(initialGame.name || "");
      setSelectedGameId(String(initialGame.id || ""));
      setSkillLevel(
        initialGame.skill_level ?? initialGame.pivot?.skill_level ?? ""
      );
      setFavorite(
        Boolean(initialGame.favorite ?? initialGame.pivot?.favorite)
      );
      setErrorMessage("");
      return;
    }

    setSearch("");
    setSelectedGameId("");
    setSkillLevel("");
    setFavorite(false);
    setErrorMessage("");
  }, [isOpen, isEditMode, initialGame]);

  const filteredGames = useMemo(() => {
    if (isEditMode && initialGame) {
      return [initialGame];
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return games;

    return games.filter((game) => {
      const name = game?.name?.toLowerCase() || "";
      const developer = game?.developer?.toLowerCase() || "";
      const publisher = game?.publisher?.toLowerCase() || "";

      return (
        name.includes(normalizedSearch) ||
        developer.includes(normalizedSearch) ||
        publisher.includes(normalizedSearch)
      );
    });
  }, [games, search, isEditMode, initialGame]);

  const selectedGame = useMemo(() => {
    if (isEditMode && initialGame) return initialGame;

    return (
      games.find((game) => String(game.id) === String(selectedGameId)) || null
    );
  }, [games, selectedGameId, isEditMode, initialGame]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGameId) {
      setErrorMessage("Tu dois sélectionner un jeu.");
      return;
    }

    setErrorMessage("");

    const payload = {
      game_id: Number(selectedGameId),
      skill_level: skillLevel || null,
      favorite,
    };

    if (onSubmit) {
      await onSubmit(payload);
      return;
    }

    console.log("AddUserGameModal payload:", payload);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#02040b]/90 backdrop-blur-md"
      onClick={handleClose}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-6 sm:px-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-[var(--bg-card)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="bg-gradient-to-r from-[var(--primary)] via-indigo-500 to-cyan-400 px-6 py-5 sm:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  Bibliothèque joueur
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {isEditMode ? "Modifier un jeu" : "Ajouter un jeu"}
                </h2>
                <p className="mt-2 text-sm text-white/80">
                  {isEditMode
                    ? "Ajuste ton niveau et définis si ce jeu doit être mis en avant sur ton profil."
                    : "Sélectionne un jeu, définis ton niveau et marque-le comme favori si tu le souhaites."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white transition hover:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-7">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.9fr)]">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-main)]">
                  {isEditMode ? "Jeu sélectionné" : "Rechercher un jeu"}
                </label>

                {isEditMode ? (
                  <div className="rounded-[24px] border border-white/10 bg-[var(--bg-secondary)] p-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                        {selectedGame?.cover_img ? (
                          <img
                            src={selectedGame.cover_img}
                            alt={selectedGame.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Gamepad2
                            size={18}
                            className="text-[var(--text-secondary)]"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                          {selectedGame?.name || "Jeu inconnu"}
                        </p>
                        <p className="truncate text-xs text-[var(--text-secondary)]">
                          {selectedGame?.developer ||
                            selectedGame?.publisher ||
                            "Informations non renseignées"}
                        </p>
                      </div>

                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[var(--text-secondary)]">
                        <Pencil size={16} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search
                        size={16}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Ex: Valorant, League of Legends, EA FC..."
                        className="w-full rounded-2xl border border-white/10 bg-[var(--bg-secondary)] px-4 py-3 pl-11 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-cyan-400"
                      />
                    </div>

                    <div className="mt-4 rounded-[24px] border border-white/10 bg-[var(--bg-secondary)] p-3">
                      <div className="mb-3 flex items-center justify-between gap-3 px-1">
                        <p className="text-sm font-medium text-[var(--text-main)]">
                          Jeux disponibles
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {filteredGames.length} résultat
                          {filteredGames.length > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                        {filteredGames.length > 0 ? (
                          filteredGames.map((game) => {
                            const isSelected =
                              String(selectedGameId) === String(game.id);

                            return (
                              <button
                                key={game.id}
                                type="button"
                                onClick={() => {
                                  setSelectedGameId(String(game.id));
                                  setErrorMessage("");
                                }}
                                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                                  isSelected
                                    ? "border-cyan-400 bg-cyan-400/10"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                }`}
                              >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                                  {game.cover_img ? (
                                    <img
                                      src={game.cover_img}
                                      alt={game.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Gamepad2
                                      size={18}
                                      className="text-[var(--text-secondary)]"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                                    {game.name}
                                  </p>
                                  <p className="truncate text-xs text-[var(--text-secondary)]">
                                    {game.developer ||
                                      game.publisher ||
                                      "Informations non renseignées"}
                                  </p>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--text-secondary)]">
                            Aucun jeu ne correspond à la recherche.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-[var(--bg-secondary)] p-5">
                  <h3 className="text-sm font-semibold text-[var(--text-main)]">
                    Paramètres du jeu
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--text-main)]">
                        Niveau
                      </label>
                      <select
                        value={skillLevel}
                        onChange={(e) => setSkillLevel(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text-main)] outline-none transition focus:border-cyan-400"
                      >
                        <option value="">Non renseigné</option>
                        {SKILL_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10">
                      <input
                        type="checkbox"
                        checked={favorite}
                        onChange={(e) => setFavorite(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-white/10 bg-white/5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-amber-300" />
                          <p className="text-sm font-medium text-[var(--text-main)]">
                            Marquer comme favori
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          Ce jeu pourra être mis en avant sur ton profil.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-[var(--bg-secondary)] p-5">
                  <h3 className="text-sm font-semibold text-[var(--text-main)]">
                    Aperçu
                  </h3>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Jeu sélectionné
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                        {selectedGame?.name || "Aucun jeu sélectionné"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Niveau
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                        {skillLevel || "Non renseigné"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Favori
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                        {favorite ? "Oui" : "Non"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="mt-5 text-sm text-red-400">{errorMessage}</p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[var(--text-main)] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Mise à jour..."
                    : "Ajout..."
                  : isEditMode
                  ? "Enregistrer les modifications"
                  : "Ajouter le jeu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}