import { Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo.png";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.92a4.85 4.85 0 0 1-1.84-.23z"/>
  </svg>
);

const socials = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://tiktok.com", label: "TikTok", Icon: TikTokIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Promoções Agora BR logo" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-primary/40 shadow-[var(--shadow-glow)]" />
          <span className="text-lg font-bold tracking-tight">
            <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Promoções</span>{" "}
            <span className="text-foreground">Agora BR</span>
          </span>
        </a>
        <nav className="flex items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/50 text-muted-foreground transition-all hover:scale-110 hover:border-primary/60 hover:text-primary"
            >
              <Icon />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
