import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { submitContactMessage } from "@/lib/cloud/public-forms";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ORG } from "@/data/gencb";

export const Route = createFileRoute("/kontak")({
  head: () => ({
    meta: [
      { title: "Kontak — GEN-CB" },
      {
        name: "description",
        content: "Hubungi Yayasan Generasi Cerdas Beraksi: alamat sekretariat, WhatsApp, dan email.",
      },
      { property: "og:title", content: "Kontak — GEN-CB" },
      { property: "og:description", content: "Alamat, kontak, dan formulir hubungi kami GEN-CB." },
    ],
  }),
  component: KontakPage,
});

function KontakPage() {
  return (
    <>
      <PageHero
        label="Kontak"
        title="Hubungi kami"
        description="Untuk kerja sama, sponsorship, atau menjadi relawan, silakan hubungi sekretariat GEN-CB."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="space-y-4">
              {[
                { icon: MapPin, label: "Alamat", value: ORG.address },
                { icon: Phone, label: "WhatsApp", value: ORG.phone },
                { icon: Mail, label: "Email", value: ORG.email },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-soft"
                >
                  <c.icon className="mt-1 size-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="mt-1 text-sm">{c.value}</p>
                  </div>
                </div>
              ))}
              <div className="overflow-hidden rounded-3xl border border-border/60 shadow-soft">
                <iframe
                  title="Peta lokasi sekretariat GEN-CB"
                  src="https://www.google.com/maps?q=Sasak%20Panjang%20Tajurhalang%20Bogor&output=embed"
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formEl = e.currentTarget;
                const fd = new FormData(formEl);
                const ok = await submitContactMessage({
                  name: String(fd.get("nama") ?? ""),
                  email: String(fd.get("email") ?? ""),
                  message: `${String(fd.get("subjek") ?? "")}\n\n${String(fd.get("pesan") ?? "")}`,
                });
                if (!ok) {
                  toast.error("Pesan gagal terkirim", {
                    description: "Silakan coba lagi beberapa saat lagi.",
                  });
                  return;
                }
                toast.success("Pesan terkirim", {
                  description: "Terima kasih, tim GEN-CB akan segera menghubungi Anda.",
                });
                formEl.reset();
              }}
              className="space-y-5 rounded-3xl border border-border/60 bg-card p-8 shadow-soft"
            >
              <h2 className="font-display text-2xl font-bold">Formulir Hubungi Kami</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input id="nama" name="nama" required placeholder="Nama Anda" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="nama@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjek">Subjek</Label>
                <Input id="subjek" name="subjek" required placeholder="Kerja sama / relawan / lainnya" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pesan">Pesan</Label>
                <Textarea id="pesan" name="pesan" required rows={6} placeholder="Tulis pesan Anda..." />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full">
                Kirim Pesan
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}