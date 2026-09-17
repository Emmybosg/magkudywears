import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldCheck, Truck, RotateCcw, Headset, MessageCircle, Star, Sparkles, Scissors, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProductCard, type Product } from "@/components/ProductCard";
import { WHATSAPP_NUMBER } from "@/lib/cart";

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
      <div className="cv-auto"><Products products={products} loading={isLoading} /></div>
      <div className="cv-auto"><WhyUs /></div>
      <div className="cv-auto"><Contact /></div>
      <div className="cv-auto"><Footer /></div>
      <style>{`
        @keyframes ember-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .ember-text {
          background-size: 200% auto;
          animation: ember-flow 6s ease-in-out infinite;
        }
        @keyframes float-soft {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(8deg); }
        }
        .float-soft { animation: float-soft 8s ease-in-out infinite; }

        .shine-btn { position: relative; overflow: hidden; }
        .shine-btn::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%);
          transform: translateX(-120%); transition: transform 0.9s ease;
        }
        .shine-btn:hover::after { transform: translateX(120%); }

        .tilt-card { transition: transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s ease; }
        .tilt-card:hover { transform: translateY(-6px); }

        .underline-link { position: relative; }
        .underline-link::after {
          content: ""; position: absolute; left: 0; bottom: -2px; height: 1px; width: 100%;
          background: currentColor; transform: scaleX(0); transform-origin: right;
          transition: transform 0.5s cubic-bezier(0.23,1,0.32,1);
        }
        .underline-link:hover::after { transform: scaleX(1); transform-origin: left; }

        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .reveal-up { animation: reveal-up 0.9s cubic-bezier(0.23,1,0.32,1) both; }
      `}</style>
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
          <div className="col-span-6 row-span-3 rounded-[2rem] border border-border/70 bg-card p-6 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-[var(--shadow-card)]">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} /> Est. Akwa Ibom · Nigeria
            </span>
            <h1 className="font-display text-[2.75rem] leading-[1.02] md:text-7xl lg:text-[5.5rem]">
              Beautiful
              <br />
              <span className="italic ember-text inline-block" style={{
                background: "var(--gradient-hero)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>things,</span>
              <br />
              delivered.
            </h1>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="group/wa inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background/60 backdrop-blur px-6 py-3 text-sm font-semibold hover:bg-background hover:-translate-y-0.5 hover:shadow-md active:scale-95 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover/wa:scale-110 group-hover/wa:rotate-[-8deg]" /> Chat on WhatsApp
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Scissors className="h-3 w-3 text-primary" /> Custom requests open
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Users className="h-3 w-3 text-primary" /> Men & Women
              </span>
            </div>
            <Sparkles className="absolute -right-6 -top-6 h-40 w-40 text-primary/10 float-soft pointer-events-none" />
          </div>

          {/* Stat cells */}
          <div className="group/stat tilt-card col-span-3 md:col-span-2 row-span-2 rounded-[2rem] p-6 flex flex-col justify-between text-primary-foreground relative overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30" style={{ background: "var(--gradient-violet)" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">Trusted by</p>
            <div>
              <p className="font-display text-5xl md:text-6xl leading-none transition-transform duration-500 group-hover/stat:scale-105 origin-left">2,400+</p>
              <p className="text-sm opacity-90 mt-1">Happy customers across Nigeria</p>
            </div>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current transition-transform duration-300 hover:scale-125" style={{ transitionDelay: `${i * 40}ms` }} />)}
            </div>
            <div className="pointer-events-none absolute -right-16 -bottom-16 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover/stat:scale-150" />
          </div>

          <div className="group/free tilt-card col-span-3 md:col-span-2 row-span-2 rounded-[2rem] border border-border/70 bg-card p-6 flex flex-col justify-between shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] hover:border-primary/30">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Free delivery</p>
            <p className="font-display text-3xl md:text-4xl leading-tight">Orders over <span className="italic" style={{ color: "var(--primary)" }}>₦100k</span> ship on us.</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-4 w-4 transition-transform duration-500 group-hover/free:translate-x-1" /> Nationwide · 2–4 days
            </div>
          </div>

          <div className="group/nc tilt-card col-span-6 md:col-span-2 row-span-2 rounded-[2rem] p-6 flex flex-col justify-between text-primary-foreground relative overflow-hidden hover:shadow-2xl hover:shadow-pink-500/30" style={{ background: "var(--gradient-ember)" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">No checkout</p>
            <p className="font-display text-3xl leading-tight italic">Order in one message.</p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-background/20 backdrop-blur px-4 py-2 text-xs font-semibold hover:bg-background/30 hover:translate-x-1 transition-all duration-300"
            >
              <MessageCircle className="h-3.5 w-3.5 transition-transform group-hover/nc:rotate-[-10deg]" /> WhatsApp
            </a>
            <div className="pointer-events-none absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover/nc:scale-150" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Curated", "·", "Hand-picked", "·", "Made in Nigeria", "·", "Custom designs", "·", "Men & Women", "·", "Shipped fast", "·"];
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
        <p className="md:max-w-xs text-muted-foreground">A small, considered selection. Every piece chosen for craft, story, and the joy it brings home. Want something unique? We also take custom requests for men and women.</p>
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
  { icon: Scissors, title: "Custom designs", text: "Have a style in mind? We bring your ideas to life — clothes and designs made just for you." },
  { icon: Users, title: "Men & Women", text: "Curated pieces and bespoke tailoring for everyone." },
  { icon: Truck, title: "Fast shipping", text: "Free delivery on orders over ₦100,000." },
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
          <p className="mt-6 text-base opacity-90 max-w-sm">Drop us a line — or skip the form and ping us on WhatsApp directly. We reply within the hour. Ask about custom designs for men and women.</p>
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
            className="shine-btn group/sub mt-2 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
            style={{ background: "var(--gradient-ember)" }}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 transition-transform duration-300 group-hover/sub:rotate-[-8deg]" />
              {sent ? "Sent! Continue on WhatsApp" : "Send message"}
            </span>
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
