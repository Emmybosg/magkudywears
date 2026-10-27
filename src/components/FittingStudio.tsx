import { useEffect, useRef, useState } from "react";
import { X, Trash2, MessageCircle, Shirt, ShoppingBag, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useFittingRoom, SIZES, buildFittingWhatsApp } from "@/lib/fitting";
import { useCart } from "@/lib/cart";
import mannequinSlim from "@/assets/mannequin-slim.jpg";
import mannequinCurvy from "@/assets/mannequin-curvy.jpg";
import mannequinPetite from "@/assets/mannequin-petite.jpg";

const MANNEQUINS = [mannequinSlim, mannequinCurvy, mannequinPetite];

function clampOffset(o: { x: number; y: number }, z: number, r: DOMRect) {
  const maxX = Math.max(0, (r.width * z - r.width) / 2);
  const maxY = Math.max(0, (r.height * z - r.height) / 2);
  return { x: Math.min(maxX, Math.max(-maxX, o.x)), y: Math.min(maxY, Math.max(-maxY, o.y)) };
}

export function FittingStudio({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, total, remove, setSize, clear } = useFittingRoom();
  const { add } = useCart();
  const featured = items[items.length - 1];

  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const mannequin = items.length > 0 ? MANNEQUINS[(items.length - 1) % MANNEQUINS.length] : MANNEQUINS[0];

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [featured?.id, open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Wheel zoom anchored at the cursor (non-passive so the page doesn't scroll)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      setZoom((z) => {
        const next = Math.min(3, Math.max(1, z * Math.exp(-dy * 0.0015)));
        const r = el.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        const k = next / z;
        setOffset((o) => clampOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k }, next, r));
        return next;
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const zoomBy = (factor: number) => {
    const el = stageRef.current;
    if (!el) return;
    setZoom((z) => {
      const next = Math.min(3, Math.max(1, z * factor));
      const r = el.getBoundingClientRect();
      const px = r.width / 2;
      const py = r.height / 2;
      const k = next / z;
      setOffset((o) => clampOffset({ x: px - (px - o.x) * k, y: py - (py - o.y) * k }, next, r));
      return next;
    });
  };

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
        className={`absolute left-0 top-0 h-full w-full max-w-md bg-card shadow-[var(--shadow-elegant)] transition-transform duration-500 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground"
              style={{ background: "var(--gradient-ember)" }}
            >
              <Shirt className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <h2 className="font-display text-xl tracking-tight">Fitting Studio</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Try your picks together
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted" aria-label="Close fitting studio">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <img src={mannequinSlim} alt="" className="h-52 w-auto rounded-2xl opacity-90" loading="lazy" width={640} height={1024} />
              <p className="font-display text-xl italic text-muted-foreground">
                Your fitting studio is empty.
              </p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Tap the shirt icon on any product to hang it on a mannequin here, then mix pieces and pick your sizes.
              </p>
            </div>
          ) : (
            <>
              {/* Zoomable mannequin stage */}
              <div
                ref={stageRef}
                className="relative m-4 mb-0 h-64 shrink-0 touch-none overflow-hidden rounded-[1.5rem] border border-border bg-muted select-none"
                style={{ cursor: zoom > 1 ? "grab" : "default" }}
              >
                <div
                  className="absolute inset-0"
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: "0 0", transition: dragRef.current ? "none" : "transform 0.25s ease" }}
                >
                  <img src={mannequin} alt="Mannequin" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
                  <div className="absolute inset-0" style={{ background: "var(--gradient-soft)", opacity: 0.25 }} />
                  {featured?.image_url && (
                    <img
                      src={featured.image_url}
                      alt={featured.name}
                      className="absolute left-1/2 top-1/2 h-48 w-auto -translate-x-1/2 -translate-y-1/2 rounded-2xl object-cover shadow-[var(--shadow-elegant)]"
                      draggable={false}
                    />
                  )}
                </div>
                {/* Zoom controls */}
                <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
                  <button
                    onClick={() => zoomBy(1.3)}
                    aria-label="Zoom in"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground backdrop-blur-md hover:bg-background transition"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => zoomBy(1 / 1.3)}
                    aria-label="Zoom out"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground backdrop-blur-md hover:bg-background transition"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  {zoom > 1 && (
                    <button
                      onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
                      aria-label="Reset zoom"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/85 text-foreground backdrop-blur-md hover:bg-background transition"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <span className="absolute bottom-3 left-3 z-10 rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
                  {featured?.name} · Size {featured?.size}
                </span>
                {zoom > 1 && (
                  <span className="absolute bottom-3 right-3 z-10 rounded-full bg-background/80 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
                    Drag to pan
                  </span>
                )}
              </div>

              {/* Picks */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground px-1">
                  Your picks · {items.length}
                </p>
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 rounded-2xl border border-border p-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {i.image_url && <img src={i.image_url} alt={i.name} className="h-full w-full object-cover" loading="lazy" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">₦{i.price.toLocaleString()}</p>
                    </div>
                    <select
                      value={i.size}
                      onChange={(e) => setSize(i.id, e.target.value)}
                      aria-label={`Size for ${i.name}`}
                      className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
                    >
                      {SIZES.map((s) => (
                        <option key={s} value={s}>Size {s}</option>
                      ))}
                    </select>
                    <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${i.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <p className="px-1 pt-1 text-xs text-muted-foreground">
                  Scroll or use the buttons to zoom the mannequin · mix tops, bottoms, shoes and accessories, then send us the look.
                </p>
              </div>

              {/* Footer */}
              <div className="shrink-0 space-y-3 border-t border-border bg-secondary/40 p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Look total</span>
                  <span className="font-semibold">₦{total.toLocaleString()}</span>
                </div>
                {total < 100000 && (
                  <p className="text-xs text-muted-foreground">
                    Add ₦{(100000 - total).toLocaleString()} more for free delivery.
                  </p>
                )}
                <a
                  href={buildFittingWhatsApp(items, total)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-card)] hover:opacity-90 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send my look on WhatsApp
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => items.forEach((i) => add({ id: i.id, name: i.name, price: i.price, image_url: i.image_url }))}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-muted transition"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" /> Add all to cart
                  </button>
                  <button onClick={clear} className="rounded-xl px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground">
                    Clear
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
