import { useState, useEffect, useMemo } from "react";
import { fetchJJKCharacters } from "./api";
import type { JJKCharacter, CharacterFilters, RoleFilter, SourceFilter } from "./types";
import CharacterCard from "./CharacterCard";

interface CharactersProps {
  onSelectCharacter: (character: JJKCharacter) => void;
}

const INITIAL_FILTERS: CharacterFilters = { name: "", role: "", source: "" };
const PAGE_SIZE = 20;

const ROLE_OPTIONS: Array<{ value: RoleFilter; label: string }> = [
  { value: "",           label: "All roles" },
  { value: "Main",       label: "Main" },
  { value: "Supporting", label: "Supporting" },
];

const SOURCE_OPTIONS: Array<{ value: SourceFilter; label: string; color: string }> = [
  { value: "",             label: "All titles",  color: "" },
  { value: "Season 1",    label: "Season 1",    color: "text-sky-400 bg-sky-950/50 border-sky-800" },
  { value: "Season 2",    label: "Season 2",    color: "text-amber-400 bg-amber-950/50 border-amber-800" },
  { value: "JJK 0 Movie", label: "JJK 0 Movie", color: "text-emerald-400 bg-emerald-950/50 border-emerald-800" },
];

export default function Characters({ onSelectCharacter }: CharactersProps) {
  const [allCharacters, setAllCharacters] = useState<JJKCharacter[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [page, setPage]                   = useState(1);
  const [filters, setFilters]             = useState<CharacterFilters>(INITIAL_FILTERS);
  const [search, setSearch]               = useState("");

  useEffect(() => {
    fetchJJKCharacters()
      .then(setAllCharacters)
      .catch(() => setError("Failed to load characters. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = filters.name.toLowerCase().trim();
    return allCharacters.filter((c) => {
      const nameMatch   = q              ? c.name.toLowerCase().includes(q)   : true;
      const roleMatch   = filters.role   ? c.role === filters.role             : true;
      const sourceMatch = filters.source ? c.sources.includes(filters.source) : true;
      return nameMatch && roleMatch && sourceMatch;
    });
  }, [allCharacters, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const applySearch = () => { setFilters((f) => ({ ...f, name: search })); setPage(1); };
  const handleReset = () => { setSearch(""); setFilters(INITIAL_FILTERS); setPage(1); };
  const setRole     = (v: RoleFilter)   => { setFilters((f) => ({ ...f, role: v }));   setPage(1); };
  const setSource   = (v: SourceFilter) => { setFilters((f) => ({ ...f, source: v })); setPage(1); };

  const hasActiveFilters = filters.name !== "" || filters.role !== "" || filters.source !== "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Filter bar */}
      <div className="mb-8 bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-5 space-y-4">

        {/* Search */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="search-name" className="block text-[10px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 uppercase tracking-widest">
              Character name
            </label>
            <input
              id="search-name" type="search" value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
              placeholder="Search sorcerers and curses…"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-end">
            <button onClick={applySearch}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm">
              Search
            </button>
          </div>
        </div>

        {/* Role pills */}
        <div>
          <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-widest">Role</p>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setRole(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filters.role === opt.value
                    ? "bg-red-600 border-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                    : "bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-red-800 hover:text-[hsl(var(--foreground))]"
                }`}>
                {opt.label}
                {!loading && opt.value !== "" && (
                  <span className="ml-1.5 opacity-60">
                    {allCharacters.filter((c) => c.role === opt.value).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Source pills */}
        <div>
          <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] mb-2 uppercase tracking-widest">Title</p>
          <div className="flex flex-wrap gap-2">
            {SOURCE_OPTIONS.map((opt) => {
              const isActive = filters.source === opt.value;
              const count = opt.value !== ""
                ? allCharacters.filter((c) => c.sources.includes(opt.value as any)).length
                : allCharacters.length;
              return (
                <button key={opt.value} onClick={() => setSource(opt.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isActive
                      ? opt.value === ""
                        ? "bg-white/10 border-white/30 text-white"
                        : opt.color + " shadow-sm"
                      : "bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-white/20"
                  }`}>
                  {opt.label}
                  {!loading && <span className="ml-1.5 opacity-60">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary / clear */}
        <div className="pt-1 border-t border-[hsl(var(--border))] flex items-center justify-between">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {hasActiveFilters
              ? <><span className="text-[hsl(var(--foreground))] font-semibold">{filtered.length}</span> of {allCharacters.length} characters</>
              : <>{allCharacters.length} characters across all titles</>
            }
          </p>
          {hasActiveFilters && (
            <button onClick={handleReset} className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">
              Clear all ×
            </button>
          )}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-5 rounded-full border-2 border-red-800 border-t-red-500 animate-spin" />
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Channeling cursed energy…</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-[hsl(var(--muted))]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-2xl">⚡</div>
          <p className="text-[hsl(var(--foreground))] font-semibold text-lg text-center">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors">Retry</button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] flex items-center justify-center text-2xl">🔍</div>
          <p className="text-[hsl(var(--muted-foreground))] font-semibold text-lg">No characters found</p>
          <button onClick={handleReset} className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-colors">Clear filters</button>
        </div>
      )}

      {/* Grid + pagination */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginated.map((character) => (
              <CharacterCard key={character.mal_id} character={character} onClick={onSelectCharacter} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}
                className="px-5 py-2.5 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm font-semibold text-[hsl(var(--foreground))] hover:border-red-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                ← Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, start + 4);
                  start = Math.max(1, end - 4);
                  const p = start + i;
                  if (p > totalPages) return null;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                        p === page
                          ? "bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]"
                          : "bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-red-800"
                      }`}>{p}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
                className="px-5 py-2.5 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] text-sm font-semibold text-[hsl(var(--foreground))] hover:border-red-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                Next →
              </button>
            </div>
          )}
          <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-3">Page {page} of {totalPages}</p>
        </>
      )}
    </div>
  );
}