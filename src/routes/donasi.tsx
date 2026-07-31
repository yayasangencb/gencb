import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/donasi")({
  head: () => ({
    meta: [
      { title: "Donasi — GEN-CB" },
      {
        name: "description",
        content: "Dukung program pendidikan dan sosial GEN-CB melalui donasi transfer bank atau QRIS.",
      },
      { property: "og:title", content: "Donasi — GEN-CB" },
      { property: "og:description", content: "Salurkan donasi untuk program GEN-CB." },
    ],
  }),
  component: DonasiPage,
});

const campaigns = [
  { title: "Beasiswa Anak Desa", collected: 34000000, target: 50000000 },
  { title: "Operasional Rumah Belajar", collected: 12500000, target: 25000000 },
  { title: "Santunan Anak Yatim", collected: 18750000, target: 20000000 },
];

const rupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

function DonasiPage() {
  return (
    <>
      <PageHero
        label="Donasi"
        title="Sedikit dari Anda, besar untuk mereka"
        description="Donasi disalurkan langsung untuk program pendidikan, sosial, dan keagamaan GEN-CB dengan laporan berkala."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {campaigns.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className="h-full rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                <h2 className="font-display text-lg font-semibold">{c.title}</h2>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-accent"
                    style={{ width: `${Math.round((c.collected / c.target) * 100)}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {rupiah(c.collected)} terkumpul dari target {rupiah(c.target)}
                </p>
                <Button variant="accent" size="sm" className="mt-6 w-full">
                  Donasi
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 grid gap-6 rounded-4xl bg-gradient-brand p-10 text-primary-foreground shadow-lift lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold">Transfer Bank</h2>
              <p className="mt-3 text-sm opacity-90">Bank Syariah Indonesia</p>
              <p className="font-display text-xl font-bold">7001 2345 678</p>
              <p className="text-sm opacity-90">a.n. Yayasan Generasi Cerdas Beraksi</p>
            </div>
            <div className="glass rounded-3xl p-6">
              <h2 className="font-display text-lg font-semibold">QRIS</h2>
              <p className="mt-2 text-sm opacity-85">
                Scan QRIS resmi GEN-CB di sekretariat atau melalui poster kegiatan. Setelah transfer,
                konfirmasi bukti donasi ke kontak resmi kami.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}