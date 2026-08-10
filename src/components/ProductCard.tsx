import { useEffect, useMemo, useState } from "react";
import { Plus, ArrowUpRight, X, ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useCart } from "@/lib/cart";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images?: string[] | null;
  in_stock: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState("50% 50%");

  const gallery = useMemo(
    () => Array.from(new Set([product.image_url, ...(product.images ?? [])].filter(Boolean) as string[])),
    [product.image_url, product.images]
  );
  const cover = gallery[0];
  const current = gallery[index] ?? cover;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, gallery.length]);

  useEffect(() => {
    setZoom(1);
    setOrigin("50% 50%");
  }, [index, open]);

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
        onClick={() => { if (cover) { setIndex(0); setOpen(true); } }}
        aria-label={`View ${product.name}`}
        className="relative aspect-[4/5] overflow-hidden bg-muted text-left cursor-zoom-in"
      >
        {cover ? (
          <img
            src={cover}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {gallery.length > 1 && (
          <span className="absolute top-4 right-4 rounded-full bg-foreground/70 px-2.5 py-1 text-[10px] font-semibold text-background backdrop-blur-md">
            {gallery.length} photos
          </span>
        )}
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
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-foreground/90 backdrop-blur-md p-4 pt-20 md:p-8 md:pt-20 animate-in fade-in duration-300"
      >
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(false); }}
          aria-label="Back to products"
          className="fixed top-4 left-4 z-[110] inline-flex items-center gap-2 rounded-full border border-background/30 bg-background/15 px-4 py-2.5 text-sm font-semibold text-background backdrop-blur-md shadow-lg hover:bg-background/25 hover:scale-105 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(false); }}
          aria-label="Close"
          className="fixed top-4 right-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-background/15 text-background border border-background/30 backdrop-blur-md hover:bg-background/25 transition"
        >
          <X className="h-5 w-5" />
        </button>
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-5xl flex-col items-center gap-4"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl animate-in zoom-in-95 duration-300"
          />
          <div className="flex w-full flex-col gap-4 px-2 text-background">
            <div className="flex w-full flex-wrap items-center justify-between gap-4">
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
      </div>
    )}
    </>
  );
}