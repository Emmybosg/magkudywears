import { useEffect, useState } from "react";
import { Plus, ArrowUpRight, X } from "lucide-react";
import { useCart } from "@/lib/cart";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  in_stock: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleAdd = () => {
    add({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
    <article className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)] hover:border-transparent">
      <button
        type="button"
        onClick={() => product.image_url && setOpen(true)}
        aria-label={`View ${product.name}`}
        className="relative aspect-[4/5] overflow-hidden bg-muted text-left cursor-zoom-in"
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {!product.in_stock && (
          <span className="absolute top-4 left-4 rounded-full bg-foreground/90 px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-background backdrop-blur-md">
            Sold out
          </span>
        )}
        <span
          role="button"
          tabIndex={0}
          aria-label="Add to cart"
          aria-disabled={!product.in_stock}
          onClick={(e) => { e.stopPropagation(); if (product.in_stock) handleAdd(); }}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && product.in_stock) {
              e.stopPropagation();
              e.preventDefault();
              handleAdd();
            }
          }}
          className={`absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-glow)] opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-110 ${!product.in_stock ? "opacity-30 pointer-events-none" : ""}`}
          style={{ background: "var(--gradient-ember)" }}
        >
          <Plus className="h-5 w-5" />
        </span>
        {added && (
          <div className="absolute bottom-4 right-4 mb-14 rounded-lg bg-background px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-foreground shadow-md border border-border animate-in fade-in zoom-in duration-200">
            Added to cart
          </div>
        )}
      </button>
      <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
        <h3 className="font-display text-2xl leading-tight">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-baseline justify-between border-t border-border/70 pt-4">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Price</span>
          <span className="font-display text-2xl">
            <span className="text-muted-foreground text-base mr-0.5">₦</span>
            {Number(product.price).toLocaleString()}
          </span>
        </div>
      </div>
      <ArrowUpRight className="absolute top-5 right-5 h-5 w-5 text-background/0 transition-colors group-hover:text-background" />
    </article>
    {open && product.image_url && (
      <div
        onClick={() => setOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/90 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300"
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-background/10 text-background hover:bg-background/20 transition"
        >
          <X className="h-5 w-5" />
        </button>
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-full w-full max-w-5xl flex-col items-center gap-4"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl animate-in zoom-in-95 duration-300"
          />
          <div className="flex w-full flex-wrap items-center justify-between gap-4 px-2 text-background">
            <div>
              <h3 className="font-display text-2xl md:text-3xl">{product.name}</h3>
              <p className="font-display text-lg opacity-90">
                <span className="opacity-70 mr-0.5">₦</span>{Number(product.price).toLocaleString()}
              </p>
            </div>
            {product.in_stock && (
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-105 transition"
                style={{ background: "var(--gradient-ember)" }}
              >
                <Plus className="h-4 w-4" /> {added ? "Added" : "Add to cart"}
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}