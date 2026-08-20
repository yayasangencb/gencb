import heroImg from "@/assets/hero-gencb.jpg";
import progPendidikan from "@/assets/prog-pendidikan.jpg";
import progKeagamaan from "@/assets/prog-keagamaan.jpg";
import progSosial from "@/assets/prog-sosial.jpg";
import progOlahraga from "@/assets/prog-olahraga.jpg";
import mtqBanner from "@/assets/mtq-banner.jpg";
import tenisMeja from "@/assets/tenis-meja.jpg";
import programJalan from "@/assets/program-jalan.jpg";

export const images = { heroImg, progPendidikan, progKeagamaan, progSosial, progOlahraga, mtqBanner, tenisMeja, programJalan };

export function resolvePublicImage(src?: string | null, category?: string, fallback?: string): string {
  if (src && typeof src === "string" && src.trim() !== "") {
    const trimmed = src.trim();
    if (trimmed.startsWith("data:") || trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
    if (images[trimmed as keyof typeof images]) {
      return images[trimmed as keyof typeof images];
    }
    const s = trimmed.toLowerCase();
    if (s === "mtq-banner.jpg" || s.includes("mtq")) return mtqBanner;
    if (s === "tenis-meja.jpg" || s.includes("tenis") || s.includes("meja")) return tenisMeja;
    if (s === "program-jalan.jpg" || s.includes("jalan")) return programJalan;
    if (s === "prog-keagamaan.jpg" || s === "prog-keagamaan") return progKeagamaan;
    if (s === "prog-pendidikan.jpg" || s === "prog-pendidikan") return progPendidikan;
    if (s === "prog-sosial.jpg" || s === "prog-sosial") return progSosial;
    if (s === "prog-olahraga.jpg" || s === "prog-olahraga") return progOlahraga;
    if (s === "hero-gencb.jpg" || s === "hero") return heroImg;
    return trimmed;
  }

  if (category) {
    const c = category.toLowerCase();
    if (c.includes("keagamaan") || c.includes("agama")) return progKeagamaan;
    if (c.includes("pendidikan") || c.includes("belajar")) return progPendidikan;
    if (c.includes("sosial") || c.includes("baksos")) return progSosial;
    if (c.includes("olahraga") || c.includes("sport")) return progOlahraga;
  }

  return fallback || heroImg;
}

export const getDummyImage = resolvePublicImage;

export const ORG = {
  name: "Generasi Cerdas Beraksi",
  short: "GEN-CB",
  tagline: "Membangun Generasi Cerdas, Berkarakter, dan Berdampak untuk Indonesia.",
  email: "yayasangencb@gmail.com",
  phone: "+62 857-7220-2454",
  address: "Sekretariat GEN-CB, Desa Sasak Panjang, Kec. Tajurhalang, Kab. Bogor, Jawa Barat",
};

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/program", label: "Program" },
  { href: "/event", label: "Event & Kegiatan" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/donasi", label: "Donasi" },
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
];

export const stats = [
  { label: "Program Terlaksana", value: 48, suffix: "+" },
  { label: "Peserta Terlibat", value: 3200, suffix: "+" },
  { label: "Kegiatan per Tahun", value: 26, suffix: "" },
  { label: "Mitra & Sponsor", value: 34, suffix: "+" },
];

export type EventStatus = "OPEN" | "SOON" | "ONGOING" | "CLOSED";

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
    description: "Bimbingan belajar gratis dan kelas literasi untuk anak-anak Desa Sasak Panjang.",
    target: "300+ Siswa",
    image: progPendidikan,
  },
  {
    slug: "mtq-kajian",
    title: "MTQ & Kajian Remaja",
    category: "Keagamaan",
    description: "Pembinaan tahfidz, seni baca Al-Qur'an, dan kajian keislaman pemuda.",
    target: "150+ Peserta",
    image: mtqBanner,
  },
  {
    slug: "program-jalan-sehat",
    title: "Program Jalan Sehat (2 Mingguan)",
    category: "Olahraga",
    description: "Program jalan santai rutin 2 minggu sekali untuk menjaga kebugaran warga desa.",
    target: "200+ Warga",
    image: programJalan,
  },
  {
    slug: "baksos-santunan",
    title: "Bakti Sosial & Santunan",
    category: "Sosial",
    description: "Penyaluran sembako, santunan yatim, dan bantuan tanggap bencana.",
    target: "500+ Penerima",
    image: progSosial,
  },
  {
    slug: "sport-community",
    title: "GEN-CB Sport Community & Tenis Meja",
    category: "Olahraga",
    description: "Wadah kegiatan olahraga pemuda mencakup turnamen tenis meja dan liga kampung.",
    target: "120+ Atlet",
    image: tenisMeja,
  },
  {
    slug: "aksi-hijau",
    title: "Aksi Desa Hijau",
    category: "Lingkungan",
    description: "Bank sampah, penanaman pohon, dan edukasi daur ulang berbasis warga.",
    target: "10 RT Terlibat",
    image: progOlahraga,
  },
];

export const news = [
  {
    slug: "pendaftaran-mtq-2026",
    title: "GEN-CB Resmi Membuka Pendaftaran MTQ Tingkat Desa",
    category: "Keagamaan",
    date: "24 Juli 2026",
    excerpt: "Empat cabang lomba dibuka untuk anak dan remaja Desa Sasak Panjang.",
    image: mtqBanner,
  },
  {
    slug: "rumah-belajar-300-siswa",
    title: "Rumah Belajar GEN-CB Tembus 300 Siswa Aktif",
    category: "Pendidikan",
    date: "12 Juli 2026",
    excerpt: "Program bimbingan belajar gratis GEN-CB terus bertumbuh berkat relawan pengajar.",
    image: progPendidikan,
  },
  {
    slug: "aksi-bersih-desa",
    title: "Aksi Bersih Desa Libatkan 120 Relawan Muda",
    category: "Sosial",
    date: "30 Juni 2026",
    excerpt: "Kolaborasi karang taruna dan pemerintah desa membuka titik bank sampah baru.",
    image: progSosial,
  },
];

export const gallery = [
  { src: mtqBanner, caption: "Pelaksanaan MTQ Desa Sasak Panjang" },
  { src: tenisMeja, caption: "Turnamen Tenis Meja GEN-CB Sport Community" },
  { src: programJalan, caption: "Program Jalan Sehat Rutin 2 Mingguan Warga" },
  { src: progPendidikan, caption: "Suasana Belajar Bersama di Rumah Belajar GEN-CB" },
  { src: progSosial, caption: "Penyaluran Paket Sembako & Santunan Yatim" },
  { src: heroImg, caption: "Foto Bersama Relawan dan Pengurus Yayasan GEN-CB" },
];

export const partners = [
  "Pemerintah Desa Sasak Panjang",
  "DKM Masjid Jami Al-Ikhlas",
  "Karang Taruna Tunas Mekar",
  "Komunitas Literasi Bogor",
  "Puskesmas Tajurhalang",
  "MTs Nurul Huda",
];

export const testimonials = [
  {
    name: "Ibu Maryam",
    role: "Orang Tua Siswa Rumah Belajar",
    quote:
      "Anak saya jadi makin semangat belajar sejak ikut Rumah Belajar GEN-CB. Pengajarnya sabar dan ramah.",
  },
  {
    name: "Ahmad Fauzi",
    role: "Peserta MTQ 2025",
    quote:
      "Kegiatan MTQ desa ini bikin pemuda makin dekat dengan masjid. Harapannya bisa rutin tiap tahun.",
  },
  {
    name: "Bapak Suhendra",
    role: "Tokoh Masyarakat",
    quote:
      "GEN-CB membuktikan kalau pemuda desa punya kapasitas besar untuk menggerakkan perubahan nyata.",
  },
];