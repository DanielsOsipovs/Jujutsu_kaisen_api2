import { useState } from "react";
import Characters from "@/features/characters/Characters";
import CharacterModal from "@/features/characters/CharacterModal";
import LoginPage from "@/pages/LoginPage";
import type { JJKCharacter } from "@/features/characters/types";

function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    () => localStorage.getItem("jjk_auth") === "1"
  );
  const login  = () => setIsLoggedIn(true);
  const logout = () => { localStorage.removeItem("jjk_auth"); setIsLoggedIn(false); };
  return { isLoggedIn, login, logout };
}

export default function App() {
  const { isLoggedIn, login, logout } = useAuth();
  const [selectedCharacter, setSelectedCharacter] = useState<JJKCharacter | null>(null);

  if (!isLoggedIn) return <LoginPage onLogin={login} />;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <header className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_16px_rgba(220,38,38,0.5)]">
              <span className="text-white text-base font-black">呪</span>
            </div>
            <div>
              <h1 className="text-sm font-black text-[hsl(var(--foreground))] leading-tight tracking-wide">JUJUTSU KAISEN</h1>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] leading-tight uppercase tracking-widest">Character Database</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:inline-block text-[10px] text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-3 py-1.5 rounded-full uppercase tracking-widest">
              Powered by Jikan API
            </span>
            <button onClick={logout}
              className="text-xs font-semibold text-[hsl(var(--muted-foreground))] hover:text-red-400 bg-[hsl(var(--muted))] hover:bg-red-950/50 border border-[hsl(var(--border))] hover:border-red-900 px-3 py-1.5 rounded-full transition-all">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main>
        <Characters onSelectCharacter={setSelectedCharacter} />
      </main>

      <CharacterModal character={selectedCharacter} onClose={() => setSelectedCharacter(null)} />
    </div>
  );
}