import progPendidikan from "@/assets/prog-pendidikan.jpg";
import progKeagamaan from "@/assets/prog-keagamaan.jpg";
import progSosial from "@/assets/prog-sosial.jpg";
import progOlahraga from "@/assets/prog-olahraga.jpg";
import heroImg from "@/assets/hero-gencb.jpg";

export type EventStatus = "OPEN" | "SOON" | "ONGOING" | "CLOSED";

export type GencbEvent = {
  slug: string;
  title: string;
  category: string;
  status: EventStatus;
  date: string;
  startAt: string;
  endText?: string;
  location: string;
  address: string;
  mapQuery: string;
  quota: number;
  registered: number;
  image: string;
  fee: number;
  excerpt: string;
  description: string[];
  competitions: { name: string; desc: string; age: string }[];
  requirements: string[];
  rundown: { time: string; title: string; desc: string }[];
  timeline: { date: string; title: string; done: boolean }[];
  committee: { name: string; role: string }[];
  faq: { q: string; a: string }[];
  sponsors: string[];
  documents: { label: string; size: string }[];
  gallery: { src: string; caption: string }[];
};

export const eventCategories = [
  "Semua",
  "Keagamaan",
  "Kepemudaan",
  "Olahraga",
  "Sosial",
  "Pendidikan",
  "Kebangsaan",
] as const;

export const eventStatuses: (EventStatus | "SEMUA")[] = [
  "SEMUA",
  "OPEN",
  "SOON",
  "ONGOING",
  "CLOSED",
];

const baseCommittee = [
  { name: "Ahmad Fauzan", role: "Ketua Pelaksana" },
  { name: "Nabila Rahmawati", role: "Sekretaris" },
  { name: "Rizky Ramadhan", role: "Bendahara" },
  { name: "Dewi Lestari", role: "Koordinator Acara" },
  { name: "Bagas Saputra", role: "Koordinator Lapangan" },
  { name: "Intan Permata", role: "Humas & Dokumentasi" },
];

const baseFaq = [
  {
    q: "Apakah pendaftaran dipungut biaya?",
    a: "Sebagian besar kegiatan GEN-CB gratis. Jika ada biaya kontribusi, nominalnya tertera pada halaman detail kegiatan dan bukti pembayaran wajib diunggah saat mendaftar.",
  },
  {
    q: "Bagaimana cara mengetahui pendaftaran saya diterima?",
    a: "Status verifikasi dapat dipantau kapan saja melalui Dashboard Peserta menggunakan nomor peserta yang Anda terima setelah submit formulir.",
  },
  {
    q: "Dokumen apa saja yang perlu disiapkan?",
    a: "Foto KTP/Kartu Pelajar, Kartu Keluarga, dan pas foto terbaru. Siapkan dalam format JPG/PNG maksimal 2 MB per berkas.",
  },
  {
    q: "Apakah peserta dari luar desa boleh ikut?",
    a: "Boleh, selama memenuhi persyaratan usia dan kategori yang dipilih. Prioritas kuota tetap diberikan kepada warga Desa Sasak Panjang.",
  },
];

export const events: GencbEvent[] = [
  {
    slug: "mtq-desa-sasak-panjang",
    title: "MTQ Desa Sasak Panjang",
    category: "Keagamaan",
    status: "OPEN",
    date: "12 September 2026",
    startAt: "2026-09-12T07:00:00+07:00",
    location: "Masjid Jami Al-Ikhlas, Sasak Panjang",
    address: "Jl. Raya Sasak Panjang No. 12, Tajurhalang, Kab. Bogor",
    mapQuery: "Masjid Jami Al-Ikhlas Sasak Panjang Tajurhalang Bogor",
    quota: 200,
    registered: 120,
    image: progKeagamaan,
    fee: 0,
    excerpt:
      "Musabaqah Tilawatil Qur'an tingkat desa dengan empat cabang lomba untuk anak dan remaja.",
    description: [
      "MTQ Desa Sasak Panjang adalah agenda tahunan GEN-CB bersama Dewan Kemakmuran Masjid dan Pemerintah Desa untuk menumbuhkan kecintaan anak dan remaja terhadap Al-Qur'an.",
      "Tahun ini MTQ membuka empat cabang lomba: Tilawah, Hifdzil Qur'an, Murottal, dan Adzan. Seluruh peserta akan mendapatkan sertifikat, dan para juara berhak atas piala bergilir serta uang pembinaan.",
      "Penjurian dilakukan oleh dewan hakim bersertifikat dari LPTQ Kabupaten Bogor dengan sistem penilaian terbuka yang diumumkan pada hari yang sama.",
    ],
    competitions: [
      { name: "Tilawah", desc: "Seni membaca Al-Qur'an dengan maqra' yang ditentukan panitia.", age: "10–17 tahun" },
      { name: "Hifdzil Qur'an", desc: "Hafalan Juz 30 dengan tiga pertanyaan sambung ayat.", age: "8–15 tahun" },
      { name: "Murottal", desc: "Bacaan tartil dengan penekanan pada kaidah tajwid.", age: "8–15 tahun" },
      { name: "Adzan", desc: "Adzan Maghrib lengkap dengan doa sesudah adzan.", age: "10–17 tahun" },
    ],
    requirements: [
      "Warga Desa Sasak Panjang atau sekitarnya",
      "Usia sesuai kategori lomba yang dipilih",
      "Melampirkan fotokopi KTP/Kartu Pelajar dan Kartu Keluarga",
      "Pas foto terbaru berwarna",
      "Hadir saat technical meeting H-3",
    ],
    rundown: [
      { time: "07.00", title: "Registrasi ulang peserta", desc: "Pengambilan nomor undi dan ID card." },
      { time: "08.00", title: "Pembukaan", desc: "Sambutan Kepala Desa dan Ketua GEN-CB." },
      { time: "09.00", title: "Babak penyisihan", desc: "Cabang Tilawah dan Murottal." },
      { time: "12.30", title: "Ishoma", desc: "Istirahat, sholat, dan makan siang." },
      { time: "13.30", title: "Babak penyisihan lanjutan", desc: "Cabang Hifdzil Qur'an dan Adzan." },
      { time: "16.00", title: "Final & pengumuman", desc: "Penyerahan piala dan uang pembinaan." },
    ],
    timeline: [
      { date: "01 Agu 2026", title: "Pendaftaran dibuka", done: true },
      { date: "25 Agu 2026", title: "Rapat panitia & dewan hakim", done: true },
      { date: "05 Sep 2026", title: "Pendaftaran ditutup", done: false },
      { date: "09 Sep 2026", title: "Technical meeting peserta", done: false },
      { date: "12 Sep 2026", title: "Hari pelaksanaan", done: false },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["Pemerintah Desa Sasak Panjang", "DKM Al-Ikhlas", "Karang Taruna Desa", "Komunitas Literasi Bogor"],
    documents: [
      { label: "Proposal Kegiatan MTQ 2026", size: "PDF · 1.2 MB" },
      { label: "Guidebook Peserta & Kriteria Penilaian", size: "PDF · 860 KB" },
    ],
    gallery: [
      { src: progKeagamaan, caption: "MTQ tahun sebelumnya" },
      { src: heroImg, caption: "Panitia dan relawan" },
      { src: progPendidikan, caption: "Pembinaan peserta" },
    ],
  },
  {
    slug: "seminar-pemuda-berdaya",
    title: "Seminar Pemuda Berdaya",
    category: "Kepemudaan",
    status: "SOON",
    date: "3 Oktober 2026",
    startAt: "2026-10-03T08:30:00+07:00",
    location: "Aula Desa Sasak Panjang",
    address: "Kantor Desa Sasak Panjang, Tajurhalang, Kab. Bogor",
    mapQuery: "Kantor Desa Sasak Panjang Tajurhalang Bogor",
    quota: 150,
    registered: 0,
    image: progPendidikan,
    fee: 25000,
    excerpt: "Seminar kepemudaan tentang karier, wirausaha desa, dan literasi digital.",
    description: [
      "Seminar Pemuda Berdaya menghadirkan praktisi wirausaha desa, alumni penerima beasiswa, dan pegiat literasi digital untuk berbagi jalur nyata membangun karier dari desa.",
      "Peserta akan mengikuti sesi pleno dan kelas paralel dengan mentoring kelompok kecil, ditutup dengan penyusunan rencana aksi 90 hari.",
    ],
    competitions: [
      { name: "Kelas Karier", desc: "Menyusun CV dan strategi melamar kerja.", age: "17–25 tahun" },
      { name: "Kelas Wirausaha", desc: "Validasi ide usaha dan perhitungan modal.", age: "17–30 tahun" },
      { name: "Kelas Digital", desc: "Konten, branding, dan penjualan online.", age: "15–25 tahun" },
    ],
    requirements: [
      "Pemuda usia 15–30 tahun",
      "Membawa perangkat (HP/laptop) untuk sesi praktik",
      "Kontribusi peserta Rp 25.000 termasuk konsumsi dan modul",
    ],
    rundown: [
      { time: "08.30", title: "Registrasi", desc: "Pembagian modul dan snack." },
      { time: "09.00", title: "Sesi pleno", desc: "Membangun karier dari desa." },
      { time: "11.00", title: "Kelas paralel", desc: "Karier, wirausaha, dan digital." },
      { time: "13.30", title: "Mentoring kelompok", desc: "Rencana aksi 90 hari." },
      { time: "15.30", title: "Penutupan", desc: "Sertifikat dan foto bersama." },
    ],
    timeline: [
      { date: "01 Sep 2026", title: "Persiapan & kurasi pembicara", done: true },
      { date: "10 Sep 2026", title: "Pendaftaran dibuka", done: false },
      { date: "28 Sep 2026", title: "Pendaftaran ditutup", done: false },
      { date: "03 Okt 2026", title: "Hari pelaksanaan", done: false },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["Pemerintah Desa Sasak Panjang", "Komunitas Literasi Bogor", "PKK Desa"],
    documents: [
      { label: "Proposal Seminar Pemuda Berdaya", size: "PDF · 980 KB" },
      { label: "Guidebook Peserta", size: "PDF · 640 KB" },
    ],
    gallery: [{ src: progPendidikan, caption: "Kelas literasi digital" }],
  },
  {
    slug: "turnamen-tenis-meja",
    title: "Turnamen Tenis Meja GEN-CB",
    category: "Olahraga",
    status: "ONGOING",
    date: "1–5 Agustus 2026",
    startAt: "2026-08-01T15:00:00+07:00",
    location: "Lapangan Serbaguna RW 04",
    address: "Lapangan Serbaguna RW 04, Sasak Panjang, Tajurhalang",
    mapQuery: "Lapangan Serbaguna RW 04 Sasak Panjang Tajurhalang",
    quota: 64,
    registered: 64,
    image: progOlahraga,
    fee: 50000,
    excerpt: "Turnamen tenis meja antar-RW dengan sistem gugur dan kelas tunggal serta ganda.",
    description: [
      "Turnamen tenis meja GEN-CB mempertemukan atlet kampung dari 12 RW dalam kelas tunggal putra, tunggal putri, dan ganda campuran.",
      "Pertandingan digelar setiap sore dengan sistem gugur, disiarkan langsung melalui kanal media sosial GEN-CB.",
    ],
    competitions: [
      { name: "Tunggal Putra", desc: "Sistem gugur, best of 5 game.", age: "15 tahun ke atas" },
      { name: "Tunggal Putri", desc: "Sistem gugur, best of 3 game.", age: "15 tahun ke atas" },
      { name: "Ganda Campuran", desc: "Pasangan bebas dari RW yang sama.", age: "17 tahun ke atas" },
    ],
    requirements: [
      "Warga Desa Sasak Panjang dibuktikan dengan KTP/KK",
      "Membawa bet pribadi",
      "Kontribusi peserta Rp 50.000 per nomor pertandingan",
    ],
    rundown: [
      { time: "15.00", title: "Pemanasan & pengecekan", desc: "Pengundian bagan harian." },
      { time: "15.30", title: "Babak pertandingan", desc: "Sesi sore hingga menjelang maghrib." },
      { time: "19.30", title: "Sesi malam", desc: "Pertandingan lanjutan di bawah lampu." },
    ],
    timeline: [
      { date: "10 Jul 2026", title: "Pendaftaran dibuka", done: true },
      { date: "28 Jul 2026", title: "Pendaftaran ditutup", done: true },
      { date: "01 Agu 2026", title: "Turnamen dimulai", done: true },
      { date: "05 Agu 2026", title: "Partai final", done: false },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["Karang Taruna Desa", "Pemerintah Desa Sasak Panjang"],
    documents: [{ label: "Regulasi Turnamen", size: "PDF · 420 KB" }],
    gallery: [
      { src: progOlahraga, caption: "Babak penyisihan" },
      { src: heroImg, caption: "Suporter warga" },
    ],
  },
  {
    slug: "peringatan-17-agustus",
    title: "Festival Kemerdekaan 17 Agustus",
    category: "Kebangsaan",
    status: "OPEN",
    date: "17 Agustus 2026",
    startAt: "2026-08-17T06:30:00+07:00",
    location: "Lapangan Desa Sasak Panjang",
    address: "Lapangan Desa Sasak Panjang, Tajurhalang, Kab. Bogor",
    mapQuery: "Lapangan Desa Sasak Panjang Tajurhalang Bogor",
    quota: 400,
    registered: 238,
    image: heroImg,
    fee: 0,
    excerpt: "Upacara, karnaval, dan lomba rakyat memperingati HUT Kemerdekaan RI.",
    description: [
      "Festival Kemerdekaan menghadirkan upacara bendera, karnaval budaya antar-RW, dan belasan lomba rakyat untuk semua usia.",
      "GEN-CB berperan sebagai koordinator lomba anak dan remaja serta dokumentasi kegiatan desa.",
    ],
    competitions: [
      { name: "Lomba Anak", desc: "Balap karung, kelereng, dan makan kerupuk.", age: "6–12 tahun" },
      { name: "Karnaval RW", desc: "Parade kostum budaya per RW.", age: "Semua usia" },
      { name: "Panjat Pinang", desc: "Regu 5 orang per RW.", age: "17 tahun ke atas" },
    ],
    requirements: ["Warga Desa Sasak Panjang", "Didaftarkan melalui koordinator RW", "Hadir 30 menit sebelum lomba"],
    rundown: [
      { time: "06.30", title: "Upacara bendera", desc: "Petugas dari pelajar desa." },
      { time: "08.00", title: "Karnaval budaya", desc: "Rute keliling desa." },
      { time: "10.00", title: "Lomba rakyat", desc: "Seluruh kategori lomba." },
      { time: "15.00", title: "Panjat pinang & penutupan", desc: "Pengumuman juara umum." },
    ],
    timeline: [
      { date: "20 Jul 2026", title: "Rapat koordinasi RW", done: true },
      { date: "01 Agu 2026", title: "Pendaftaran dibuka", done: true },
      { date: "14 Agu 2026", title: "Pendaftaran ditutup", done: false },
      { date: "17 Agu 2026", title: "Hari pelaksanaan", done: false },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["Pemerintah Desa Sasak Panjang", "PKK Desa", "Karang Taruna Desa"],
    documents: [{ label: "Panduan Lomba Rakyat", size: "PDF · 560 KB" }],
    gallery: [{ src: heroImg, caption: "Karnaval tahun lalu" }],
  },
  {
    slug: "pelatihan-literasi-digital",
    title: "Pelatihan Literasi Digital Muda",
    category: "Pendidikan",
    status: "OPEN",
    date: "20 September 2026",
    startAt: "2026-09-20T09:00:00+07:00",
    location: "Rumah Belajar GEN-CB",
    address: "Sekretariat GEN-CB, Sasak Panjang, Tajurhalang",
    mapQuery: "Sasak Panjang Tajurhalang Bogor",
    quota: 40,
    registered: 17,
    image: progPendidikan,
    fee: 0,
    excerpt: "Pelatihan komputer dasar, desain grafis, dan keamanan digital untuk pemuda desa.",
    description: [
      "Kelas intensif satu hari yang membekali pemuda desa dengan keterampilan komputer dasar, desain grafis, serta kesadaran keamanan digital.",
      "Peserta terbaik akan diajak bergabung menjadi tim media GEN-CB.",
    ],
    competitions: [
      { name: "Kelas Dasar", desc: "Pengolah kata, spreadsheet, dan email.", age: "13–20 tahun" },
      { name: "Kelas Desain", desc: "Desain poster kegiatan dengan tools gratis.", age: "15–25 tahun" },
    ],
    requirements: ["Usia 13–25 tahun", "Membawa laptop bila ada", "Berkomitmen mengikuti kelas penuh"],
    rundown: [
      { time: "09.00", title: "Pembukaan", desc: "Perkenalan dan pre-test." },
      { time: "09.30", title: "Sesi materi", desc: "Praktik langsung per kelas." },
      { time: "13.00", title: "Studi kasus", desc: "Membuat poster kegiatan desa." },
      { time: "15.30", title: "Penutupan", desc: "Evaluasi dan sertifikat." },
    ],
    timeline: [
      { date: "15 Agu 2026", title: "Pendaftaran dibuka", done: true },
      { date: "15 Sep 2026", title: "Pendaftaran ditutup", done: false },
      { date: "20 Sep 2026", title: "Hari pelaksanaan", done: false },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["Komunitas Literasi Bogor", "SDN Sasak Panjang 01"],
    documents: [{ label: "Silabus Pelatihan", size: "PDF · 320 KB" }],
    gallery: [{ src: progPendidikan, caption: "Kelas komputer" }],
  },
  {
    slug: "jalan-santai-keluarga",
    title: "Jalan Santai Keluarga GEN-CB",
    category: "Olahraga",
    status: "SOON",
    date: "8 November 2026",
    startAt: "2026-11-08T06:00:00+07:00",
    location: "Start & Finish Lapangan Desa",
    address: "Lapangan Desa Sasak Panjang, Tajurhalang",
    mapQuery: "Lapangan Desa Sasak Panjang Tajurhalang",
    quota: 500,
    registered: 0,
    image: progOlahraga,
    fee: 15000,
    excerpt: "Jalan santai 5 km bersama keluarga dengan doorprize dan bazar UMKM desa.",
    description: [
      "Jalan santai keluarga sejauh 5 km mengelilingi desa, dimeriahkan bazar UMKM, senam bersama, dan pembagian doorprize utama.",
      "Seluruh kontribusi peserta disalurkan untuk operasional Rumah Belajar GEN-CB.",
    ],
    competitions: [
      { name: "Kategori Umum", desc: "Rute 5 km untuk semua peserta.", age: "Semua usia" },
      { name: "Kategori Keluarga", desc: "Minimal 3 anggota keluarga.", age: "Semua usia" },
    ],
    requirements: ["Kontribusi Rp 15.000 termasuk kaos dan kupon doorprize", "Anak di bawah 10 tahun didampingi orang tua"],
    rundown: [
      { time: "06.00", title: "Senam bersama", desc: "Pemanasan di lapangan desa." },
      { time: "06.30", title: "Flag off", desc: "Pelepasan peserta oleh Kepala Desa." },
      { time: "08.00", title: "Bazar & hiburan", desc: "UMKM desa dan panggung musik." },
      { time: "09.30", title: "Doorprize", desc: "Pengundian hadiah utama." },
    ],
    timeline: [
      { date: "01 Okt 2026", title: "Persiapan rute", done: false },
      { date: "10 Okt 2026", title: "Pendaftaran dibuka", done: false },
      { date: "08 Nov 2026", title: "Hari pelaksanaan", done: false },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["PKK Desa", "Karang Taruna Desa", "Pemerintah Desa Sasak Panjang"],
    documents: [{ label: "Peta Rute 5K", size: "PDF · 280 KB" }],
    gallery: [{ src: progOlahraga, caption: "Jalan santai edisi sebelumnya" }],
  },
  {
    slug: "bakti-sosial-ramadan",
    title: "Bakti Sosial & Santunan Ramadan",
    category: "Sosial",
    status: "CLOSED",
    date: "18 Maret 2026",
    startAt: "2026-03-18T15:00:00+07:00",
    location: "Balai Warga Sasak Panjang",
    address: "Balai Warga RW 02, Sasak Panjang, Tajurhalang",
    mapQuery: "Balai Warga Sasak Panjang Tajurhalang",
    quota: 100,
    registered: 100,
    image: progSosial,
    fee: 0,
    excerpt: "Santunan anak yatim dan pembagian paket sembako untuk warga prasejahtera.",
    description: [
      "Kegiatan santunan tahunan bagi 100 anak yatim dan dhuafa Desa Sasak Panjang, dilanjutkan buka puasa bersama warga.",
      "Kegiatan ini telah selesai dilaksanakan. Dokumentasi dan laporan penggunaan dana tersedia untuk diunduh.",
    ],
    competitions: [],
    requirements: ["Terdaftar melalui pengurus RT/RW", "Membawa kartu keluarga saat pengambilan santunan"],
    rundown: [
      { time: "15.00", title: "Registrasi penerima", desc: "Verifikasi data oleh panitia." },
      { time: "16.00", title: "Tausiyah", desc: "Ceramah singkat menjelang berbuka." },
      { time: "17.30", title: "Penyerahan santunan", desc: "Santunan dan paket sembako." },
      { time: "18.00", title: "Buka puasa bersama", desc: "Bersama warga dan relawan." },
    ],
    timeline: [
      { date: "20 Feb 2026", title: "Pendataan penerima", done: true },
      { date: "10 Mar 2026", title: "Pendaftaran ditutup", done: true },
      { date: "18 Mar 2026", title: "Pelaksanaan", done: true },
      { date: "25 Mar 2026", title: "Laporan pertanggungjawaban", done: true },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["DKM Al-Ikhlas", "PKK Desa", "Remaja Masjid"],
    documents: [{ label: "Laporan Pertanggungjawaban", size: "PDF · 1.1 MB" }],
    gallery: [
      { src: progSosial, caption: "Penyerahan santunan" },
      { src: heroImg, caption: "Buka puasa bersama" },
    ],
  },
  {
    slug: "festival-anak-sholeh",
    title: "Festival Anak Sholeh",
    category: "Keagamaan",
    status: "SOON",
    date: "12 Desember 2026",
    startAt: "2026-12-12T08:00:00+07:00",
    location: "Halaman Masjid Jami Al-Ikhlas",
    address: "Jl. Raya Sasak Panjang No. 12, Tajurhalang",
    mapQuery: "Masjid Jami Al-Ikhlas Sasak Panjang",
    quota: 120,
    registered: 0,
    image: progKeagamaan,
    fee: 0,
    excerpt: "Lomba adzan, hafalan surat pendek, dan cerdas cermat islami untuk anak-anak TPA.",
    description: [
      "Festival Anak Sholeh menjadi ajang unjuk kemampuan santri TPA se-desa dalam suasana gembira dan mendidik.",
      "Setiap peserta memperoleh bingkisan dan sertifikat keikutsertaan.",
    ],
    competitions: [
      { name: "Hafalan Surat Pendek", desc: "Juz 30 pilihan panitia.", age: "6–10 tahun" },
      { name: "Adzan Cilik", desc: "Adzan Maghrib.", age: "7–12 tahun" },
      { name: "Cerdas Cermat Islami", desc: "Regu 3 anak per TPA.", age: "8–12 tahun" },
    ],
    requirements: ["Santri TPA aktif", "Didaftarkan oleh ustadz/ustadzah pembimbing", "Melampirkan kartu keluarga"],
    rundown: [
      { time: "08.00", title: "Registrasi", desc: "Pengambilan nomor peserta." },
      { time: "08.30", title: "Pembukaan", desc: "Pembacaan ayat suci dan sambutan." },
      { time: "09.00", title: "Perlombaan", desc: "Seluruh cabang berjalan paralel." },
      { time: "14.00", title: "Pengumuman juara", desc: "Penyerahan hadiah dan bingkisan." },
    ],
    timeline: [
      { date: "01 Nov 2026", title: "Koordinasi TPA", done: false },
      { date: "10 Nov 2026", title: "Pendaftaran dibuka", done: false },
      { date: "12 Des 2026", title: "Hari pelaksanaan", done: false },
    ],
    committee: baseCommittee,
    faq: baseFaq,
    sponsors: ["DKM Al-Ikhlas", "Remaja Masjid", "MTs Nurul Huda"],
    documents: [{ label: "Juknis Festival Anak Sholeh", size: "PDF · 480 KB" }],
    gallery: [{ src: progKeagamaan, caption: "Lomba tahun lalu" }],
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function isRegistrationOpen(status: EventStatus) {
  return status === "OPEN";
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
}