import { Reveal } from "./reveal";

export function PageHero({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-brand pb-20 pt-36 text-primary-foreground">
      <div className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-brand-sky/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-72 rounded-full bg-brand-orange/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">{label}</span>
          <h1 className="max-w-3xl text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed opacity-85 sm:text-base">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}