import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWebHub, can } from "@/lib/webhub-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Monitor, Layers, Search, Play } from "lucide-react";

export const Route = createFileRoute("/_app/automations")({
  head: () => ({ meta: [{ title: "Automações — WebHub" }] }),
  component: AutomationsPage,
});

const categoryIcon = { web: Globe, desktop: Monitor, hibrida: Layers } as const;

function AutomationsPage() {
  const { automations, user } = useWebHub();
  const [q, setQ] = useState("");
  const filtered = automations.filter((a) =>
    (a.name + a.description + a.category).toLowerCase().includes(q.toLowerCase())
  );

  const canExec = can(user, "execute");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Automações</h1>
          <p className="text-sm text-muted-foreground">
            {automations.length} robôs disponíveis. Selecione um para executar.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => {
          const Icon = categoryIcon[a.category];
          return (
            <Card
              key={a.id}
              className="group flex flex-col border-border bg-[image:var(--gradient-surface)] p-5 transition-all hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="font-mono text-[10px] uppercase">
                  v{a.version}
                </Badge>
              </div>
              <h3 className="font-semibold tracking-tight">{a.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{a.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <Badge variant="secondary" className="capitalize">
                  {a.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Concorrência: {a.maxConcurrency}
                </span>
              </div>
              <Button
                asChild
                disabled={!canExec}
                className="mt-4 w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <Link to="/automations/$id" params={{ id: a.id }}>
                  <Play className="mr-2 h-4 w-4" />
                  {canExec ? "Executar" : "Apenas leitura"}
                </Link>
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
