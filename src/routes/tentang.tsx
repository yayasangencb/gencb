import { createFileRoute } from "@tanstack/react-router";
import { Award, Compass, Flag, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export const Route = createFileRoute("/tentang")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — GEN-CB" },
      {
        name: "description",
        content:
          "Sejarah, visi, misi, nilai, struktur organisasi, dan legalitas Yayasan Generasi Cerdas Beraksi.",
      },
      { property: "og:title", content: "Tentang Kami — GEN-CB" },
      {
        property: "og:description",
        content: "Mengenal perjalanan dan nilai-nilai Yayasan Generasi Cerdas Beraksi.",
      },
    ],
  }),
  component: TentangPage,
});

const values = [
  { icon: Sparkles, title: "Cerdas", desc: "Berpikir kritis, terus belajar, dan berbasis data." },
  { icon: ShieldCheck, title: "Berkarakter", desc: "Jujur, amanah, dan menjunjung akhlak mulia." },
  { icon: HeartHandshake, title: "Kolaboratif", desc: "Bergerak bersama warga, sekolah, dan mitra." },
  { icon: Flag, title: "Berdampak", desc: "Program terukur dengan manfaat nyata." },
];

const timeline = [
  { year: "2019", text: "Komunitas belajar kecil dibentuk oleh pemuda desa." },
  { year: "2021", text: "Program Rumah Belajar & santunan rutin mulai berjalan." },
  { year: "2023", text: "MTQ tingkat desa pertama diselenggarakan GEN-CB." },
  { year: "2025", text: "Resmi berbadan hukum yayasan dengan 6 bidang program." },
  { year: "2026", text: "Digitalisasi administrasi: pendaftaran & sertifikat online." },
];

const structure = [
  { role: "Pembina", name: "Dewan Pembina Yayasan" },
  { role: "Ketua Umum", name: "Ketua GEN-CB" },
  { role: "Sekretaris", name: "Sekretariat & Administrasi" },
  { role: "Bendahara", name: "Keuangan & Donasi" },
  { role: "Divisi Program", name: "Pendidikan, Keagamaan, Sosial" },
  { role: "Divisi Media", name: "Publikasi & Dokumentasi" },
];

function TentangPage() {
  return (
    <>
      <PageHero
        label="Tentang Kami"
        title="Yayasan Generasi Cerdas Beraksi"
        description="Berawal dari kelompok belajar kecil di desa, GEN-CB tumbuh menjadi yayasan kepemudaan yang bergerak di pendidikan, sosial, keagamaan, olahraga, dan pengabdian masyarakat."
      />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <Compass className="size-7 text-accent" />
              <h2 className="mt-4 font-display text-2xl font-bold">Visi</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Menjadi wadah gerakan pemuda yang melahirkan generasi cerdas, berkarakter, dan
                berdampak bagi masyarakat Indonesia.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <Award className="size-7 text-accent" />
              <h2 className="mt-4 font-display text-2xl font-bold">Misi</h2>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>• Menyelenggarakan pendidikan non-formal yang inklusif dan gratis.</li>
                <li>• Membina karakter religius melalui kegiatan keagamaan yang ramah anak muda.</li>
                <li>• Menggerakkan aksi sosial dan pengabdian masyarakat berkelanjutan.</li>
                <li>• Mengembangkan potensi pemuda lewat olahraga, seni, dan teknologi.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading label="Nilai Organisasi" title="Empat nilai yang kami pegang" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.07}>
                <div className="h-full rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                  <v.icon className="size-6 text-accent" />
                  <p className="mt-4 font-display font-semibold">{v.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading label="Perjalanan" title="Timeline organisasi" align="left" />
        <div className="mt-12 border-l border-border pl-6">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.06}>
              <div className="relative pb-10">
                <span className="absolute -left-[31px] top-1 size-4 rounded-full bg-gradient-accent" />
                <p className="font-display text-lg font-bold text-gradient-brand">{t.year}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading label="Struktur Organisasi" title="Siapa di balik GEN-CB" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {structure.map((s, i) => (
              <Reveal key={s.role} delay={i * 0.05}>
                <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                    {s.role}
                  </p>
                  <p className="mt-2 font-display font-semibold">{s.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <h2 className="font-display text-2xl font-bold">Legalitas</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Yayasan Generasi Cerdas Beraksi terdaftar resmi dengan akta notaris dan SK Kemenkumham.
                Dokumen legalitas dapat diminta melalui sekretariat.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-gradient-brand p-8 text-primary-foreground shadow-lift">
              <h2 className="font-display text-2xl font-bold">Makna Logo</h2>
              <p className="mt-3 text-sm leading-relaxed opacity-90">
                Gradasi biru melambangkan ilmu dan ketenangan berpikir, aksen oranye melambangkan
                semangat aksi pemuda, dan bentuk melingkar menandakan kebersamaan komunitas.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}