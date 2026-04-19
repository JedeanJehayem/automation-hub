import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Boxes, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { demoCredentials, login, useWebHub } from "@/lib/webhub-store";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WebHub — Portal de Automações" },
      { name: "description", content: "Catálogo, execução e auditoria de automações Python." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user } = useWebHub();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@webhub.io");
  const [password, setPassword] = useState("admin");

  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(email, password);
    if (u) {
      toast.success(`Bem-vindo, ${u.name}`);
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[image:var(--gradient-surface)] lg:block">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,oklch(0.74_0.18_162/.4),transparent_50%),radial-gradient(circle_at_70%_70%,oklch(0.7_0.15_200/.4),transparent_50%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
              <Boxes className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">WebHub</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Orquestre todos os seus robôs em um único portal.
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Catálogo de automações, execução isolada por workspace, fila de
              concorrência, logs em tempo real e download de artefatos.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              MVP demonstrativo — dados em memória
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WebHub Automation Portal
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border bg-card p-8 shadow-[var(--shadow-elegant)]">
          <div className="mb-6 lg:hidden flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
              <Boxes className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">WebHub</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Entrar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse o portal de automações.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
              Entrar
            </Button>
          </form>

          <div className="mt-8 rounded-lg border border-border bg-muted/40 p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Credenciais de demonstração
            </p>
            <ul className="space-y-1 font-mono text-xs">
              {demoCredentials.map((c) => (
                <li key={c.email} className="flex justify-between gap-2">
                  <button
                    type="button"
                    className="text-left text-foreground hover:text-primary"
                    onClick={() => {
                      setEmail(c.email);
                      setPassword(c.password);
                    }}
                  >
                    {c.email} / {c.password}
                  </button>
                  <span className="text-muted-foreground">{c.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
