import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldCheck, Truck, RotateCcw, Headset, MessageCircle, ArrowRight, Star, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProductCard, type Product } from "@/components/ProductCard";
import { WHATSAPP_NUMBER } from "@/lib/cart";
import hero from "@/assets/hero.jpg";

export default function Index() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <Hero />
      <Marquee />
      <Products products={products} loading={isLoading} />
      <WhyUs />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-mesh)" }} />
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-16 pb-12">
        {/* Bento grid */}
        <div className="grid grid-cols-6 auto-rows-[110px] md:auto-rows-[140px] gap-3 md:gap-4">
          {/* Headline cell */}
          <div className="col-span-6 md:col-span-4 row-span-3 rounded-[2rem] border border-border/70 bg-card p-6 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-[var(--shadow-card)]">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} /> Est. Akwa Ibom · Nigeria
            </span>
            <h1 className="font-display text-[2.75rem] leading-[1.02] md:text-7xl lg:text-[5.5rem]">
              Beautiful
              <br />
              <span className="italic" style={{
                background: "var(--gradient-hero)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>things,</span>
              <br />
              delivered.
            </h1>
            <div className="flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-[1.02] transition"
                style={{ background: "var(--gradient-ember)" }}
              >
                Browse the edit <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 backdrop-blur px-6 py-3 text-sm font-semibold hover:bg-background transition"
              >
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </div>
            <Sparkles className="absolute -right-6 -top-6 h-40 w-40 text-primary/5" />
          </div>

          {/* Hero image cell */}
          <div className="col-span-3 md:col-span-2 row-span-3 rounded-[2rem] overflow-hidden relative shadow-[var(--shadow-elegant)]">
            <img src={hero} alt="Featured" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-background">
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">This week</p>
              <p className="font-display italic text-2xl leading-tight mt-1">The Ember Edit</p>
            </div>
          </div>

          {/* Stat cells */}
          <div className="col-span-3 md:col-span-2 row-span-2 rounded-[2rem] p-6 flex flex-col justify-between text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-violet)" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">Trusted by</p>
            <div>
              <p className="font-display text-5xl md:text-6xl leading-none">2,400+</p>
              <p className="text-sm opacity-90 mt-1">Happy customers across Nigeria</p>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
          </div>

          <div className="col-span-3 md:col-span-2 row-span-2 rounded-[2rem] border border-border/70 bg-card p-6 flex flex-col justify-between shadow-[var(--shadow-card)]">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Free delivery</p>
            <p className="font-display text-3xl md:text-4xl leading-tight">Orders over <span className="italic" style={{ color: "var(--primary)" }}>₦100k</span> ship on us.</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4" /> Nationwide · 2–4 days
            </div>
          </div>

          <div className="col-span-6 md:col-span-2 row-span-2 rounded-[2rem] p-6 flex flex-col justify-between text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-ember)" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">No checkout</p>
            <p className="font-display text-3xl leading-tight italic">Order in one message.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-background/20 backdrop-blur px-4 py-2 text-xs font-semibold hover:bg-background/30 transition"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Curated", "·", "Hand-picked", "·", "Made in Nigeria", "·", "Shipped fast", "·"];
  return (
    <div className="border-y border-border bg-foreground text-background overflow-hidden">
      <div className="flex gap-10 py-5 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
        {[...Array(4)].flatMap((_, i) =>
          words.map((w, j) => (
            <span key={`${i}-${j}`} className="font-display italic text-2xl md:text-3xl opacity-90">{w}</span>
          ))
        )}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

function Products({ products, loading }: { products: Product[]; loading: boolean }) {
  return (
    <section id="products" className="mx-auto max-w-7xl px-5 md:px-8 py-24">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">— The collection</p>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">
            Featured
            <br />
            <span className="italic" style={{
              background: "var(--gradient-hero)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>this season.</span>
          </h2>
        </div>
        <p className="md:max-w-xs text-muted-foreground">A small, considered selection. Every piece chosen for craft, story, and the joy it brings home.</p>
      </div>
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-[2rem] bg-muted" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-12 font-display italic text-xl">
          No products yet. Sign in as admin to add some.
        </p>
      ) : (
        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}

const features = [
  { icon: ShieldCheck, title: "Secure orders", text: "Your details are protected end-to-end." },
  { icon: Truck, title: "Fast shipping", text: "Free delivery on orders over ₦100,000." },
  { icon: RotateCcw, title: "Easy returns", text: "30-day no-questions-asked returns." },
  { icon: Headset, title: "24/7 support", text: "Our team is always one message away." },
];

function WhyUs() {
  return (
    <section id="why" className="relative border-y border-border" style={{ background: "var(--gradient-soft)" }}>
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-24">
        <div className="mb-14 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">— Why us</p>
          <h2 className="font-display text-5xl md:text-6xl leading-[1]">
            Built around <span className="italic" style={{ color: "var(--accent)" }}>you</span>, not the cart.
          </h2>
        </div>
        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-[1.75rem] border border-border bg-card p-7 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] transition-all duration-500 overflow-hidden"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)]"
                style={{ background: i % 2 === 0 ? "var(--gradient-ember)" : "var(--gradient-violet)" }}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
              <span className="absolute top-5 right-6 font-display italic text-3xl text-muted-foreground/30">0{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi sales.io!%0A%0AName: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0A%0A${form.message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 md:px-8 py-24">
      <div className="grid lg:grid-cols-5 gap-8 rounded-[2.5rem] overflow-hidden border border-border bg-card shadow-[var(--shadow-elegant)]">
        <div className="lg:col-span-2 p-8 md:p-12 text-primary-foreground relative" style={{ background: "var(--gradient-hero)" }}>
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-80 mb-3">— Say hi</p>
          <h2 className="font-display text-5xl md:text-6xl leading-[1]">
            Let's find
            <br />
            <span className="italic">your thing.</span>
          </h2>
          <p className="mt-6 text-base opacity-90 max-w-sm">Drop us a line — or skip the form and ping us on WhatsApp directly. We reply within the hour.</p>
          <div className="mt-10 flex items-center gap-3 text-sm">
            <MessageCircle className="h-5 w-5" />
            <span className="opacity-90">+234 913 421 1076</span>
          </div>
        </div>
        <form onSubmit={submit} className="lg:col-span-3 grid gap-5 p-8 md:p-12">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Message</label>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-[1.01] transition"
            style={{ background: "var(--gradient-ember)" }}
          >
            <MessageCircle className="h-4 w-4" />
            {sent ? "Sent! Continue on WhatsApp" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16">
        <h3 className="font-display text-5xl md:text-7xl leading-[0.95]">
          Magkudy
        </h3>
        <p className="text-xs uppercase tracking-[0.35em] opacity-70 mt-2 font-sans">Luxury Wears</p>
        <div className="mt-12 flex flex-col gap-3 border-t border-background/20 pt-8 text-xs uppercase tracking-[0.2em] opacity-80 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} — Premium fashion, delivered.</p>
          <p>Made with care in Nigeria 🇳🇬</p>
        </div>
      </div>
    </footer>
  );
}
