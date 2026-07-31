import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: {
  label: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{label}</span>
      <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">{title}</h2>
      <span className="h-1 w-20 rounded-full bg-gradient-accent" />
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}