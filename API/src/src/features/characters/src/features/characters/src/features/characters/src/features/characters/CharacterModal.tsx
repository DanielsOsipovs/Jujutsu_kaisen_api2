import { useEffect, useState } from "react";
import { fetchCharacterDetail, formatName } from "./api";
import type { CharacterFull, JJKCharacter } from "./types";

interface CharacterModalProps {
  character: JJKCharacter | null;
  onClose: () => void;
}

export default function CharacterModal({ character, onClose }: CharacterModalProps) {
  const [detail, setDetail]   = useState<CharacterFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!character) { setDetail(null); return; }
    setLoading(true);
    setError(null);
    fetchCharacterDetail(character.mal_id)
      .then(setDetail)
      .catch(() => setError("Failed to load character details."))
      .finally(() => setLoading(false));
  }, [character]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!character) return null;

  const displayName = formatName(character.name);
  const jpVoice = character.voice_actors.find((va) => va.language === "Japanese");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.2)] max-w-lg w-full max-h-[90vh] overflow-y-auto z-10">
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center transition-colors text-white/70 hover:text-white font-bold text-base"
          aria-label="Close modal">×
        </button>

        {/* Image header */}
        <div className="relative h-72 overflow-hidden rounded-t-3xl">
          <img
            src={detail?.images.jpg.large_image_url || character.images.jpg.image_url}
            alt={displayName}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h2 className="text-3xl font-black text-white leading-tight">{displayName}</h2>
            {detail?.name_kanji && (
              <p className="text-white/50 text-sm mt-0.5 font-medium">{detail.name_kanji}</p>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
              character.role === "Main"
                ? "text-red-400 bg-red-950/60 border-red-800"
                : "text-purple-300 bg-purple-950/60 border-purple-800"
            }`}>{character.role}</span>

            {detail && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border text-yellow-400 bg-yellow-950/40 border-yellow-800">
                ♥ {detail.favorites.toLocaleString()} favorites
              </span>
            )}
            {jpVoice && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border text-sky-400 bg-sky-950/40 border-sky-800">
                CV: {formatName(jpVoice.person.name)}
              </span>
            )}
          </div>

          {/* Nicknames */}
          {detail && detail.nicknames.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-2">
                Also known as
              </p>
              <div className="flex flex-wrap gap-1.5">
                {detail.nicknames.map((nick) => (
                  <span key={nick} className="px-2 py-0.5 rounded-md bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-xs">
                    {nick}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 rounded-full border-2 border-red-800 border-t-red-400 animate-spin flex-shrink-0" />
              <p className="text-[hsl(var(--muted-foreground))] text-sm">Loading details...</p>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* About */}
          {!loading && !error && detail?.about && (
            <div>
              <p className="text-[10px] font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-2">About</p>
              <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed opacity-80 line-clamp-6">
                {detail.about.replace(/\n+/g, " ").trim()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}