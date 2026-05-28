import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate("/admin");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const forgot = async () => {
    setErr(null);
    setInfo(null);
    if (!email) {
      setErr("Enter your email above first, then click Forgot password.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setInfo("Check your email for a password reset link.");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--gradient-soft)" }}>
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight">sales.io</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === "login" ? "Welcome back" : "Create your admin account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Sign in to manage your store." : "First account becomes admin automatically."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          {info && <p className="text-sm text-muted-foreground">{info}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
        {mode === "login" && (
          <button
            onClick={forgot}
            disabled={loading}
            className="mt-2 w-full text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}