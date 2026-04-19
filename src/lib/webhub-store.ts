// In-memory mock store for WebHub. No persistence, no backend.
import { useSyncExternalStore } from "react";

export type Role = "Admin" | "Operador" | "Viewer";
export type Status =
  | "PENDING"
  | "QUEUED"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AutomationParam {
  name: string;
  type: "string" | "number" | "boolean";
  required: boolean;
  default?: string | number | boolean;
  description?: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  category: "web" | "desktop" | "hibrida";
  version: string;
  manifest: {
    name: string;
    description: string;
    parameters: AutomationParam[];
  };
  maxConcurrency: number;
}

export interface ExecutionFile {
  name: string;
  size: number;
  mime: string;
  content: string; // mock textual content
}

export interface Execution {
  id: string;
  automationId: string;
  automationName: string;
  userEmail: string;
  status: Status;
  input: Record<string, unknown>;
  result?: Record<string, unknown>;
  logs: { ts: string; level: "INFO" | "WARN" | "ERROR"; message: string }[];
  files: ExecutionFile[];
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  workspace: string;
}

interface State {
  user: User | null;
  automations: Automation[];
  executions: Execution[];
  globalConcurrency: number;
}

const MOCK_USERS: (User & { password: string })[] = [
  { id: "u1", name: "Ana Admin", email: "admin@webhub.io", role: "Admin", password: "admin" },
  { id: "u2", name: "Otto Operador", email: "op@webhub.io", role: "Operador", password: "op" },
  { id: "u3", name: "Vera Viewer", email: "viewer@webhub.io", role: "Viewer", password: "viewer" },
];

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "bot-invoice",
    name: "Extrator de Notas Fiscais",
    description: "Coleta NF-e de portais e gera planilha consolidada.",
    category: "web",
    version: "1.4.2",
    maxConcurrency: 2,
    manifest: {
      name: "invoice_extractor",
      description: "Extrai notas fiscais de portais governamentais",
      parameters: [
        { name: "cnpj", type: "string", required: true, description: "CNPJ alvo" },
        { name: "mes", type: "number", required: true, default: 1 },
        { name: "incluir_canceladas", type: "boolean", required: false, default: false },
      ],
    },
  },
  {
    id: "bot-sap",
    name: "Lançamento SAP",
    description: "Automação desktop que lança pedidos no SAP GUI.",
    category: "desktop",
    version: "0.9.1",
    maxConcurrency: 1,
    manifest: {
      name: "sap_launcher",
      description: "Lança pedidos no SAP via SAP GUI Scripting",
      parameters: [
        { name: "arquivo_pedidos", type: "string", required: true },
        { name: "ambiente", type: "string", required: true, default: "PRD" },
      ],
    },
  },
  {
    id: "bot-recon",
    name: "Conciliação Bancária",
    description: "Web + planilha local para conciliar extratos.",
    category: "hibrida",
    version: "2.0.0",
    maxConcurrency: 3,
    manifest: {
      name: "bank_recon",
      description: "Concilia extratos bancários com ERP",
      parameters: [
        { name: "banco", type: "string", required: true, default: "Itau" },
        { name: "data_inicio", type: "string", required: true },
        { name: "data_fim", type: "string", required: true },
      ],
    },
  },
  {
    id: "bot-report",
    name: "Relatório Gerencial",
    description: "Gera PDF executivo a partir do data warehouse.",
    category: "web",
    version: "3.2.0",
    maxConcurrency: 4,
    manifest: {
      name: "exec_report",
      description: "Relatório executivo em PDF",
      parameters: [
        { name: "periodo", type: "string", required: true, default: "mensal" },
        { name: "incluir_graficos", type: "boolean", required: false, default: true },
      ],
    },
  },
];

let state: State = {
  user: null,
  automations: MOCK_AUTOMATIONS,
  executions: seedExecutions(),
  globalConcurrency: 5,
};

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function setState(updater: (s: State) => State) {
  state = updater(state);
  emit();
}

function seedExecutions(): Execution[] {
  const now = Date.now();
  return [
    {
      id: "exec-001",
      automationId: "bot-invoice",
      automationName: "Extrator de Notas Fiscais",
      userEmail: "op@webhub.io",
      status: "SUCCEEDED",
      input: { cnpj: "12.345.678/0001-99", mes: 9 },
      result: { total_notas: 142, valor_total: 89432.55 },
      logs: [
        { ts: new Date(now - 600000).toISOString(), level: "INFO", message: "Iniciando workspace exec-001" },
        { ts: new Date(now - 580000).toISOString(), level: "INFO", message: "Login no portal SEFAZ" },
        { ts: new Date(now - 500000).toISOString(), level: "INFO", message: "142 notas baixadas" },
        { ts: new Date(now - 480000).toISOString(), level: "INFO", message: "Execução concluída" },
      ],
      files: [
        { name: "notas_consolidadas.csv", size: 24580, mime: "text/csv", content: "cnpj,numero,valor\n..." },
      ],
      createdAt: new Date(now - 610000).toISOString(),
      startedAt: new Date(now - 600000).toISOString(),
      finishedAt: new Date(now - 480000).toISOString(),
      workspace: "/workspaces/exec-001",
    },
    {
      id: "exec-002",
      automationId: "bot-sap",
      automationName: "Lançamento SAP",
      userEmail: "admin@webhub.io",
      status: "FAILED",
      input: { arquivo_pedidos: "pedidos.xlsx", ambiente: "PRD" },
      logs: [
        { ts: new Date(now - 300000).toISOString(), level: "INFO", message: "Iniciando SAP GUI" },
        { ts: new Date(now - 280000).toISOString(), level: "ERROR", message: "Timeout ao conectar no SAP" },
      ],
      files: [],
      createdAt: new Date(now - 310000).toISOString(),
      startedAt: new Date(now - 300000).toISOString(),
      finishedAt: new Date(now - 270000).toISOString(),
      workspace: "/workspaces/exec-002",
    },
  ];
}

// ---------- Subscriptions ----------
export function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
export function getSnapshot() {
  return state;
}
export function useWebHub() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// ---------- Auth ----------
export function login(email: string, password: string): User | null {
  const u = MOCK_USERS.find((x) => x.email === email && x.password === password);
  if (!u) return null;
  const { password: _p, ...user } = u;
  setState((s) => ({ ...s, user }));
  return user;
}
export function logout() {
  setState((s) => ({ ...s, user: null }));
}
export const demoCredentials = MOCK_USERS.map(({ email, password, role }) => ({ email, password, role }));

// ---------- Permissions ----------
export function can(user: User | null, action: "execute" | "manage" | "view"): boolean {
  if (!user) return false;
  if (action === "view") return true;
  if (action === "execute") return user.role === "Admin" || user.role === "Operador";
  if (action === "manage") return user.role === "Admin";
  return false;
}

// ---------- Execution engine (mock) ----------
function nowIso() {
  return new Date().toISOString();
}

export function createExecution(automationId: string, input: Record<string, unknown>): Execution {
  const auto = state.automations.find((a) => a.id === automationId)!;
  const id = `exec-${String(state.executions.length + 1).padStart(3, "0")}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const exec: Execution = {
    id,
    automationId,
    automationName: auto.name,
    userEmail: state.user?.email ?? "anon",
    status: "PENDING",
    input,
    logs: [{ ts: nowIso(), level: "INFO", message: `Execução ${id} criada e enfileirada.` }],
    files: [],
    createdAt: nowIso(),
    workspace: `/workspaces/${id}`,
  };
  setState((s) => ({ ...s, executions: [exec, ...s.executions] }));
  queueExecution(id);
  return exec;
}

function updateExec(id: string, patch: Partial<Execution> | ((e: Execution) => Partial<Execution>)) {
  setState((s) => ({
    ...s,
    executions: s.executions.map((e) => {
      if (e.id !== id) return e;
      const p = typeof patch === "function" ? patch(e) : patch;
      return { ...e, ...p };
    }),
  }));
}

function appendLog(id: string, level: "INFO" | "WARN" | "ERROR", message: string) {
  updateExec(id, (e) => ({ logs: [...e.logs, { ts: nowIso(), level, message }] }));
}

function runningCount() {
  return state.executions.filter((e) => e.status === "RUNNING").length;
}
function runningForBot(botId: string) {
  return state.executions.filter((e) => e.status === "RUNNING" && e.automationId === botId).length;
}

function queueExecution(id: string) {
  updateExec(id, { status: "QUEUED" });
  appendLog(id, "INFO", "Em fila aguardando slot disponível.");
  setTimeout(() => tryStart(id), 800);
}

function tryStart(id: string) {
  const exec = state.executions.find((e) => e.id === id);
  if (!exec || exec.status !== "QUEUED") return;
  const auto = state.automations.find((a) => a.id === exec.automationId)!;
  if (runningCount() >= state.globalConcurrency || runningForBot(auto.id) >= auto.maxConcurrency) {
    appendLog(id, "INFO", "Slot ocupado, aguardando...");
    setTimeout(() => tryStart(id), 1500);
    return;
  }
  startExecution(id);
}

function startExecution(id: string) {
  updateExec(id, { status: "RUNNING", startedAt: nowIso() });
  appendLog(id, "INFO", `Workspace isolado criado em /workspaces/${id}`);
  appendLog(id, "INFO", "Carregando manifest.json e validando parâmetros");
  appendLog(id, "INFO", "Executando: python main.py --input payload.json --output result.json");

  const steps = [
    "Conectando ao alvo...",
    "Coletando dados...",
    "Processando registros...",
    "Gerando arquivos de saída...",
    "Limpando workspace temporário...",
  ];
  steps.forEach((msg, i) => {
    setTimeout(() => {
      const cur = state.executions.find((e) => e.id === id);
      if (!cur || cur.status !== "RUNNING") return;
      appendLog(id, "INFO", msg);
    }, (i + 1) * 1200);
  });

  setTimeout(() => {
    const cur = state.executions.find((e) => e.id === id);
    if (!cur || cur.status !== "RUNNING") return;
    const fail = Math.random() < 0.15;
    if (fail) {
      appendLog(id, "ERROR", "Erro inesperado: target unreachable (mock)");
      updateExec(id, { status: "FAILED", finishedAt: nowIso() });
    } else {
      appendLog(id, "INFO", "Execução finalizada com sucesso");
      updateExec(id, {
        status: "SUCCEEDED",
        finishedAt: nowIso(),
        result: { processed: Math.floor(Math.random() * 500) + 1, status: "ok" },
        files: [
          {
            name: "result.json",
            size: 320,
            mime: "application/json",
            content: JSON.stringify({ processed: 123, status: "ok" }, null, 2),
          },
          {
            name: "report.csv",
            size: 1024,
            mime: "text/csv",
            content: "id,nome,valor\n1,Item A,99.9\n2,Item B,42.0\n",
          },
        ],
      });
    }
  }, steps.length * 1200 + 800);
}

export function cancelExecution(id: string) {
  const e = state.executions.find((x) => x.id === id);
  if (!e) return;
  if (e.status === "RUNNING" || e.status === "QUEUED" || e.status === "PENDING") {
    appendLog(id, "WARN", "Cancelamento solicitado pelo usuário");
    updateExec(id, { status: "CANCELED", finishedAt: nowIso() });
  }
}

export function downloadFile(file: ExecutionFile) {
  const blob = new Blob([file.content], { type: file.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
