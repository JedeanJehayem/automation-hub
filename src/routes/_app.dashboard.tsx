import { createFileRoute, Link } from "@tanstack/react-router";
import { useWebHub } from "@/lib/webhub-store";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/webhub/StatusBadge";
import { Activity, CheckCircle2, ListChecks, XCircle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — WebHub" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { executions, automations } = useWebHub();
  const running = executions.filter((e) => e.status === "RUNNING" || e.status === "QUEUED").length;
  const success = executions.filter((e) => e.status === "SUCCEEDED").length;
  const failed = executions.filter((e) => e.status === "FAILED").length;

  const stats = [
    { label: "Automações", value: automations.length, icon: ListChecks, accent: "text-info" },
    { label: "Em execução", value: running, icon: Activity, accent: "text-primary" },
    { label: "Sucesso", value: success, icon: CheckCircle2, accent: "text-success" },
    { label: "Falhas", value: failed, icon: XCircle, accent: "text-destructive" },
  ];

  const recent = executions.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral das automações e execuções.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-border bg-[image:var(--gradient-surface)] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <Icon className={`h-4 w-4 ${s.accent}`} />
              </div>
              <p className="mt-2 text-3xl font-bold tracking-tight">{s.value}</p>
            </Card>
          );
        })}
      </div>

      <Card className="border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-semibold">Execuções recentes</h2>
          <Link to="/executions" className="flex items-center gap-1 text-sm text-primary hover:underline">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recent.map((e) => (
            <Link
              key={e.id}
              to="/executions/$id"
              params={{ id: e.id }}
              className="flex items-center justify-between px-6 py-3 hover:bg-secondary/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.automationName}</p>
                <p className="font-mono text-xs text-muted-foreground">{e.id}</p>
              </div>
              <StatusBadge status={e.status} />
            </Link>
          ))}
          {recent.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">Nenhuma execução ainda.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
