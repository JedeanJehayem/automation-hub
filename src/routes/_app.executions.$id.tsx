import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { useWebHub, cancelExecution, downloadFile, can } from "@/lib/webhub-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/webhub/StatusBadge";
import { ArrowLeft, Ban, Download, FileText, FolderOpen, Terminal } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/executions/$id")({
  head: () => ({ meta: [{ title: "Execução — WebHub" }] }),
  component: ExecutionDetail,
});

function ExecutionDetail() {
  const { id } = Route.useParams();
  const { executions, user } = useWebHub();
  const exec = executions.find((e) => e.id === id);
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [exec?.logs.length]);

  if (!exec) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Execução não encontrada.</p>
        <Link to="/executions" className="text-primary hover:underline">
          Voltar ao histórico
        </Link>
      </div>
    );
  }

  const isActive = exec.status === "RUNNING" || exec.status === "QUEUED" || exec.status === "PENDING";
  const canCancel = can(user, "execute") && isActive;

  const duration =
    exec.startedAt && exec.finishedAt
      ? `${Math.round((new Date(exec.finishedAt).getTime() - new Date(exec.startedAt).getTime()) / 1000)}s`
      : exec.startedAt
      ? `${Math.round((Date.now() - new Date(exec.startedAt).getTime()) / 1000)}s (em andamento)`
      : "—";

  return (
    <div className="space-y-6">
      <Link
        to="/executions"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao histórico
      </Link>

      <Card className="border-border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs text-primary">{exec.id}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{exec.automationName}</h1>
            <p className="text-sm text-muted-foreground">por {exec.userEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={exec.status} />
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  cancelExecution(exec.id);
                  toast.success("Execução cancelada");
                }}
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Workspace" value={exec.workspace} mono />
          <Stat label="Duração" value={duration} />
          <Stat label="Criado em" value={new Date(exec.createdAt).toLocaleString("pt-BR")} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-[#0d1117] p-0 lg:col-span-2 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-card/40 px-4 py-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Logs em tempo real</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{exec.logs.length} linhas</span>
          </div>
          <div ref={logsRef} className="max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed">
            {exec.logs.map((l, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-muted-foreground">{new Date(l.ts).toLocaleTimeString("pt-BR")}</span>
                <span
                  className={
                    l.level === "ERROR"
                      ? "text-destructive"
                      : l.level === "WARN"
                      ? "text-warning"
                      : "text-info"
                  }
                >
                  [{l.level}]
                </span>
                <span className="text-foreground">{l.message}</span>
              </div>
            ))}
            {isActive && <div className="mt-2 inline-block h-3 w-2 animate-pulse bg-primary" />}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-primary" /> Input (JSON)
            </h3>
            <pre className="overflow-auto rounded-md bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
{JSON.stringify(exec.input, null, 2)}
            </pre>
          </Card>

          <Card className="border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-success" /> Resultado
            </h3>
            {exec.result ? (
              <pre className="overflow-auto rounded-md bg-muted/40 p-3 font-mono text-xs text-muted-foreground">
{JSON.stringify(exec.result, null, 2)}
              </pre>
            ) : (
              <p className="text-xs text-muted-foreground">Aguardando conclusão...</p>
            )}
          </Card>

          <Card className="border-border bg-card p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <FolderOpen className="h-4 w-4 text-accent" /> Arquivos gerados
            </h3>
            {exec.files.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum arquivo ainda.</p>
            ) : (
              <ul className="space-y-2">
                {exec.files.map((f) => (
                  <li
                    key={f.name}
                    className="flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {(f.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => downloadFile(f)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-1 text-sm ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}
