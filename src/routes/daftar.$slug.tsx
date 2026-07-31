import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEvent, formatRupiah, type GencbEvent } from "@/data/events";
import { saveRegistration } from "@/lib/registrations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/daftar/$slug")({
  loader: ({ params }) => {
    const event = getEvent(params.slug);
    if (!event) throw notFound();
    return event;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Pendaftaran ${loaderData.title} — GEN-CB` },
          {
            name: "description",
            content: `Formulir pendaftaran online kegiatan ${loaderData.title} yang diselenggarakan GEN-CB.`,
          },
          { property: "og:title", content: `Pendaftaran ${loaderData.title} — GEN-CB` },
          { property: "og:description", content: loaderData.excerpt },
        ]
      : [],
  }),
  component: RegistrationPage,
});

type FormState = {
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  rw: string;
  phone: string;
  email: string;
  school: string;
  competition: string;
  ktp: string;
  kk: string;
  photo: string;
  payment: string;
  agree: boolean;
};

const empty: FormState = {
  fullName: "",
  nik: "",
  birthPlace: "",
  birthDate: "",
  gender: "",
  address: "",
  rw: "",
  phone: "",
  email: "",
  school: "",
  competition: "",
  ktp: "",
  kk: "",
  photo: "",
  payment: "",
  agree: false,
};

const steps = ["Data Diri", "Kontak & Kategori", "Dokumen", "Konfirmasi"];

function RegistrationPage() {
  const event = Route.useLoaderData() as GencbEvent;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const set = (key: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (current: number) => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (current === 0) {
      if (form.fullName.trim().length < 3) next.fullName = "Nama lengkap minimal 3 karakter";
      if (!/^\d{16}$/.test(form.nik)) next.nik = "NIK harus 16 digit angka";
      if (!form.birthPlace.trim()) next.birthPlace = "Tempat lahir wajib diisi";
      if (!form.birthDate) next.birthDate = "Tanggal lahir wajib diisi";
      if (!form.gender) next.gender = "Pilih jenis kelamin";
    }
    if (current === 1) {
      if (form.address.trim().length < 10) next.address = "Alamat lengkap minimal 10 karakter";
      if (!form.rw.trim()) next.rw = "RW wajib diisi";
      if (!/^(08|\+62)\d{7,13}$/.test(form.phone.replace(/[\s-]/g, "")))
        next.phone = "Nomor WhatsApp tidak valid (contoh: 081234567890)";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Email tidak valid";
      if (!form.school.trim()) next.school = "Asal sekolah/instansi wajib diisi";
      if (event.competitions.length > 0 && !form.competition)
        next.competition = "Pilih kategori lomba";
    }
    if (current === 2) {
      if (!form.ktp) next.ktp = "Foto KTP/Kartu Pelajar wajib diunggah";
      if (!form.kk) next.kk = "Foto Kartu Keluarga wajib diunggah";
      if (!form.photo) next.photo = "Pas foto wajib diunggah";
      if (event.fee > 0 && !form.payment) next.payment = "Bukti pembayaran wajib diunggah";
    }
    if (current === 3 && !form.agree) next.agree = "Centang persetujuan syarat & ketentuan";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate(3)) {
      toast.error("Lengkapi persetujuan terlebih dahulu");
      return;
    }
    const entry = saveRegistration({
      eventSlug: event.slug,
      eventTitle: event.title,
      eventDate: event.date,
      fullName: form.fullName,
      nik: form.nik,
      birthPlace: form.birthPlace,
      birthDate: form.birthDate,
      gender: form.gender,
      address: form.address,
      rw: form.rw,
      phone: form.phone,
      email: form.email,
      school: form.school,
      competition: form.competition || "-",
      documents: { ktp: form.ktp, kk: form.kk, photo: form.photo, payment: form.payment },
    });
    toast.success(`Pendaftaran berhasil — nomor peserta ${entry.number}`);
    navigate({ to: "/dashboard", search: { id: entry.id } });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-brand pb-16 pt-32 text-primary-foreground">
        <div className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-brand-sky/40 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Link to="/event/$slug" params={{ slug: event.slug }} className="inline-flex items-center gap-2 text-xs opacity-85 hover:opacity-100">
            <ArrowLeft className="size-4" /> Kembali ke detail kegiatan
          </Link>
          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Pendaftaran {event.title}</h1>
          <p className="mt-3 text-sm opacity-85">
            {event.date} · {event.location} ·{" "}
            {event.fee === 0 ? "Gratis" : `Kontribusi ${formatRupiah(event.fee)}`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <ol className="flex flex-wrap items-center gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  i <= step
                    ? "bg-gradient-brand text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {i < step ? <CheckCircle2 className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 ? <span className="hidden h-px w-8 bg-border sm:block" /> : null}
            </li>
          ))}
        </ol>

        <form
          className="mt-8 space-y-6 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < steps.length - 1) {
              if (validate(step)) setStep((s) => s + 1);
              else toast.error("Periksa kembali isian yang ditandai merah");
            } else {
              submit();
            }
          }}
        >
          {step === 0 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nama Lengkap" error={errors.fullName} className="sm:col-span-2">
                <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Nama sesuai KTP/KK" />
              </Field>
              <Field label="NIK" error={errors.nik}>
                <Input value={form.nik} inputMode="numeric" maxLength={16} onChange={(e) => set("nik", e.target.value)} placeholder="16 digit" />
              </Field>
              <Field label="Jenis Kelamin" error={errors.gender}>
                <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tempat Lahir" error={errors.birthPlace}>
                <Input value={form.birthPlace} onChange={(e) => set("birthPlace", e.target.value)} placeholder="Kota/Kabupaten" />
              </Field>
              <Field label="Tanggal Lahir" error={errors.birthDate}>
                <Input type="date" value={form.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Alamat Lengkap" error={errors.address} className="sm:col-span-2">
                <Textarea rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Jalan, RT, desa, kecamatan" />
              </Field>
              <Field label="RW" error={errors.rw}>
                <Input value={form.rw} onChange={(e) => set("rw", e.target.value)} placeholder="Contoh: 04" />
              </Field>
              <Field label="Nomor HP (WhatsApp)" error={errors.phone}>
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="081234567890" />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="nama@email.com" />
              </Field>
              <Field label="Asal Sekolah / Instansi" error={errors.school}>
                <Input value={form.school} onChange={(e) => set("school", e.target.value)} placeholder="SDN Sasak Panjang 01" />
              </Field>
              {event.competitions.length > 0 ? (
                <Field label="Kategori Lomba" error={errors.competition} className="sm:col-span-2">
                  <Select value={form.competition} onValueChange={(v) => set("competition", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {event.competitions.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name} · {c.age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <FileField label="Foto KTP / Kartu Pelajar" value={form.ktp} error={errors.ktp} onChange={(v) => set("ktp", v)} />
              <FileField label="Foto Kartu Keluarga" value={form.kk} error={errors.kk} onChange={(v) => set("kk", v)} />
              <FileField label="Pas Foto Terbaru" value={form.photo} error={errors.photo} onChange={(v) => set("photo", v)} />
              {event.fee > 0 ? (
                <FileField
                  label={`Bukti Pembayaran (${formatRupiah(event.fee)})`}
                  value={form.payment}
                  error={errors.payment}
                  onChange={(v) => set("payment", v)}
                />
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-semibold">Periksa kembali data Anda</h2>
              <dl className="grid gap-3 rounded-2xl border border-border/60 p-5 text-sm sm:grid-cols-2">
                {[
                  ["Nama Lengkap", form.fullName],
                  ["NIK", form.nik],
                  ["TTL", `${form.birthPlace}, ${form.birthDate}`],
                  ["Jenis Kelamin", form.gender],
                  ["Alamat", form.address],
                  ["RW", form.rw],
                  ["WhatsApp", form.phone],
                  ["Email", form.email],
                  ["Asal Sekolah", form.school],
                  ["Kategori", form.competition || "-"],
                  ["Dokumen", [form.ktp, form.kk, form.photo, form.payment].filter(Boolean).length + " berkas terunggah"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</dt>
                    <dd className="mt-0.5 font-medium">{v || "-"}</dd>
                  </div>
                ))}
              </dl>
              <label className="flex items-start gap-3 text-sm">
                <Checkbox checked={form.agree} onCheckedChange={(v) => set("agree", v === true)} className="mt-0.5" />
                <span className="text-muted-foreground">
                  Saya menyatakan data yang diisi benar dan menyetujui syarat & ketentuan kegiatan GEN-CB.
                </span>
              </label>
              {errors.agree ? <p className="text-xs font-medium text-destructive">{errors.agree}</p> : null}
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ArrowLeft /> Sebelumnya
            </Button>
            <Button type="submit" variant="hero" size="sm">
              {step === steps.length - 1 ? "Kirim Pendaftaran" : "Lanjut"} <ArrowRight />
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string | undefined;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

function FileField({
  label,
  value,
  error,
  onChange,
}: {
  label: string;
  value: string;
  error?: string | undefined;
  onChange: (name: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </Label>
      <label
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-4 text-xs transition-colors hover:bg-secondary",
          value ? "border-status-open/50 text-foreground" : "border-border text-muted-foreground",
        )}
      >
        <Upload className="size-4 shrink-0 text-accent" />
        <span className="truncate">{value || "Pilih berkas JPG/PNG maks. 2 MB"}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
              toast.error("Ukuran berkas melebihi 2 MB");
              return;
            }
            onChange(file.name);
          }}
        />
      </label>
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}