import { Plus, ArrowUpRight } from "lucide-react";
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
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)] hover:border-transparent">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
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
        <button
          disabled={!product.in_stock}
          onClick={() =>
            add({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url })
          }
          aria-label="Add to cart"
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-glow)] opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 disabled:opacity-30 hover:scale-110"
          style={{ background: "var(--gradient-ember)" }}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
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
  );
}