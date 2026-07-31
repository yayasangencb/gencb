import { cn } from "@/lib/utils";
import type { EventStatus } from "@/data/gencb";

const styles: Record<EventStatus, string> = {
  OPEN: "bg-status-open/15 text-status-open border-status-open/30",
  SOON: "bg-status-soon/15 text-status-soon border-status-soon/30",
  ONGOING: "bg-status-ongoing/15 text-status-ongoing border-status-ongoing/30",
  CLOSED: "bg-status-closed/15 text-status-closed border-status-closed/30",
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-sm",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}