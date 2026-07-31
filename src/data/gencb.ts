import heroImg from "@/assets/hero-gencb.jpg";
import progPendidikan from "@/assets/prog-pendidikan.jpg";
import progKeagamaan from "@/assets/prog-keagamaan.jpg";
import progSosial from "@/assets/prog-sosial.jpg";
import progOlahraga from "@/assets/prog-olahraga.jpg";

export const images = { heroImg, progPendidikan, progKeagamaan, progSosial, progOlahraga };

export const ORG = {
  name: "Generasi Cerdas Beraksi",
  short: "GEN-CB",
  tagline: "Membangun Generasi Cerdas, Berkarakter, dan Berdampak untuk Indonesia.",
  email: "halo@gencb.or.id",
  phone: "+62 812-0000-0000",
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
    image: progKeagamaan,
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
    title: "GEN-CB Sport Community",
    category: "Olahraga",
    description:
      "Turnamen tenis meja, jalan santai, dan liga kampung untuk menghidupkan semangat sportivitas.",
    target: "Pemuda & Warga",
    image: progOlahraga,
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

export type EventStatus = "OPEN" | "SOON" | "ONGOING" | "CLOSED";

export const events: {
  slug: string;
  title: string;
  category: string;
  status: EventStatus;
  date: string;
  location: string;
  quota: number;
  registered: number;
  image: string;
}[] = [
  {
    slug: "mtq-desa-sasak-panjang",
    title: "MTQ Desa Sasak Panjang",
    category: "Keagamaan",
    status: "OPEN",
    date: "12 September 2026",
    location: "Masjid Jami Al-Ikhlas, Sasak Panjang",
    quota: 200,
    registered: 120,
    image: progKeagamaan,
  },
  {
    slug: "seminar-pemuda-berdaya",
    title: "Seminar Pemuda Berdaya",
    category: "Kepemudaan",
    status: "SOON",
    date: "3 Oktober 2026",
    location: "Aula Desa Sasak Panjang",
    quota: 150,
    registered: 0,
    image: progPendidikan,
  },
  {
    slug: "turnamen-tenis-meja",
    title: "Turnamen Tenis Meja GEN-CB",
    category: "Olahraga",
    status: "ONGOING",
    date: "1–5 Agustus 2026",
    location: "Lapangan Serbaguna RW 04",
    quota: 64,
    registered: 64,
    image: progOlahraga,
  },
  {
    slug: "bakti-sosial-ramadan",
    title: "Bakti Sosial Ramadan",
    category: "Sosial",
    status: "CLOSED",
    date: "18 Maret 2026",
    location: "Balai Warga Sasak Panjang",
    quota: 100,
    registered: 100,
    image: progSosial,
  },
];

export const news = [
  {
    slug: "gencb-buka-pendaftaran-mtq",
    title: "GEN-CB Resmi Membuka Pendaftaran MTQ Tingkat Desa",
    category: "Keagamaan",
    date: "24 Juli 2026",
    excerpt:
      "Empat cabang lomba dibuka: Tilawah, Hifdzil Qur'an, Murottal, dan Adzan, terbuka untuk anak dan remaja.",
    image: progKeagamaan,
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
  { src: progKeagamaan, caption: "MTQ Desa Sasak Panjang", tag: "Keagamaan" },
  { src: progPendidikan, caption: "Kelas Rumah Belajar", tag: "Pendidikan" },
  { src: progSosial, caption: "Bakti Sosial Warga", tag: "Sosial" },
  { src: progOlahraga, caption: "Turnamen Tenis Meja", tag: "Olahraga" },
  { src: heroImg, caption: "Kebersamaan Relawan GEN-CB", tag: "Komunitas" },
  { src: progPendidikan, caption: "Pelatihan Literasi Digital", tag: "Teknologi" },
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