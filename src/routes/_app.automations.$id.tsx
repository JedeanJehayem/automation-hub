import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useWebHub, can, createExecution } from "@/lib/webhub-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileJson, Play } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/automations/$id")({
  head: () => ({ meta: [{ title: "Executar automação — WebHub" }] }),
  component: AutomationDetail,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p>Automação não encontrada.</p>
      <Link to="/automations" className="text-primary hover:underline">
        Voltar
      </Link>
    </div>
  ),
});

function AutomationDetail() {
  const { id } = Route.useParams();
  const { automations, user } = useWebHub();
  const navigate = useNavigate();
  const automation = automations.find((a) => a.id === id);

  const initial: Record<string, unknown> = {};
  automation?.manifest.parameters.forEach((p) => {
    if (p.default !== undefined) initial[p.name] = p.default;
    else if (p.type === "boolean") initial[p.name] = false;
    else if (p.type === "number") initial[p.name] = 0;
    else initial[p.name] = "";
  });
  const [values, setValues] = useState<Record<string, unknown>>(initial);

  if (!automation) {
    return (
      <div className="p-8">
        <p>Automação não encontrada.</p>
      </div>
    );
  }

  const canExec = can(user, "execute");

  const handleRun = () => {
    if (!canExec) {
      toast.error("Você não tem permissão para executar.");
      return;
    }
    for (const p of automation.manifest.parameters) {
      if (p.required && (values[p.name] === "" || values[p.name] === undefined)) {
        toast.error(`Parâmetro obrigatório: ${p.name}`);
        return;
      }
    }
    const exec = createExecution(automation.id, values);
    toast.success(`Execução ${exec.id} criada`);
    navigate({ to: "/executions/$id", params: { id: exec.id } });
  };

  return (
    <div className="space-y-6">
      <Link to="/automations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">{automation.name}</h1>
              <Badge variant="outline" className="font-mono text-xs">v{automation.version}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{automation.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">{automation.category}</Badge>
              <Badge variant="outline">Concorrência: {automation.maxConcurrency}</Badge>
            </div>
          </Card>

          <Card className="border-border bg-card p-6">
            <h2 className="mb-4 font-semibold">Parâmetros de entrada</h2>
            <div className="space-y-4">
              {automation.manifest.parameters.map((p) => (
                <div key={p.name} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {p.name}
                    {p.required && <span className="text-destructive">*</span>}
                    <span className="font-mono text-xs text-muted-foreground">({p.type})</span>
                  </Label>
                  {p.type === "boolean" ? (
                    <Switch
                      checked={Boolean(values[p.name])}
                      onCheckedChange={(v) => setValues((s) => ({ ...s, [p.name]: v }))}
                    />
                  ) : (
                    <Input
                      type={p.type === "number" ? "number" : "text"}
                      value={String(values[p.name] ?? "")}
                      onChange={(e) =>
                        setValues((s) => ({
                          ...s,
                          [p.name]: p.type === "number" ? Number(e.target.value) : e.target.value,
                        }))
                      }
                    />
                  )}
                  {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
                </div>
              ))}
            </div>
            <Button
              onClick={handleRun}
              disabled={!canExec}
              className="mt-6 w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
            >
              <Play className="mr-2 h-4 w-4" />
              Executar agora
            </Button>
            {!canExec && (
              <p className="mt-2 text-center text-xs text-warning">
                Seu papel ({user?.role}) não permite executar.
              </p>
            )}
          </Card>
        </div>

        <Card className="h-fit border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <FileJson className="h-4 w-4 text-primary" /> manifest.json
          </h2>
          <pre className="overflow-auto rounded-md bg-muted/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
{JSON.stringify(automation.manifest, null, 2)}
          </pre>
          <div className="mt-4 rounded-md border border-border bg-muted/20 p-3">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">CLI</p>
            <code className="font-mono text-xs">python main.py --input payload.json --output result.json</code>
          </div>
        </Card>
      </div>
    </div>
  );
}
