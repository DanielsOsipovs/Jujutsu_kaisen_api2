import axios from "axios";
import type {
  AnimeCharacterEntry, CharacterFull,
  CharacterSource, JJKCharacter,
} from "./types";

const client = axios.create({
  baseURL: "https://api.jikan.moe/v4",
  timeout: 20000,
});

const JJK_SOURCES: Array<{ id: number; label: CharacterSource }> = [
  { id: 40748, label: "Season 1" },
  { id: 51009, label: "Season 2" },
  { id: 44081, label: "JJK 0 Movie" },
];

const NO_IMAGE_URL =
  "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";

async function fetchAnimeCharacters(animeId: number): Promise<AnimeCharacterEntry[]> {
  const { data } = await client.get<{ data: AnimeCharacterEntry[] }>(
    `/anime/${animeId}/characters`
  );
  return data.data;
}

export async function fetchJJKCharacters(): Promise<JJKCharacter[]> {
  const results = await Promise.all(
    JJK_SOURCES.map((s) => fetchAnimeCharacters(s.id))
  );

  const map = new Map<number, { entry: AnimeCharacterEntry; sources: Set<CharacterSource> }>();

  for (let i = 0; i < JJK_SOURCES.length; i++) {
    const label = JJK_SOURCES[i].label;
    for (const entry of results[i]) {
      const id = entry.character.mal_id;
      if (!map.has(id)) map.set(id, { entry, sources: new Set() });
      map.get(id)!.sources.add(label);
    }
  }

  return Array.from(map.values())
    .filter(({ entry }) => entry.character.images.jpg.image_url !== NO_IMAGE_URL)
    .map(({ entry, sources }) => ({
      mal_id: entry.character.mal_id,
      url: entry.character.url,
      images: entry.character.images,
      name: entry.character.name,
      role: entry.role,
      sources: Array.from(sources) as CharacterSource[],
      voice_actors: entry.voice_actors,
    }))
    .sort((a, b) => {
      if (a.role === b.role) return 0;
      return a.role === "Main" ? -1 : 1;
    });
}

export async function fetchCharacterDetail(id: number): Promise<CharacterFull> {
  const { data } = await client.get<{ data: CharacterFull }>(`/characters/${id}/full`);
  return data.data;
}

export function formatName(name: string): string {
  const parts = name.split(", ");
  if (parts.length === 2) return `${parts[1]} ${parts[0]}`;
  return name;
}