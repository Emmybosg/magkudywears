import { Link } from "react-router-dom";
import { ShoppingBag, Sparkles, Shield } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)] transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">sales.io</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#products" className="hover:text-foreground transition-colors">Shop</a>
            <a href="#why" className="hover:text-foreground transition-colors">Why us</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-[var(--shadow-card)] hover:bg-muted transition"
            >
              <Shield className="h-4 w-4 text-primary" />
              Admin
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}