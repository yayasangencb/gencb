import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { programs as defaultPrograms, images, getDummyImage } from "@/data/gencb";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicPrograms } from "@/lib/cloud/home";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Program — GEN-CB" },
      {
        name: "description",
        content:
          "Program GEN-CB di bidang Pendidikan, Keagamaan, Sosial, Olahraga, Lingkungan, dan Teknologi.",
      },
      { property: "og:title", content: "Program — GEN-CB" },
      {
        property: "og:description",
        content: "Pilar bidang program berkelanjutan Yayasan Generasi Cerdas Beraksi.",
      },
    ],
  }),
  component: ProgramPage,
});

function ProgramPage() {
  const { data: displayList = [] } = useQuery({
    queryKey: ["public-programs"],
    queryFn: fetchPublicPrograms,
  });

  return (
    <>
      <PageHero
        label="Program"
        title="Program unggulan GEN-CB"
        description="Setiap program dirancang bersama masyarakat, dijalankan relawan terlatih, dan dievaluasi secara berkala."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading label="Kategori" title="Bidang gerakan GEN-CB" align="left" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayList.map((p, i) => {
            const imgSrc = getDummyImage(p.cover_image ?? undefined, p.category, images.progPendidikan);
            return (
              <Reveal key={p.id} delay={i * 0.06}>
                <article className="group h-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={p.title}
                      loading="lazy"
                      width={1200}
                      height={800}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-gradient-accent px-3 py-1 text-[11px] font-semibold text-primary-foreground">
                      {p.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-lg font-semibold">{p.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {p.description}
                    </p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-widest text-accent">
                      Target: {p.target_text ?? "Masyarakat umum"}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}