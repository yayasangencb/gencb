import { events } from "@/data/events";
import type { AdminRole } from "./auth";

export type NewsRow = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: "DRAFT" | "PUBLISH";
  tags: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
  image: string;
};

export const newsCategories = [
  "Pendidikan",
  "Sosial",
  "Olahraga",
  "Keagamaan",
  "Pengumuman",
  "Prestasi",
];

export const seedNews: NewsRow[] = [
  {
    id: "n-1",
    title: "GEN-CB Resmi Membuka Pendaftaran MTQ Tingkat Desa",
    category: "Keagamaan",
    author: "Nabila Rahmawati",
    date: "2026-07-24",
    status: "PUBLISH",
    tags: "mtq, keagamaan, lomba",
    seoTitle: "Pendaftaran MTQ Desa Sasak Panjang 2026 Dibuka",
    seoDescription: "Empat cabang lomba MTQ dibuka untuk anak dan remaja Desa Sasak Panjang.",
    content:
      "Empat cabang lomba dibuka: Tilawah, Hifdzil Qur'an, Murottal, dan Adzan, terbuka untuk anak dan remaja.",
    image: "prog-keagamaan",
  },
  {
    id: "n-2",
    title: "Rumah Belajar GEN-CB Tembus 300 Siswa Aktif",
    category: "Pendidikan",
    author: "Intan Permata",
    date: "2026-07-12",
    status: "PUBLISH",
    tags: "rumah belajar, pendidikan",
    seoTitle: "Rumah Belajar GEN-CB Capai 300 Siswa",
    seoDescription: "Program bimbingan belajar gratis GEN-CB terus bertumbuh berkat relawan pengajar.",
    content: "Program bimbingan belajar gratis terus tumbuh berkat dukungan relawan pengajar mahasiswa.",
    image: "prog-pendidikan",
  },
  {
    id: "n-3",
    title: "Aksi Bersih Desa Libatkan 120 Relawan Muda",
    category: "Sosial",
    author: "Ahmad Fauzan",
    date: "2026-06-30",
    status: "PUBLISH",
    tags: "lingkungan, relawan",
    seoTitle: "Aksi Bersih Desa Sasak Panjang 2026",
    seoDescription: "Kolaborasi karang taruna dan pemerintah desa membuka titik bank sampah baru.",
    content: "Kolaborasi bersama karang taruna dan pemerintah desa menghasilkan titik bank sampah baru.",
    image: "prog-sosial",
  },
  {
    id: "n-4",
    title: "Laporan Tahunan GEN-CB 2026",
    category: "Pengumuman",
    author: "Ahmad Fauzan",
    date: "2026-08-01",
    status: "PUBLISH",
    tags: "laporan, transparansi",
    seoTitle: "Laporan Tahunan GEN-CB 2026",
    seoDescription: "Ringkasan capaian program dan penggunaan dana sepanjang 2026.",
    content: "Draf laporan tahunan yang memuat capaian program dan penggunaan dana.",
    image: "hero-gencb",
  },
];

export type CommentRow = {
  id: string;
  news: string;
  name: string;
  message: string;
  date: string;
  status: "PENDING" | "APPROVED" | "SPAM";
};

export const seedComments: CommentRow[] = [
  {
    id: "c-1",
    news: "GEN-CB Resmi Membuka Pendaftaran MTQ Tingkat Desa",
    name: "Ibu Ratna",
    message: "Apakah anak usia 7 tahun boleh ikut cabang murottal?",
    date: "2026-07-25",
    status: "APPROVED",
  },
  {
    id: "c-2",
    news: "Rumah Belajar GEN-CB Tembus 300 Siswa Aktif",
    name: "Dimas",
    message: "Semangat terus kakak relawan!",
    date: "2026-07-13",
    status: "APPROVED",
  },
  {
    id: "c-3",
    news: "Aksi Bersih Desa Libatkan 120 Relawan Muda",
    name: "Ahmad",
    message: "Alhamdulillah sangat bermanfaat untuk warga.",
    date: "2026-07-02",
    status: "APPROVED",
  },
];

export type EventRow = {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: "OPEN" | "SOON" | "ONGOING" | "CLOSED";
  date: string;
  location: string;
  mapQuery: string;
  quota: number;
  registered: number;
  fee: number;
  openDate: string;
  closeDate: string;
  committee: string;
  description: string;
};

export const seedEvents: EventRow[] = events.map((e, i) => ({
  id: `e-${i + 1}`,
  title: e.title,
  slug: e.slug,
  category: e.category,
  status: e.status === "CLOSED" ? "OPEN" : e.status,
  date: e.date,
  location: e.location,
  mapQuery: e.mapQuery,
  quota: e.quota,
  registered: e.registered,
  fee: e.fee,
  openDate: e.timeline[0]?.date ?? "-",
  closeDate: e.timeline[e.timeline.length - 1]?.date ?? "-",
  committee: e.committee
    .slice(0, 2)
    .map((c) => c.name)
    .join(", "),
  description: e.excerpt,
}));

export type ProgramRow = {
  id: string;
  title: string;
  category: string;
  target: string;
  description: string;
  status: "AKTIF" | "ARSIP";
};

export const seedPrograms: ProgramRow[] = [
  { id: "p-1", title: "Rumah Belajar Generasi", category: "Pendidikan", target: "Pelajar SD–SMA", description: "Bimbingan belajar gratis dan kelas literasi.", status: "AKTIF" },
  { id: "p-2", title: "MTQ & Kajian Remaja", category: "Keagamaan", target: "Anak & Remaja", description: "Kelas tahfidz dan kajian rutin remaja.", status: "AKTIF" },
  { id: "p-3", title: "Program Jalan Sehat (2 Minggu Sekali)", category: "Olahraga", target: "Warga & Pemuda Desa", description: "Jalan santai rutin 2 mingguan warga.", status: "AKTIF" },
  { id: "p-4", title: "Bakti Sosial & Santunan", category: "Sosial", target: "Masyarakat Umum", description: "Santunan yatim dan paket sembako.", status: "AKTIF" },
  { id: "p-5", title: "GEN-CB Sport Community & Tenis Meja", category: "Olahraga", target: "Pemuda & Warga", description: "Turnamen tenis meja dan liga kampung.", status: "AKTIF" },
  { id: "p-6", title: "Aksi Desa Hijau", category: "Lingkungan", target: "Warga & Relawan", description: "Bank sampah dan penanaman pohon.", status: "AKTIF" },
  { id: "p-7", title: "Kelas Digital Muda", category: "Teknologi", target: "Pemuda 15–25 tahun", description: "Pelatihan desain dan literasi digital.", status: "AKTIF" },
];

export type BannerRow = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  order: number;
  status: "AKTIF" | "NONAKTIF";
};

export const seedBanners: BannerRow[] = [
  { id: "b-1", title: "Membangun Generasi Cerdas & Berdampak", subtitle: "Bergabung jadi relawan GEN-CB", ctaLabel: "Jelajahi Program", ctaLink: "/program", order: 1, status: "AKTIF" },
  { id: "b-2", title: "MTQ Desa Sasak Panjang 2026", subtitle: "Pendaftaran dibuka sampai 5 September", ctaLabel: "Daftar Sekarang", ctaLink: "/event/mtq-desa-sasak-panjang", order: 2, status: "AKTIF" },
  { id: "b-3", title: "Donasi Rumah Belajar", subtitle: "Dukung operasional kelas gratis", ctaLabel: "Donasi", ctaLink: "/donasi", order: 3, status: "AKTIF" },
];

export type GalleryRow = {
  id: string;
  caption: string;
  album: string;
  type: "FOTO" | "VIDEO";
  date: string;
  url: string;
};

export const seedGallery: GalleryRow[] = [
  { id: "g-1", caption: "MTQ Desa Sasak Panjang", album: "MTQ 2026", type: "FOTO", date: "2026-07-20", url: "mtq-banner.jpg" },
  { id: "g-2", caption: "Turnamen Tenis Meja", album: "Sport Community", type: "FOTO", date: "2026-08-02", url: "tenis-meja.jpg" },
  { id: "g-3", caption: "Program Jalan Sehat Rutin 2 Mingguan", album: "Sport Community", type: "FOTO", date: "2026-08-05", url: "program-jalan.jpg" },
  { id: "g-4", caption: "Kelas Rumah Belajar", album: "Rumah Belajar", type: "FOTO", date: "2026-07-05", url: "prog-pendidikan.jpg" },
  { id: "g-5", caption: "Bakti Sosial Warga", album: "Baksos Ramadan", type: "FOTO", date: "2026-03-18", url: "prog-sosial.jpg" },
];

export type SponsorRow = {
  id: string;
  name: string;
  type: "SPONSOR" | "MITRA" | "PEMERINTAH";
  contact: string;
  website: string;
  status: "AKTIF" | "NONAKTIF";
};

export const seedSponsors: SponsorRow[] = [
  { id: "s-1", name: "Pemerintah Desa Sasak Panjang", type: "PEMERINTAH", contact: "0251-000111", website: "sasakpanjang.desa.id", status: "AKTIF" },
  { id: "s-2", name: "DKM Al-Ikhlas", type: "MITRA", contact: "0812-1111-2222", website: "-", status: "AKTIF" },
  { id: "s-3", name: "Komunitas Literasi Bogor", type: "MITRA", contact: "0813-3333-4444", website: "literasibogor.id", status: "AKTIF" },
  { id: "s-4", name: "Toko Berkah Jaya", type: "SPONSOR", contact: "0857-5555-6666", website: "-", status: "AKTIF" },
];

export type ParticipantRow = {
  id: string;
  number: string;
  name: string;
  eventSlug: string;
  eventTitle: string;
  competition: string;
  phone: string;
  school: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  documents: string;
  attendance: "BELUM" | "CHECKIN" | "CHECKOUT";
  certificate: "BELUM" | "TERBIT";
  createdAt: string;
};

const firstNames = [
  "Rizki", "Aisyah", "Bagas", "Salma", "Fajar", "Nadia", "Yusuf", "Laila",
  "Dimas", "Putri", "Arif", "Zahra", "Hendra", "Maya", "Ilham", "Kirana",
  "Rafi", "Anisa", "Galih", "Sekar",
];
const lastNames = ["Pratama", "Nurhaliza", "Saputra", "Ramadhan", "Lestari", "Wibowo", "Anggraini", "Firdaus"];
const schools = ["SDN Sasak Panjang 01", "MTs Nurul Huda", "SMPN 2 Tajurhalang", "SMAN 1 Bogor", "Umum"];

function buildParticipants(): ParticipantRow[] {
  const rows: ParticipantRow[] = [];
  let seq = 1;
  events.forEach((event) => {
    const count = Math.min(event.registered, 12);
    for (let i = 0; i < count; i += 1) {
      const name = `${firstNames[(seq * 3) % firstNames.length]} ${lastNames[(seq * 5) % lastNames.length]}`;
      const status: ParticipantRow["status"] = seq % 7 === 0 ? "REJECTED" : seq % 3 === 0 ? "PENDING" : "ACCEPTED";
      rows.push({
        id: `pt-${seq}`,
        number: `GENCB-2026-${String(seq).padStart(4, "0")}`,
        name,
        eventSlug: event.slug,
        eventTitle: event.title,
        competition: event.competitions[i % Math.max(event.competitions.length, 1)]?.name ?? "Umum",
        phone: `0812-${String(1000 + seq).slice(0, 4)}-${String(2000 + seq * 3).slice(0, 4)}`,
        school: schools[seq % schools.length]!,
        status,
        documents: status === "REJECTED" ? "KK tidak terbaca" : "Lengkap",
        attendance: event.status === "ONGOING" && i % 2 === 0 ? "CHECKIN" : "BELUM",
        certificate: event.status === "CLOSED" ? "TERBIT" : "BELUM",
        createdAt: `2026-0${(seq % 8) + 1}-${String((seq % 27) + 1).padStart(2, "0")}`,
      });
      seq += 1;
    }
  });
  return rows;
}

export const seedParticipants: ParticipantRow[] = buildParticipants();

export type CertificateTemplateRow = {
  id: string;
  name: string;
  eventSlug: string;
  orientation: "LANDSCAPE" | "PORTRAIT";
  signer: string;
  status: "AKTIF" | "DRAFT";
};

export const seedCertificateTemplates: CertificateTemplateRow[] = [
  { id: "ct-1", name: "Template MTQ 2026", eventSlug: "mtq-desa-sasak-panjang", orientation: "LANDSCAPE", signer: "Ketua GEN-CB & Kepala Desa", status: "AKTIF" },
  { id: "ct-2", name: "Template Seminar Pemuda", eventSlug: "seminar-pemuda-berdaya", orientation: "LANDSCAPE", signer: "Ketua Pelaksana", status: "AKTIF" },
  { id: "ct-3", name: "Template Baksos", eventSlug: "bakti-sosial-ramadan", orientation: "PORTRAIT", signer: "Ketua GEN-CB", status: "DRAFT" },
];

export type DonationProgramRow = {
  id: string;
  title: string;
  target: number;
  collected: number;
  deadline: string;
  status: "AKTIF" | "SELESAI";
};

export const seedDonationPrograms: DonationProgramRow[] = [
  { id: "dp-1", title: "Operasional Rumah Belajar", target: 25000000, collected: 16400000, deadline: "2026-12-31", status: "AKTIF" },
  { id: "dp-2", title: "Santunan Anak Yatim", target: 15000000, collected: 15000000, deadline: "2026-03-18", status: "SELESAI" },
  { id: "dp-3", title: "Renovasi Sekretariat GEN-CB", target: 40000000, collected: 8250000, deadline: "2027-02-28", status: "AKTIF" },
];

export type DonorRow = {
  id: string;
  name: string;
  program: string;
  amount: number;
  method: "TRANSFER" | "QRIS";
  date: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  anonymous: boolean;
};

export const seedDonors: DonorRow[] = [
  { id: "d-1", name: "Hj. Sumiati", program: "Operasional Rumah Belajar", amount: 2000000, method: "TRANSFER", date: "2026-07-28", status: "VERIFIED", anonymous: false },
  { id: "d-2", name: "Hamba Allah", program: "Santunan Anak Yatim", amount: 500000, method: "QRIS", date: "2026-07-30", status: "VERIFIED", anonymous: true },
  { id: "d-3", name: "PT Berkah Mandiri", program: "Renovasi Sekretariat GEN-CB", amount: 5000000, method: "TRANSFER", date: "2026-08-01", status: "PENDING", anonymous: false },
  { id: "d-4", name: "Andi Wijaya", program: "Operasional Rumah Belajar", amount: 250000, method: "QRIS", date: "2026-08-02", status: "PENDING", anonymous: false },
];

export type NotificationRow = {
  id: string;
  title: string;
  channel: "EMAIL" | "WHATSAPP" | "PUSH";
  audience: string;
  message: string;
  schedule: string;
  status: "DRAFT" | "TERKIRIM";
};

export const seedNotifications: NotificationRow[] = [
  { id: "no-1", title: "Pengingat Technical Meeting MTQ", channel: "WHATSAPP", audience: "Peserta MTQ", message: "Technical meeting dilaksanakan 9 September pukul 19.30 di Masjid Al-Ikhlas.", schedule: "2026-09-08", status: "DRAFT" },
  { id: "no-2", title: "Status Pendaftaran Diterima", channel: "EMAIL", audience: "Peserta terverifikasi", message: "Selamat, pendaftaran Anda telah diverifikasi panitia.", schedule: "2026-08-01", status: "TERKIRIM" },
  { id: "no-3", title: "Info Jalan Santai Keluarga", channel: "PUSH", audience: "Semua pengguna", message: "Pendaftaran jalan santai dibuka 10 Oktober 2026.", schedule: "2026-10-10", status: "DRAFT" },
];

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  event?: string | undefined;
  active: boolean;
  lastLogin: string;
};

export const seedUsers: UserRow[] = [];