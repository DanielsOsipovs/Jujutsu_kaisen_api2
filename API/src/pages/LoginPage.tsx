import { useState, type FormEvent } from "react";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email.trim())  { setError("Please enter your email address."); return; }
    if (!password)      { setError("Please enter your password."); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("jjk_auth", "1");
      setLoading(false);
      onLogin();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-900/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-purple-900/10 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.5)]">
            <span className="text-white text-4xl font-black">呪</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-[hsl(var(--foreground))] tracking-wide uppercase">Jujutsu Kaisen</h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">Character Database</p>
          </div>
        </div>

        <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 uppercase tracking-widest">Email</label>
              <input id="email" type="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="sorcerer@jjk.jp"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[10px] font-semibold text-[hsl(var(--muted-foreground))] mb-1.5 uppercase tracking-widest">Password</label>
              <input id="password" type="password" autoComplete="current-password" value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-4 py-2.5 text-sm text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>
            {error && (
              <div className="rounded-xl bg-red-950/50 border border-red-800 px-4 py-3 text-sm text-red-400">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm shadow-[0_0_16px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Signing in…</>
                : "Enter the Jujutsu World"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]">Any email and password will work.</p>
        </div>
      </div>

      <footer className="relative z-10 mt-10 text-center text-xs text-[hsl(var(--muted-foreground))]/50">
        Data from <a href="https://jikan.moe" target="_blank" rel="noreferrer" className="underline hover:text-[hsl(var(--muted-foreground))] transition-colors">Jikan API</a> · MyAnimeList
      </footer>
    </div>
  );
}