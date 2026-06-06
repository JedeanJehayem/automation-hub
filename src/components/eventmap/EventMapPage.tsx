import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Radio, Search, ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AreaPanel } from "./AreaPanel";
import {
  type AreaStatus,
  STATUS_COLOR,
  STATUS_LABEL,
  eventMapStore,
  useEventMap,
} from "@/lib/eventmap-store";

const FloorPlanCanvas = lazy(() =>
  import("./FloorPlanCanvas").then((m) => ({ default: m.FloorPlanCanvas })),
);

const STATUSES: AreaStatus[] = [
  "Available",
  "Reserved",
  "InNegotiation",
  "Sold",
  "Blocked",
  "Cancelled",
];

export function EventMapPage() {
  const event = useEventMap();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Set<AreaStatus>>(new Set(STATUSES));
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [mounted, setMounted] = useState(false);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // simulated realtime ticker
  useEffect(() => {
    const id = setInterval(() => setLiveCount((c) => (c + 1) % 1000), 2000);
    return () => clearInterval(id);
  }, []);

  const visibleAreas = useMemo(() => {
    const q = query.trim().toLowerCase();
    return event.areas.filter((a) => {
      if (!filter.has(a.status)) return false;
      if (q && !a.code.toLowerCase().includes(q) && !(a.companyName ?? "").toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [event.areas, query, filter]);

  const selectedAreas = useMemo(
    () => event.areas.filter((a) => selected.has(a.id)),
    [event.areas, selected],
  );

  const stats = useMemo(() => {
    const acc: Record<AreaStatus, number> = {
      Available: 0,
      Reserved: 0,
      InNegotiation: 0,
      Sold: 0,
      Blocked: 0,
      Cancelled: 0,
    };
    event.areas.forEach((a) => (acc[a.status] += 1));
    return acc;
  }, [event.areas]);

  const toggle = (id: string, additive: boolean) => {
    setSelected((prev) => {
      const next = new Set(additive ? prev : []);
      if (prev.has(id) && additive) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFilter = (s: AreaStatus) => {
    setFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Topbar */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <ZoomIn className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {event.edition} · {event.venue}
            </p>
            <h1 className="text-base font-semibold leading-tight">{event.name} — Planta</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            SignalR · {liveCount} eventos
          </Badge>
          <Button variant="outline" size="sm" onClick={() => eventMapStore.simulateRemoteChange()}>
            <Radio className="h-3.5 w-3.5" />
            Simular outro usuário
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left tools */}
        <aside className="w-64 shrink-0 border-r border-border bg-card/40 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar código ou empresa"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Filtrar por status
          </p>
          <div className="mt-2 space-y-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => toggleFilter(s)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                  filter.has(s) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/40"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} />
                  {STATUS_LABEL[s]}
                </span>
                <span className="font-mono text-xs">{stats[s]}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Controles</p>
            <ul className="mt-2 space-y-1">
              <li>• Arrastar = pan</li>
              <li>• Scroll = zoom</li>
              <li>• Shift/Ctrl + clique = multi</li>
            </ul>
          </div>
        </aside>

        {/* Canvas */}
        <main ref={wrapRef} className="relative flex-1 p-4">
          {mounted ? (
            <Suspense fallback={<CanvasFallback />}>
              <FloorPlanCanvas
                areas={visibleAreas}
                selectedIds={selected}
                onToggleSelect={toggle}
                onHover={setHover}
                width={Math.max(400, size.w - 32)}
                height={Math.max(400, size.h - 32)}
              />
            </Suspense>
          ) : (
            <CanvasFallback />
          )}
          {hover && (
            <div className="pointer-events-none absolute bottom-6 left-6 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
              {(() => {
                const a = event.areas.find((x) => x.id === hover);
                if (!a) return null;
                return (
                  <>
                    <p className="font-mono font-semibold">{a.code}</p>
                    <p className="text-muted-foreground">
                      {STATUS_LABEL[a.status]} · {a.sqm} m² · v{a.version}
                    </p>
                  </>
                );
              })()}
            </div>
          )}
        </main>

        {/* Right panel */}
        <aside className="w-[360px] shrink-0 border-l border-border bg-card/40">
          <AreaPanel selected={selectedAreas} onClear={() => setSelected(new Set())} />
        </aside>
      </div>
    </div>
  );
}

function CanvasFallback() {
  return (
    <div className="grid h-full w-full place-items-center rounded-xl border border-dashed border-border bg-card/30 text-sm text-muted-foreground">
      Carregando planta…
    </div>
  );
}