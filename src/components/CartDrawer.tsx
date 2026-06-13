import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { useCart, buildWhatsAppOrder } from "@/lib/cart";

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, setQty, remove, clear } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-[var(--shadow-elegant)] transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <h2 className="font-semibold tracking-tight">Your cart</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground mt-12">
                Your cart is empty. Browse the shop and add something lovely.
              </p>
            ) : (
              items.map((i) => (
                <div key={i.id} className="flex gap-3 rounded-2xl border border-border p-3">
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted shrink-0">
                    {i.image_url && <img src={i.image_url} alt={i.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{i.name}</p>
                    <p className="text-sm text-muted-foreground">₦{i.price.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => setQty(i.id, i.quantity - 1)} className="rounded-md border border-border p-1 hover:bg-muted">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => setQty(i.id, i.quantity + 1)} className="rounded-md border border-border p-1 hover:bg-muted">
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => remove(i.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border bg-secondary/40 p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₦{total.toLocaleString()}</span>
              </div>
              {total < 100000 && (
                <p className="text-xs text-muted-foreground">
                  Add ₦{(100000 - total).toLocaleString()} more for free delivery.
                </p>
              )}
              <a
                href={buildWhatsAppOrder(items, total)}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition"
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
              </a>
              <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-foreground">
                Clear cart
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}