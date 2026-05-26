import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

const KEY = "salesio_cart_v1";
const EVT = "salesio_cart_change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    items,
    count: items.reduce((s, i) => s + i.quantity, 0),
    total: items.reduce((s, i) => s + i.quantity * i.price, 0),
    add: (p: Omit<CartItem, "quantity">) => {
      const cur = read();
      const i = cur.findIndex((x) => x.id === p.id);
      if (i >= 0) cur[i].quantity += 1;
      else cur.push({ ...p, quantity: 1 });
      write(cur);
    },
    remove: (id: string) => write(read().filter((x) => x.id !== id)),
    setQty: (id: string, q: number) => {
      if (q <= 0) return write(read().filter((x) => x.id !== id));
      write(read().map((x) => (x.id === id ? { ...x, quantity: q } : x)));
    },
    clear: () => write([]),
  };
}

export const WHATSAPP_NUMBER = "2349134211076"; // Edit to your number (no + sign)

export function buildWhatsAppOrder(items: CartItem[], total: number) {
  const lines = items.map(
    (i) => `• ${i.name} × ${i.quantity} — ₦${(i.price * i.quantity).toLocaleString()}`,
  );
  const msg = `Hello sales.io! I'd like to place an order:%0A%0A${lines.join("%0A")}%0A%0A*Total: ₦${total.toLocaleString()}*`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}