import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "./cart";

export type FittingItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  size: string;
};

const KEY = "magkudy_fitting_v1";
const EVT = "magkudy_fitting_change";

export const SIZES = ["S", "M", "L", "XL", "XXL", "Free"];

function read(): FittingItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: FittingItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}

export function useFittingStudio() {
  const [items, setItems] = useState<FittingItem[]>([]);

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
    count: items.length,
    total: items.reduce((s, i) => s + i.price, 0),
    add: (p: Omit<FittingItem, "size">) => {
      const cur = read();
      if (cur.some((x) => x.id === p.id)) return;
      write([...cur, { ...p, size: "M" }]);
    },
    remove: (id: string) => write(read().filter((x) => x.id !== id)),
    setSize: (id: string, size: string) =>
      write(read().map((x) => (x.id === id ? { ...x, size } : x))),
    clear: () => write([]),
  };
}

export function buildFittingWhatsApp(items: FittingItem[], total: number) {
  const lines = items.map(
    (i) => `• ${i.name} — Size ${i.size} — ₦${i.price.toLocaleString()}`
  );
  const firstImg = items.find((i) => i.image_url)?.image_url;
  const raw = `Hello Magkudy Luxury Wears! I put a look together in your fitting room — please confirm sizes and availability:\n\n${lines.join("\n")}\n\n*Total: ₦${total.toLocaleString()}*${firstImg ? `\n${firstImg}` : ""}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(raw)}`;
}
