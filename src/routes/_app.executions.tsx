import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWebHub, type Status } from "@/lib/webhub-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/webhub/StatusBadge";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_app/executions")({
  head: () => ({ meta: [{ title: "Histórico — WebHub" }] }),
  component: ExecutionsList,
});

const FILTERS: (Status | "ALL")[] = ["ALL", "RUNNING", "QUEUED", "SUCCEEDED", "FAILED", "CANCELED"];

function ExecutionsList() {
  const { executions } = useWebHub();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "ALL">("ALL");

  const filtered = executions.filter((e) => {
    const okQ = (e.id + e.automationName + e.userEmail).toLowerCase().includes(q.toLowerCase());
    const okF = filter === "ALL" || e.status === filter;
    return okQ && okF;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Execuções</h1>
        <p className="text-sm text-muted-foreground">Auditoria completa de todas as execuções.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por ID, robô ou usuário..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="text-xs"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden border-border bg-card">
        <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted/30 px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground md:grid">
          <div className="col-span-3">ID</div>
          <div className="col-span-3">Automação</div>
          <div className="col-span-2">Usuário</div>
          <div className="col-span-2">Criado em</div>
          <div className="col-span-2 text-right">Status</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((e) => (
            <Link
              key={e.id}
              to="/executions/$id"
              params={{ id: e.id }}
              className="grid grid-cols-1 gap-2 px-6 py-4 transition-colors hover:bg-secondary/50 md:grid-cols-12 md:gap-4 md:py-3"
            >
              <div className="col-span-3 font-mono text-xs text-primary">{e.id}</div>
              <div className="col-span-3 truncate text-sm">{e.automationName}</div>
              <div className="col-span-2 truncate text-sm text-muted-foreground">{e.userEmail}</div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {new Date(e.createdAt).toLocaleString("pt-BR")}
              </div>
              <div className="col-span-2 md:text-right">
                <StatusBadge status={e.status} />
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">Nenhuma execução.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
