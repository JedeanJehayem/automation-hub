import { ShoppingCart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  image: string;
  oldPrice: number;
  price: number;
  store: "Shopee" | "Amazon" | "Mercado Livre";
  url: string;
  category: string;
}

const storeColors: Record<Product["store"], string> = {
  Shopee: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Amazon: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Mercado Livre": "bg-amber-400/20 text-amber-200 border-amber-400/30",
};

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--shadow-glow)]">
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
          -{discount}%
        </span>
        <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur ${storeColors[product.store]}`}>
          {product.store}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-semibold leading-snug">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground line-through">{fmt(product.oldPrice)}</span>
          <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-2xl font-extrabold text-transparent">
            {fmt(product.price)}
          </span>
        </div>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          <ShoppingCart className="h-4 w-4" />
          Comprar Agora
        </a>
      </div>
    </article>
  );
}
