import { Plus } from "lucide-react";
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
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        {!product.in_stock && (
          <span className="absolute top-3 left-3 rounded-full bg-foreground/80 px-3 py-1 text-xs font-medium text-background">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-1">
          <h3 className="font-semibold tracking-tight">{product.name}</h3>
          {product.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">₦{Number(product.price).toLocaleString()}</span>
          <button
            disabled={!product.in_stock}
            onClick={() =>
              add({ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url })
            }
            className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-card)] transition hover:opacity-90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </article>
  );
}