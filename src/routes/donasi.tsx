import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchDonationPrograms,
  fetchVerifiedDonations,
  formatDateId,
  formatRupiah,
  submitDonation,
  type DonationProgramRow,
} from "@/lib/cloud/public-data";

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

const rupiah = formatRupiah;
const QUICK = [50000, 100000, 250000, 500000];

function DonasiPage() {
  const queryClient = useQueryClient();
  const { data: campaigns = [] } = useQuery({
    queryKey: ["donation-programs"],
    queryFn: fetchDonationPrograms,
  });
  const { data: donors = [] } = useQuery({
    queryKey: ["donations-verified"],
    queryFn: () => fetchVerifiedDonations(),
  });

  const [selected, setSelected] = useState<DonationProgramRow | null>(null);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState<number>(100000);
  const [method, setMethod] = useState<"transfer" | "qris">("transfer");
  const [anon, setAnon] = useState(false);
  const [proof, setProof] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const onSubmit = async () => {
    if (!selected) return;
    if (!anon && donorName.trim().length < 2) {
      toast.error("Isi nama donatur atau pilih donasi anonim.");
      return;
    }
    if (!amount || amount < 10000) {
      toast.error("Nominal minimal Rp 10.000.");
      return;
    }
    setSending(true);
    const ok = await submitDonation({
      programId: selected.id,
      donorName: donorName.trim(),
      amount,
      method,
      isAnonymous: anon,
      proofUrl: proof,
    });
    setSending(false);
    if (!ok) {
      toast.error("Donasi gagal dikirim. Coba lagi.");
      return;
    }
    toast.success("Terima kasih! Donasi Anda menunggu verifikasi admin.");
    setSelected(null);
    setDonorName("");
    setProof(null);
    setAnon(false);
    void queryClient.invalidateQueries({ queryKey: ["donations-verified"] });
  };

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
            <Reveal key={c.id} delay={i * 0.07}>
              <div className="h-full rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                {c.cover_image ? (
                  <img
                    src={c.cover_image}
                    alt={c.title}
                    loading="lazy"
                    width={800}
                    height={500}
                    className="mb-5 h-40 w-full rounded-2xl object-cover"
                  />
                ) : null}
                <h2 className="font-display text-lg font-semibold">{c.title}</h2>
                {c.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                ) : null}
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-accent"
                    style={{
                      width: `${Math.min(100, Math.round((c.collected_amount / Math.max(1, c.target_amount)) * 100))}%`,
                    }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {rupiah(c.collected_amount)} terkumpul dari target {rupiah(c.target_amount)}
                </p>
                <Button
                  variant="accent"
                  size="sm"
                  className="mt-6 w-full"
                  onClick={() => setSelected(c)}
                >
                  <Heart /> Donasi sekarang
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

        <Reveal>
          <div className="mt-12 rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
            <h2 className="font-display text-xl font-bold">Donatur terbaru</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Daftar donatur yang donasinya telah diverifikasi tim GEN-CB.
            </p>
            <div className="mt-6 divide-y divide-border/60">
              {donors.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">
                      {d.is_anonymous ? "Hamba Allah" : (d.donor_name ?? "Donatur")}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateId(d.created_at)}</p>
                  </div>
                  <span className="font-display font-semibold text-accent">
                    {rupiah(Number(d.amount))}
                  </span>
                </div>
              ))}
              {donors.length === 0 ? (
                <p className="py-6 text-sm text-muted-foreground">
                  Belum ada donasi terverifikasi. Jadilah donatur pertama.
                </p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </section>

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Donasi — {selected?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="donor">Nama donatur</Label>
              <Input
                id="donor"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Nama Anda"
                disabled={anon}
              />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox checked={anon} onCheckedChange={(v) => setAnon(v === true)} />
                Tampilkan sebagai Hamba Allah (anonim)
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Nominal donasi</Label>
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <Button
                    key={q}
                    type="button"
                    variant={amount === q ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setAmount(q)}
                  >
                    {rupiah(q)}
                  </Button>
                ))}
              </div>
              <Input
                id="amount"
                type="number"
                min={10000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Metode pembayaran</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={method === "transfer" ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setMethod("transfer")}
                >
                  Transfer Bank
                </Button>
                <Button
                  type="button"
                  variant={method === "qris" ? "hero" : "outline"}
                  size="sm"
                  onClick={() => setMethod("qris")}
                >
                  QRIS
                </Button>
              </div>
              <p className="rounded-2xl bg-secondary p-4 text-xs text-muted-foreground">
                {method === "transfer"
                  ? "Bank Syariah Indonesia — 7001 2345 678 a.n. Yayasan Generasi Cerdas Beraksi."
                  : "Scan QRIS resmi GEN-CB pada poster kegiatan atau sekretariat yayasan."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof">Bukti transfer (opsional)</Label>
              <Input
                id="proof"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return setProof(null);
                  const reader = new FileReader();
                  reader.onload = () => setProof(String(reader.result).slice(0, 200));
                  reader.readAsDataURL(file);
                }}
              />
              {proof ? <p className="text-xs text-muted-foreground">Bukti terlampir.</p> : null}
            </div>

            <Button variant="hero" className="w-full" disabled={sending} onClick={onSubmit}>
              {sending ? "Mengirim..." : "Kirim donasi"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}