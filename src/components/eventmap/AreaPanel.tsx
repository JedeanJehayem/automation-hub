import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type AreaStatus,
  type MapArea,
  STATUS_COLOR,
  STATUS_LABEL,
  eventMapStore,
} from "@/lib/eventmap-store";

const TRANSITIONS: AreaStatus[] = [
  "Available",
  "Reserved",
  "InNegotiation",
  "Sold",
  "Blocked",
  "Cancelled",
];

interface Props {
  selected: MapArea[];
  onClear: () => void;
}

export function AreaPanel({ selected, onClear }: Props) {
  const [target, setTarget] = useState<AreaStatus>("Reserved");
  const [company, setCompany] = useState("");

  const totalSqm = selected.reduce((s, a) => s + a.sqm, 0);
  const totalPrice = selected.reduce((s, a) => s + a.basePrice, 0);

  const apply = () => {
    if (!selected.length) return;
    const versions = selected.map((a) => a.version);
    const { conflict } = eventMapStore.updateAreaStatus(
      selected.map((a) => a.id),
      target,
      { company: company || undefined, expectedVersion: versions[0] },
    );
    if (conflict) {
      toast.error("Conflito de concorrência (HTTP 409)", {
        description: "Outra pessoa atualizou esta área. Recarregue para ver o estado atual.",
      });
      return;
    }
    toast.success(`${selected.length} área(s) atualizadas para ${STATUS_LABEL[target]}`);
    setCompany("");
  };

  if (!selected.length) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Nenhuma área selecionada</p>
        <p className="mt-2">
          Clique em uma área para inspecionar. Use <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Shift</kbd> ou{" "}
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">Ctrl</kbd> para múltipla seleção.
        </p>
        <div className="mt-6 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground">Legenda</p>
          {TRANSITIONS.map((s) => (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded" style={{ background: STATUS_COLOR[s] }} />
              {STATUS_LABEL[s]}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Seleção
          </p>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpar
          </Button>
        </div>
        <p className="mt-1 text-lg font-semibold">
          {selected.length} área{selected.length > 1 ? "s" : ""}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.slice(0, 12).map((a) => (
            <Badge key={a.id} variant="secondary" className="font-mono text-xs">
              {a.code}
            </Badge>
          ))}
          {selected.length > 12 && (
            <Badge variant="outline">+{selected.length - 12}</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-b border-border p-4 text-sm">
        <Metric label="Metragem total" value={`${totalSqm} m²`} />
        <Metric label="Valor-base" value={brl(totalPrice)} />
      </div>

      {selected.length === 1 && (
        <div className="space-y-2 border-b border-border p-4 text-sm">
          <Row k="Código" v={selected[0].code} />
          <Row k="Tipo" v={selected[0].type} />
          <Row
            k="Status"
            v={
              <Badge style={{ background: STATUS_COLOR[selected[0].status], color: "#0b0d12" }}>
                {STATUS_LABEL[selected[0].status]}
              </Badge>
            }
          />
          <Row k="Empresa" v={selected[0].companyName ?? "—"} />
          <Row k="Versão" v={`v${selected[0].version}`} />
          <Row
            k="Atualizada"
            v={new Date(selected[0].updatedAt).toLocaleString("pt-BR")}
          />
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-auto p-4">
        <div className="space-y-2">
          <Label>Alterar status para</Label>
          <Select value={target} onValueChange={(v) => setTarget(v as AreaStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRANSITIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} />
                    {STATUS_LABEL[s]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(target === "Reserved" || target === "InNegotiation" || target === "Sold") && (
          <div className="space-y-2">
            <Label>Empresa / Negociação</Label>
            <Input
              placeholder="Ex.: Acme Tech — NEG-2034"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <Button className="w-full" onClick={apply}>
          Aplicar a {selected.length} área{selected.length > 1 ? "s" : ""}
        </Button>
        <p className="mt-2 text-xs text-muted-foreground">
          Controle de concorrência otimista — versão validada antes de gravar.
        </p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}