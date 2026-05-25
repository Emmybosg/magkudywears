import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldCheck, Truck, RotateCcw, Headset, MessageCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ProductCard, type Product } from "@/components/ProductCard";
import { WHATSAPP_NUMBER } from "@/lib/cart";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Products products={products} loading={isLoading} />
      <WhyUs />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Premium products • Nigeria
          </span>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Beautiful things,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              delivered fast.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Quality, hand-picked products shipped across Nigeria. Order instantly via WhatsApp — no checkout friction.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-90 transition"
            >
              Shop now <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold hover:bg-muted transition"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2.5rem] opacity-50 blur-3xl" style={{ background: "var(--gradient-hero)" }} />
          <img
            src={hero}
            alt="Premium products"
            width={1600}
            height={1024}
            className="rounded-[2rem] shadow-[var(--shadow-elegant)] object-cover aspect-[4/3]"
          />
        </div>
      </div>
    </section>
  );
}

function Products({ products, loading }: { products: Product[]; loading: boolean }) {
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured products</h2>
        <p className="mt-3 text-muted-foreground">Hand-picked selection of premium items</p>
      </div>
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-muted" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No products yet. Sign in as admin to add some.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
  { icon: Truck, title: "Fast shipping", text: "Free delivery on orders over ₦50,000." },
  { icon: RotateCcw, title: "Easy returns", text: "30-day no-questions-asked returns." },
  { icon: Headset, title: "24/7 support", text: "Our team is always one message away." },
];

function WhyUs() {
  return (
    <section id="why" className="bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why shop with us</h2>
          <p className="mt-3 text-muted-foreground">A shopping experience built around you</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
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
    <section id="contact" className="mx-auto max-w-3xl px-4 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Get in touch</h2>
        <p className="mt-3 text-muted-foreground">We'll help you find the perfect product</p>
      </div>
      <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        </div>
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <div>
          <label className="text-sm font-medium">Message</label>
          <textarea
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition"
        >
          <MessageCircle className="h-4 w-4" />
          {sent ? "Sent! Continue on WhatsApp" : "Send message"}
        </button>
      </form>
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
      <label className="text-sm font-medium">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} sales.io — Premium products, delivered.</p>
        <p>Made with care in Nigeria.</p>
      </div>
    </footer>
  );
}
