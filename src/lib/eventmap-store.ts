import { useSyncExternalStore } from "react";

export type AreaStatus =
  | "Available"
  | "Reserved"
  | "InNegotiation"
  | "Sold"
  | "Blocked"
  | "Cancelled";

export const STATUS_LABEL: Record<AreaStatus, string> = {
  Available: "Disponível",
  Reserved: "Reservada",
  InNegotiation: "Em negociação",
  Sold: "Vendida",
  Blocked: "Bloqueada",
  Cancelled: "Cancelada",
};

export const STATUS_COLOR: Record<AreaStatus, string> = {
  Available: "#34c28a",
  Reserved: "#e7c14a",
  InNegotiation: "#e89a3c",
  Sold: "#e35c4b",
  Blocked: "#6b7280",
  Cancelled: "#3f4654",
};

export interface MapArea {
  id: string;
  code: string;
  name: string;
  type: string;
  status: AreaStatus;
  sqm: number;
  basePrice: number;
  x: number;
  y: number;
  width: number;
  height: number;
  negotiationId?: string;
  companyName?: string;
  version: number;
  updatedAt: string;
}

export interface EventInfo {
  id: string;
  name: string;
  edition: string;
  venue: string;
  startsAt: string;
  areas: MapArea[];
}

function mkArea(
  i: number,
  code: string,
  x: number,
  y: number,
  w: number,
  h: number,
  status: AreaStatus = "Available",
  type = "Estande",
): MapArea {
  const sqm = Math.round((w * h) / 400);
  return {
    id: `a-${i}`,
    code,
    name: `${type} ${code}`,
    type,
    status,
    sqm,
    basePrice: sqm * 850,
    x,
    y,
    width: w,
    height: h,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
}

const event: EventInfo = {
  id: "evt-2026-tech",
  name: "TechExpo Brasil",
  edition: "Edição 2026",
  venue: "Pavilhão Anhembi — São Paulo",
  startsAt: "2026-09-14",
  areas: (() => {
    const out: MapArea[] = [];
    let i = 1;
    // Block A — top row
    for (let c = 0; c < 6; c++) {
      out.push(mkArea(i++, `A${String(c + 1).padStart(2, "0")}`, 80 + c * 110, 80, 90, 70));
    }
    // Block B — mid
    for (let c = 0; c < 6; c++) {
      out.push(mkArea(i++, `B${String(c + 1).padStart(2, "0")}`, 80 + c * 110, 200, 90, 90));
    }
    // Block C — large premium
    for (let c = 0; c < 4; c++) {
      out.push(mkArea(i++, `C${String(c + 1).padStart(2, "0")}`, 80 + c * 160, 340, 140, 110, "Available", "Premium"));
    }
    // Block D — corner
    out.push(mkArea(i++, "D01", 740, 80, 130, 100, "Sold"));
    out.push(mkArea(i++, "D02", 740, 200, 130, 90, "InNegotiation"));
    out.push(mkArea(i++, "D03", 740, 310, 130, 140, "Reserved", "Premium"));
    // seed some demo statuses
    out[2].status = "Sold";
    out[2].companyName = "Acme Tech";
    out[5].status = "InNegotiation";
    out[8].status = "Reserved";
    out[14].status = "Blocked";
    return out;
  })(),
};

type Listener = () => void;
const listeners = new Set<Listener>();
let state: EventInfo = event;

function emit() {
  state = { ...state, areas: [...state.areas] };
  listeners.forEach((l) => l());
}

export const eventMapStore = {
  getState: () => state,
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  updateAreaStatus(ids: string[], status: AreaStatus, opts?: { company?: string; expectedVersion?: number }) {
    let conflict = false;
    state.areas = state.areas.map((a) => {
      if (!ids.includes(a.id)) return a;
      if (opts?.expectedVersion && a.version !== opts.expectedVersion) {
        conflict = true;
        return a;
      }
      return {
        ...a,
        status,
        companyName: status === "Available" ? undefined : opts?.company ?? a.companyName,
        version: a.version + 1,
        updatedAt: new Date().toISOString(),
      };
    });
    emit();
    return { conflict };
  },
  /** Simulate another user changing an area (realtime push). */
  simulateRemoteChange() {
    const candidates = state.areas.filter((a) => a.status === "Available");
    if (!candidates.length) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    eventMapStore.updateAreaStatus([pick.id], "Reserved", { company: "Outro Usuário" });
  },
};

export function useEventMap(): EventInfo {
  return useSyncExternalStore(
    eventMapStore.subscribe,
    eventMapStore.getState,
    eventMapStore.getState,
  );
}