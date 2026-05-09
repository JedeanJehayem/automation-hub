import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)]" aria-hidden="true" />
      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center animate-[fade-in_0.7s_ease-out]">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> Atualizado todos os dias
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            As melhores{" "}
            <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">promoções</span>{" "}
            da internet
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Achadinhos, cupons e ofertas atualizadas diariamente da Shopee, Amazon e Mercado Livre.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#promocoes"
              className="group inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-8 py-3.5 text-base font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
            >
              Ver Promoções
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#categorias" className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
              Explorar categorias
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
