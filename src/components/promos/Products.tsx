import { ProductCard, type Product } from "./ProductCard";

const products: Product[] = [
  { id: "1", name: "Fone Bluetooth TWS com Cancelamento de Ruído", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80", oldPrice: 299.9, price: 129.9, store: "Shopee", url: "#", category: "Gadgets" },
  { id: "2", name: "Air Fryer Digital 5L Inox", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80", oldPrice: 599, price: 349, store: "Amazon", url: "#", category: "Cozinha" },
  { id: "3", name: "Aspirador Robô Inteligente WiFi", image: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=600&q=80", oldPrice: 1299, price: 799, store: "Mercado Livre", url: "#", category: "Casa" },
  { id: "4", name: "Teclado Mecânico RGB Gamer", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80", oldPrice: 459, price: 249, store: "Amazon", url: "#", category: "Gamer" },
  { id: "5", name: "Smartwatch Tela AMOLED 1.85\"", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80", oldPrice: 499, price: 199, store: "Shopee", url: "#", category: "Gadgets" },
  { id: "6", name: "Liquidificador Alta Potência 1200W", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80", oldPrice: 389, price: 219, store: "Mercado Livre", url: "#", category: "Cozinha" },
  { id: "7", name: "Headset Gamer 7.1 com Microfone", image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&q=80", oldPrice: 549, price: 289, store: "Amazon", url: "#", category: "Gamer" },
  { id: "8", name: "Organizador Multiuso Dobrável (Kit 6)", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=600&q=80", oldPrice: 149, price: 59.9, store: "Shopee", url: "#", category: "Utilidades" },
];

export function Products() {
  return (
    <section id="promocoes" className="container mx-auto px-4 py-16">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Promoções de hoje</h2>
          <p className="mt-2 text-muted-foreground">Selecionadas a dedo para você economizar</p>
        </div>
        <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          {products.length} ofertas ativas
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
