export interface CharacterImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface VoiceActor {
  person: {
    mal_id: number;
    url: string;
    images: CharacterImage;
    name: string;
  };
  language: string;
}

export interface AnimeCharacterEntry {
  character: {
    mal_id: number;
    url: string;
    images: CharacterImage;
    name: string;
  };
  role: "Main" | "Supporting";
  voice_actors: VoiceActor[];
}

export type CharacterRole   = "Main" | "Supporting";
export type CharacterSource = "Season 1" | "Season 2" | "JJK 0 Movie";

export interface JJKCharacter {
  mal_id: number;
  url: string;
  images: CharacterImage;
  name: string;
  role: CharacterRole;
  sources: CharacterSource[];
  voice_actors: VoiceActor[];
}

export interface CharacterFull {
  mal_id: number;
  url: string;
  images: CharacterImage;
  name: string;
  name_kanji: string | null;
  nicknames: string[];
  favorites: number;
  about: string | null;
}

export type RoleFilter   = CharacterRole | "";
export type SourceFilter = CharacterSource | "";

export interface CharacterFilters {
  name: string;
  role: RoleFilter;
  source: SourceFilter;
}