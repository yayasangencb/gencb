import heroImg from "@/assets/hero-gencb.jpg";
import progPendidikan from "@/assets/prog-pendidikan.jpg";
import progKeagamaan from "@/assets/prog-keagamaan.jpg";
import progSosial from "@/assets/prog-sosial.jpg";
import progOlahraga from "@/assets/prog-olahraga.jpg";
import mtqBanner from "@/assets/mtq-banner.jpg";
import tenisMeja from "@/assets/tenis-meja.jpg";
import programJalan from "@/assets/program-jalan.jpg";

export const images = { heroImg, progPendidikan, progKeagamaan, progSosial, progOlahraga, mtqBanner, tenisMeja, programJalan };

export const ORG = {
  name: "Generasi Cerdas Beraksi",
  short: "GEN-CB",
  tagline: "Membangun Generasi Cerdas, Berkarakter, dan Berdampak untuk Indonesia.",
  email: "halo@gencb.or.id",
  phone: "+62 857-7220-2454",
  address: "Sekretariat GEN-CB, Desa Sasak Panjang, Kec. Tajurhalang, Kab. Bogor, Jawa Barat",
};

export const stats = [
  { label: "Program Terlaksana", value: 48, suffix: "+" },
  { label: "Peserta Terlibat", value: 3200, suffix: "+" },
  { label: "Kegiatan per Tahun", value: 26, suffix: "" },
  { label: "Mitra & Sponsor", value: 34, suffix: "+" },
];

export type ProgramCategory =
  | "Pendidikan"
  | "Keagamaan"
  | "Sosial"
  | "Olahraga"
  | "Lingkungan"
  | "Teknologi";

export const programs: {
  slug: string;
  title: string;
  category: ProgramCategory;
  description: string;
  target: string;
  image: string;
}[] = [
  {
    slug: "rumah-belajar",
    title: "Rumah Belajar Generasi",
    category: "Pendidikan",
    description:
      "Bimbingan belajar gratis, kelas literasi, dan pendampingan akademik untuk anak-anak desa.",
    target: "Pelajar SD–SMA",
    image: progPendidikan,
  },
  {
    slug: "mtq-dan-kajian",
    title: "MTQ & Kajian Remaja",
    category: "Keagamaan",
    description:
      "Musabaqah Tilawatil Qur'an, kelas tahfidz, dan kajian rutin yang membentuk karakter religius.",
    target: "Anak & Remaja",
    image: mtqBanner,
  },
  {
    slug: "program-jalan-sehat",
    title: "Program Jalan Sehat (2 Minggu Sekali)",
    category: "Olahraga",
    description:
      "Kegiatan olah tubuh dan jalan santai bersama warga yang dilaksanakan rutin setiap 2 minggu sekali untuk menjaga kesehatan dan mempererat tali silaturahmi.",
    target: "Warga & Pemuda Desa",
    image: programJalan,
  },
  {
    slug: "bakti-sosial",
    title: "Bakti Sosial & Santunan",
    category: "Sosial",
    description:
      "Santunan anak yatim, paket sembako, dan aksi tanggap bantuan bagi warga yang membutuhkan.",
    target: "Masyarakat Umum",
    image: progSosial,
  },
  {
    slug: "sport-community",
    title: "GEN-CB Sport Community & Turnamen Tenis Meja",
    category: "Olahraga",
    description:
      "Turnamen tenis meja, liga badminton, dan olahraga rutin untuk menghidupkan semangat sportivitas.",
    target: "Pemuda & Warga",
    image: tenisMeja,
  },
  {
    slug: "desa-hijau",
    title: "Aksi Desa Hijau",
    category: "Lingkungan",
    description:
      "Kerja bakti, penanaman pohon, bank sampah, dan edukasi pengelolaan lingkungan berkelanjutan.",
    target: "Warga & Relawan",
    image: progSosial,
  },
  {
    slug: "kelas-digital",
    title: "Kelas Digital Muda",
    category: "Teknologi",
    description:
      "Pelatihan komputer, desain, dan literasi digital agar pemuda desa siap bersaing di era digital.",
    target: "Pemuda 15–25 tahun",
    image: progPendidikan,
  },
];

export type { EventStatus } from "./events";
export { events } from "./events";

export const news = [
  {
    slug: "gencb-buka-pendaftaran-mtq",
    title: "GEN-CB Resmi Membuka Pendaftaran MTQ Tingkat Desa",
    category: "Keagamaan",
    date: "24 Juli 2026",
    excerpt:
      "Empat cabang lomba dibuka: Tilawah, Hifdzil Qur'an, Murottal, dan Adzan, terbuka untuk anak dan remaja.",
    image: mtqBanner,
  },
  {
    slug: "program-jalan-sehat-rutin",
    title: "Program Jalan Sehat GEN-CB Digelar Setiap 2 Minggu Sekali",
    category: "Olahraga",
    date: "5 Agustus 2026",
    excerpt:
      "Inisiatif kebugaran rutin warga desa untuk menggalakkan pola hidup sehat dan meningkatkan keakraban antar-warga.",
    image: programJalan,
  },
  {
    slug: "rumah-belajar-tembus-300-siswa",
    title: "Rumah Belajar GEN-CB Tembus 300 Siswa Aktif",
    category: "Pendidikan",
    date: "12 Juli 2026",
    excerpt:
      "Program bimbingan belajar gratis terus tumbuh berkat dukungan relawan pengajar dari kalangan mahasiswa.",
    image: progPendidikan,
  },
  {
    slug: "aksi-bersih-desa",
    title: "Aksi Bersih Desa Libatkan 120 Relawan Muda",
    category: "Sosial",
    date: "30 Juni 2026",
    excerpt:
      "Kolaborasi bersama karang taruna dan pemerintah desa menghasilkan titik bank sampah baru.",
    image: progSosial,
  },
];

export const gallery = [
  { src: mtqBanner, caption: "Musabaqoh Tilawatil Qur'an (MTQ) Desa Sasak Panjang", tag: "Keagamaan" },
  { src: tenisMeja, caption: "Turnamen Tenis Meja GEN-CB", tag: "Olahraga" },
  { src: programJalan, caption: "Program Jalan Sehat Rutin (2 Minggu Sekali)", tag: "Olahraga" },
  { src: progPendidikan, caption: "Kelas Rumah Belajar", tag: "Pendidikan" },
  { src: progSosial, caption: "Bakti Sosial Warga", tag: "Sosial" },
  { src: heroImg, caption: "Kebersamaan Relawan GEN-CB", tag: "Komunitas" },
];

export const partners = [
  "Pemerintah Desa Sasak Panjang",
  "SDN Sasak Panjang 01",
  "Masjid Jami Al-Ikhlas",
  "Karang Taruna Desa",
  "MTs Nurul Huda",
  "Komunitas Literasi Bogor",
  "PKK Desa",
  "Remaja Masjid",
];

export const testimonials = [
  {
    name: "Ustadz Rahman",
    role: "Pembina Masjid Al-Ikhlas",
    quote:
      "GEN-CB menghidupkan kembali semangat anak muda desa untuk belajar dan berkontribusi nyata.",
  },
  {
    name: "Siti Nurhaliza",
    role: "Orang tua peserta",
    quote:
      "Anak saya jadi lebih percaya diri setelah ikut kelas Rumah Belajar dan lomba MTQ GEN-CB.",
  },
  {
    name: "Dimas Prakoso",
    role: "Relawan pengajar",
    quote: "Organisasinya rapi, programnya jelas, dan dampaknya benar-benar terasa di masyarakat.",
  },
];

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/tentang", label: "Tentang Kami" },
  { to: "/program", label: "Program" },
  { to: "/event", label: "Event" },
  { to: "/berita", label: "Berita" },
  { to: "/galeri", label: "Galeri" },
  { to: "/donasi", label: "Donasi" },
  { to: "/kontak", label: "Kontak" },
] as const;