import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/promos/Header";
import { Hero } from "@/components/promos/Hero";
import { Categories } from "@/components/promos/Categories";
import { Products } from "@/components/promos/Products";
import { Footer } from "@/components/promos/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Promoções Agora BR — Achadinhos, cupons e ofertas diárias" },
      { name: "description", content: "As melhores promoções da Shopee, Amazon e Mercado Livre. Achadinhos, cupons e ofertas atualizadas diariamente." },
      { property: "og:title", content: "Promoções Agora BR" },
      { property: "og:description", content: "Achadinhos, cupons e ofertas atualizadas diariamente." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Products />
        <Categories />
      </main>
      <Footer />
    </div>
  );
}
