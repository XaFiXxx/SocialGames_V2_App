import { Search, X } from "lucide-react";

export default function NavbarSearch({
  searchRef,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  isSearching,
  searchResults,
  onOpenUser,
  getImageUrl,
}) {
  const trimmedQuery = searchQuery.trim();
  const shouldShowDropdown = isSearchOpen && trimmedQuery.length >= 2;

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
        size={18}
      />

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsSearchOpen(true);
        }}
        onFocus={() => {
          if (trimmedQuery.length >= 2) {
            setIsSearchOpen(true);
          }
        }}
        placeholder="Rechercher un joueur..."
        className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] py-3 pl-11 pr-11 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)]"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setIsSearchOpen(false);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] transition hover:text-[var(--text-main)]"
        >
          <X size={16} />
        </button>
      )}

      {shouldShowDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl">
          {isSearching ? (
            <div className="px-4 py-4 text-sm text-[var(--text-secondary)]">
              Recherche en cours...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-96 overflow-y-auto p-2">
              {searchResults.map((result) => {
                const resultName =
                  result?.name && result?.surname
                    ? `${result.name} ${result.surname}`
                    : result?.username || "Utilisateur";

                const resultInitials =
                  result?.name && result?.surname
                    ? `${result.name[0]}${result.surname[0]}`.toUpperCase()
                    : result?.username?.slice(0, 2).toUpperCase() || "U";

                const avatarSrc = getImageUrl(result?.avatar_url);

                return (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => onOpenUser(result.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-[var(--bg-main)]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--bg-main)] text-sm font-bold text-[var(--text-main)]">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={resultName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        resultInitials
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--text-main)]">
                        {resultName}
                      </p>
                      <p className="truncate text-xs text-[var(--text-secondary)]">
                        @{result?.username}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-4 text-sm text-[var(--text-secondary)]">
              Aucun utilisateur trouvé.
            </div>
          )}
        </div>
      )}
    </div>
  );
}