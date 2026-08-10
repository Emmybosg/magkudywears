import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, LogOut, Trash2, Upload, Plus, Pencil, X, Check } from "lucide-react";
import type { Product } from "@/components/ProductCard";

export default function Admin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setIsAdmin(null);
      return;
    }
    supabase.rpc("has_role", { _user_id: userId, _role: "admin" }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [userId]);

  useEffect(() => {
    if (userId === null && isAdmin === null) {
      const t = setTimeout(() => {
        supabase.auth.getSession().then(({ data }) => {
          if (!data.session) navigate("/auth");
        });
      }, 200);
      return () => clearTimeout(t);
    }
  }, [userId, isAdmin, navigate]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!isAdmin,
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!userId) {
    return <CenteredMsg>Redirecting to sign in…</CenteredMsg>;
  }
  if (isAdmin === false) {
    return (
      <CenteredMsg>
        You are signed in but not an admin.
        <button onClick={signOut} className="block mt-4 underline">Sign out</button>
      </CenteredMsg>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight">Admin</span>
          </Link>
          <button onClick={signOut} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <NewProduct onCreated={() => {
          qc.invalidateQueries({ queryKey: ["admin-products"] });
          qc.invalidateQueries({ queryKey: ["products"] });
        }} />

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">Your products</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet — add one above.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <AdminRow key={p.id} p={p} onChanged={() => {
                  qc.invalidateQueries({ queryKey: ["admin-products"] });
                  qc.invalidateQueries({ queryKey: ["products"] });
                }} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function CenteredMsg({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-center text-muted-foreground p-6">
      <div>{children}</div>
    </div>
  );
}

function NewProduct({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const urls = await uploadAll(files);
      const { error } = await supabase.from("products").insert({
        name,
        description: description || null,
        price: Number(price),
        image_url: urls[0] ?? null,
        images: urls,
      });
      if (error) throw error;
      setName(""); setDescription(""); setPrice(""); setFiles([]);
      onCreated();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h2 className="text-xl font-semibold tracking-tight mb-4">Add a new product</h2>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Input label="Name" value={name} onChange={setName} />
        <Input label="Price (₦)" type="number" value={price} onChange={setPrice} />
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Images (you can select several)</label>
          <label className="mt-1.5 flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-border bg-background px-4 py-3 text-sm hover:bg-muted">
            <Upload className="h-4 w-4" />
            <span className="text-muted-foreground">{files.length ? `${files.length} image${files.length > 1 ? "s" : ""} selected` : "Choose images"}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
          </label>
        </div>
        {err && <p className="text-sm text-destructive md:col-span-2">{err}</p>}
        <button
          type="submit" disabled={busy}
          className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> {busy ? "Saving…" : "Add product"}
        </button>
      </form>
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        required type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function AdminRow({ p, onChanged }: { p: Product; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(p.name);
  const [description, setDescription] = useState(p.description ?? "");
  const [price, setPrice] = useState(String(p.price));
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const del = async () => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    setBusy(true);
    await supabase.from("products").delete().eq("id", p.id);
    setBusy(false);
    onChanged();
  };
  const toggle = async () => {
    setBusy(true);
    await supabase.from("products").update({ in_stock: !p.in_stock }).eq("id", p.id);
    setBusy(false);
    onChanged();
  };
  const save = async () => {
    setErr(null);
    setBusy(true);
    try {
      let image_url = p.image_url;
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const { error } = await supabase.from("products").update({
        name,
        description: description || null,
        price: Number(price),
        image_url,
      }).eq("id", p.id);
      if (error) throw error;
      setEditing(false);
      setFile(null);
      onChanged();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  const cancel = () => {
    setName(p.name);
    setDescription(p.description ?? "");
    setPrice(String(p.price));
    setFile(null);
    setErr(null);
    setEditing(false);
  };
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="aspect-square bg-muted">
        {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
      </div>
      {editing ? (
        <div className="p-4 space-y-3">
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Name"
          />
          <input
            type="number" value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Price"
          />
          <textarea
            value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Description"
          />
          <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-border bg-background px-3 py-2 text-xs hover:bg-muted">
            <Upload className="h-3.5 w-3.5" />
            <span className="text-muted-foreground truncate">{file?.name ?? "Replace image (optional)"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          {err && <p className="text-xs text-destructive">{err}</p>}
          <div className="flex items-center gap-2 pt-1">
            <button onClick={save} disabled={busy} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
              <Check className="h-3.5 w-3.5" /> {busy ? "Saving…" : "Save"}
            </button>
            <button onClick={cancel} disabled={busy} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          <p className="font-semibold truncate">{p.name}</p>
          <p className="text-sm text-muted-foreground">₦{Number(p.price).toLocaleString()}</p>
          <div className="flex items-center justify-between gap-2 pt-2">
            <button onClick={toggle} disabled={busy} className="text-xs rounded-full border border-border px-3 py-1 hover:bg-muted">
              {p.in_stock ? "In stock" : "Sold out"}
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => setEditing(true)} disabled={busy} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button onClick={del} disabled={busy} className="text-destructive hover:opacity-80" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}