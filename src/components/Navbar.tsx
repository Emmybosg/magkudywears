import { Link } from "react-router-dom";
import { ShoppingBag, Shield, Shirt } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useFittingStudio } from "@/lib/fitting";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { FittingStudio } from "./FittingStudio";

export function Navbar() {
  const { count } = useCart();
  const { count: fitCount } = useFittingStudio();
  const [open, setOpen] = useState(false);
  const [fitOpen, setFitOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground text-lg font-display italic shadow-[var(--shadow-glow)] transition-transform group-hover:rotate-12"
              style={{ background: "var(--gradient-ember)" }}
            >
              M
            </div>
            <div className="leading-[0.85]">
              <span className="font-display text-xl tracking-tight">Magkudy</span>
              <span className="block text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-sans mt-0.5">Luxury Wears</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.18em] text-muted-foreground">
            <a href="#products" className="story-link hover:text-foreground transition-colors">Shop</a>
            <a href="#why" className="story-link hover:text-foreground transition-colors">Why</a>
            <a href="#contact" className="story-link hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs uppercase tracking-widest font-medium hover:bg-muted hover:-translate-y-0.5 hover:shadow-sm transition-all duration-300"
            >
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <button
              onClick={() => setFitOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-card)] hover:bg-muted hover:scale-110 active:scale-95 transition-all duration-300"
              aria-label="Open fitting studio"
              title="Fitting studio"
            >
              <Shirt className="h-5 w-5" />
              {fitCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background animate-in zoom-in duration-300">
                  {fitCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-110 active:scale-95 transition-all duration-300 group"
              style={{ background: "var(--gradient-ember)" }}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background animate-in zoom-in duration-300">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
      <FittingStudio open={fitOpen} onClose={() => setFitOpen(false)} />
    </>
  );
}