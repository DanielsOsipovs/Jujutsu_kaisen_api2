import { type JJKCharacter } from "./types";
import { formatName } from "./api";

interface CharacterCardProps {
  character: JJKCharacter;
  onClick: (character: JJKCharacter) => void;
}

const sourceColors: Record<string, string> = {
  "Season 1":    "bg-sky-900/80 text-sky-300",
  "Season 2":    "bg-amber-900/80 text-amber-300",
  "JJK 0 Movie": "bg-emerald-900/80 text-emerald-300",
};

export default function CharacterCard({ character, onClick }: CharacterCardProps) {
  const jpVoice = character.voice_actors.find((va) => va.language === "Japanese");
  const isMain  = character.role === "Main";

  return (
    <button
      onClick={() => onClick(character)}
      className="group relative bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden text-left w-full transition-all duration-300 hover:shadow-[0_0_24px_rgba(220,38,38,0.25)] hover:-translate-y-1 hover:border-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[hsl(var(--background))]"
      aria-label={`View details for ${formatName(character.name)}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={character.images.webp?.image_url || character.images.jpg.image_url}
          alt={formatName(character.name)}
          className="w-full aspect-[3/4] object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute top-2.5 right-2.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isMain ? "bg-red-600/90 text-white" : "bg-purple-700/80 text-purple-100"
          }`}>
            {character.role}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-white text-sm leading-tight group-hover:text-red-300 transition-colors line-clamp-2">
            {formatName(character.name)}
          </h3>
          {jpVoice && (
            <p className="text-white/45 text-[10px] mt-0.5 truncate">
              CV: {formatName(jpVoice.person.name)}
            </p>
          )}
        </div>
      </div>

      <div className="px-3 py-2 flex flex-wrap gap-1">
        {character.sources.map((src) => (
          <span key={src} className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${sourceColors[src] ?? "bg-white/10 text-white/60"}`}>
            {src}
          </span>
        ))}
      </div>
    </button>
  );
}