import { useEffect, useMemo, useState } from "react";
import { X, Search, Monitor, Pencil } from "lucide-react";

export default function AddUserPlatformModal({
  isOpen,
  onClose,
  platforms = [],
  onSubmit,
  isSubmitting = false,
  mode = "add",
  initialPlatform = null,
}) {
  const isEditMode = mode === "edit";
  const safePlatforms = Array.isArray(platforms) ? platforms : [];

  const [search, setSearch] = useState("");
  const [selectedPlatformId, setSelectedPlatformId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedPlatformId("");
      setErrorMessage("");
      return;
    }

    if (isEditMode && initialPlatform) {
      setSearch(initialPlatform.name || "");
      setSelectedPlatformId(String(initialPlatform.id || ""));
      setErrorMessage("");
      return;
    }

    setSearch("");
    setSelectedPlatformId("");
    setErrorMessage("");
  }, [isOpen, isEditMode, initialPlatform]);

  const filteredPlatforms = useMemo(() => {
    if (isEditMode && initialPlatform) {
      return [initialPlatform];
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return safePlatforms;

    return safePlatforms.filter((platform) => {
      const name = platform?.name?.toLowerCase() || "";
      const manufacturer = platform?.manufacturer?.toLowerCase() || "";
      const brand = platform?.brand?.toLowerCase() || "";
      const slug = platform?.slug?.toLowerCase() || "";

      return (
        name.includes(normalizedSearch) ||
        manufacturer.includes(normalizedSearch) ||
        brand.includes(normalizedSearch) ||
        slug.includes(normalizedSearch)
      );
    });
  }, [safePlatforms, search, isEditMode, initialPlatform]);

  const selectedPlatform = useMemo(() => {
    if (isEditMode && initialPlatform) return initialPlatform;

    return (
      safePlatforms.find(
        (platform) => String(platform.id) === String(selectedPlatformId)
      ) || null
    );
  }, [safePlatforms, selectedPlatformId, isEditMode, initialPlatform]);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlatformId) {
      setErrorMessage("Tu dois sélectionner une plateforme.");
      return;
    }

    setErrorMessage("");

    const payload = {
      platform_id: Number(selectedPlatformId),
    };

    if (onSubmit) {
      await onSubmit(payload);
      return;
    }

    console.log("AddUserPlatformModal payload:", payload);
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
                  Plateformes joueur
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {isEditMode
                    ? "Modifier une plateforme"
                    : "Ajouter une plateforme"}
                </h2>
                <p className="mt-2 text-sm text-white/80">
                  {isEditMode
                    ? "Vérifie la plateforme sélectionnée sur ton profil."
                    : "Sélectionne la plateforme que tu utilises pour jouer."}
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
                  {isEditMode
                    ? "Plateforme sélectionnée"
                    : "Rechercher une plateforme"}
                </label>

                {isEditMode ? (
                  <div className="rounded-[24px] border border-white/10 bg-[var(--bg-secondary)] p-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                        {selectedPlatform?.logo ? (
                          <img
                            src={selectedPlatform.logo}
                            alt={selectedPlatform.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Monitor
                            size={18}
                            className="text-[var(--text-secondary)]"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                          {selectedPlatform?.name || "Plateforme inconnue"}
                        </p>
                        <p className="truncate text-xs text-[var(--text-secondary)]">
                          {selectedPlatform?.manufacturer ||
                            selectedPlatform?.brand ||
                            selectedPlatform?.slug ||
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
                        placeholder="Ex: PC, PlayStation 5, Xbox Series, Switch..."
                        className="w-full rounded-2xl border border-white/10 bg-[var(--bg-secondary)] px-4 py-3 pl-11 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-cyan-400"
                      />
                    </div>

                    <div className="mt-4 rounded-[24px] border border-white/10 bg-[var(--bg-secondary)] p-3">
                      <div className="mb-3 flex items-center justify-between gap-3 px-1">
                        <p className="text-sm font-medium text-[var(--text-main)]">
                          Plateformes disponibles
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {filteredPlatforms.length} résultat
                          {filteredPlatforms.length > 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
                        {filteredPlatforms.length > 0 ? (
                          filteredPlatforms.map((platform) => {
                            const isSelected =
                              String(selectedPlatformId) ===
                              String(platform.id);

                            return (
                              <button
                                key={platform.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPlatformId(String(platform.id));
                                  setErrorMessage("");
                                }}
                                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                                  isSelected
                                    ? "border-cyan-400 bg-cyan-400/10"
                                    : "border-white/10 bg-white/5 hover:bg-white/10"
                                }`}
                              >
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                                  {platform.logo ? (
                                    <img
                                      src={platform.logo}
                                      alt={platform.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Monitor
                                      size={18}
                                      className="text-[var(--text-secondary)]"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                                    {platform.name}
                                  </p>
                                  <p className="truncate text-xs text-[var(--text-secondary)]">
                                    {platform.manufacturer ||
                                      platform.brand ||
                                      platform.slug ||
                                      "Informations non renseignées"}
                                  </p>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--text-secondary)]">
                            Aucune plateforme ne correspond à la recherche.
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
                    Aperçu
                  </h3>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Plateforme sélectionnée
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                        {selectedPlatform?.name || "Aucune plateforme sélectionnée"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Fabricant / marque
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                        {selectedPlatform?.manufacturer ||
                          selectedPlatform?.brand ||
                          "Non renseigné"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Identifiant
                      </p>
                      <p className="mt-2 text-sm font-medium text-[var(--text-main)]">
                        {selectedPlatform?.slug || "Non renseigné"}
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
                    : "Ajouter la plateforme"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}