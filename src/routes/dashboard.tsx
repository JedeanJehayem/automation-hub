import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/webhub/AppLayout";
import { useWebHub } from "@/lib/webhub-store";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/webhub/StatusBadge";
import { Activity, CheckCircle2, Workflow, XCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — WebHub" }] }),
  component: () => (
    <AppLayout-wrapper>
      <DashboardPage />
    </AppLayout-wrapper>
  ),
});

function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <AppLayout />;
}
// Trick: TanStack expects a single component. We render layout + content via outlet pattern below.
