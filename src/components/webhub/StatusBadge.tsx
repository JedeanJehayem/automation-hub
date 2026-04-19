import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/webhub-store";
import { cn } from "@/lib/utils";

const map: Record<Status, string> = {
  PENDING: "bg-muted text-muted-foreground border-border",
  QUEUED: "bg-info/15 text-info border-info/30",
  RUNNING: "bg-primary/15 text-primary border-primary/30 animate-pulse",
  SUCCEEDED: "bg-success/15 text-success border-success/30",
  FAILED: "bg-destructive/15 text-destructive border-destructive/30",
  CANCELED: "bg-warning/15 text-warning border-warning/30",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={cn("font-mono text-xs tracking-wide", map[status])}>
      {status}
    </Badge>
  );
}
