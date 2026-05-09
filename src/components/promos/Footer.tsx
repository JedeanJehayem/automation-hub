import { Instagram, Facebook } from "lucide-react";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.92a4.85 4.85 0 0 1-1.84-.23z"/>
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">
              <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Promoções</span> Agora BR
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              As melhores ofertas da Shopee, Amazon e Mercado Livre, atualizadas todos os dias.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Siga-nos</h4>
            <div className="mt-3 flex gap-2">
              {[
                { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
                { href: "https://tiktok.com", label: "TikTok", Icon: TikTokIcon },
                { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-all hover:scale-110 hover:border-primary hover:text-primary"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Aviso de afiliados</h4>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Este site participa dos programas de afiliados da Shopee, Amazon e Mercado Livre. Podemos receber comissões por compras qualificadas, sem custo adicional para você. Os preços e a disponibilidade podem mudar a qualquer momento.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Promoções Agora BR. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
