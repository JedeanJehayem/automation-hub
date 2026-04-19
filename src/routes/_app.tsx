import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Boxes, History, LayoutGrid, LogOut, Shield, Workflow } from "lucide-react";
import { logout, useWebHub } from "@/lib/webhub-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/automations", label: "Automações", icon: Workflow },
  { to: "/executions", label: "Histórico", icon: History },
] as const;

function AppShell() {
  const { user } = useWebHub();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) navigate({ to: "/" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-2 border-b border-border px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
            <Boxes className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold tracking-tight">WebHub</p>
            <p className="text-xs text-muted-foreground">Automation Portal</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
              {user.name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                {user.role}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={() => {
              logout();
              navigate({ to: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-card/80 px-4 py-3 backdrop-blur md:hidden">
        <Boxes className="h-5 w-5 text-primary" />
        <span className="font-semibold">WebHub</span>
        <span className="ml-2 text-xs text-muted-foreground">{user.role}</span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-2 py-2 md:hidden">
        {nav.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className="md:pl-64">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
