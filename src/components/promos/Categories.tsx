import { Cpu, ChefHat, Home, Gamepad2, Wrench } from "lucide-react";

const categories = [
  { name: "Gadgets", Icon: Cpu },
  { name: "Cozinha", Icon: ChefHat },
  { name: "Casa", Icon: Home },
  { name: "Gamer", Icon: Gamepad2 },
  { name: "Utilidades", Icon: Wrench },
];

export function Categories() {
  return (
    <section id="categorias" className="container mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Categorias em alta</h2>
        <p className="mt-2 text-muted-foreground">Encontre ofertas pelo seu interesse</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {categories.map(({ name, Icon }) => (
          <a
            key={name}
            href="#promocoes"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground transition-transform group-hover:scale-110">
              <Icon className="h-7 w-7" />
            </div>
            <span className="font-semibold">{name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
