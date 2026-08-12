# GEN-CB: dari demo ke sistem operasional

Tujuan: seluruh fitur benar-benar terhubung database, dikelola satu Super Admin, tanpa data dummy.

Karena cakupannya sangat besar, pekerjaan dibagi jadi 5 tahap. Setiap tahap selesai dan bisa dipakai sebelum lanjut.

## Tahap 1 — Fondasi: auth asli + hapus demo (mulai sekarang)
- Akun Super Admin tunggal `yayasangencb@gmail.com` dibuat lewat sistem autentikasi backend (password ter-hash, tidak pernah muncul di kode/frontend). Semua akun demo & daftar akun contoh di halaman login dihapus.
- `/admin` diproteksi di backend (bukan hanya cek di browser): belum login -> `/admin/login`, sudah login -> dashboard. Semua tabel admin diberi aturan akses: publik hanya baca konten terbit + kirim pendaftaran/pesan/donasi.
- Hapus penyimpanan admin berbasis localStorage & seluruh file data dummy (statistik palsu, testimoni palsu, kontak `+62 812-0000-0000`, "coming soon", tombol simulasi).
- Statistik homepage & dashboard diambil dari database; kalau 0 ya tampil 0 / section disembunyikan.

## Tahap 2 — Media & konten CMS
- Bucket storage terstruktur (events, news, gallery, programs, organization, sponsors, documents, general). Dokumen peserta tetap privat + signed URL; gambar publik.
- Uploader drag-and-drop dengan multi-file, progress, preview, ganti/hapus, crop rasio (1:1, 16:9, 4:5), validasi tipe & ukuran. Dipakai di semua input gambar.
- Media Library: telusuri & pilih ulang gambar yang sudah diunggah.
- Modul berita (rich text, slug otomatis unik, draft/published/archived, SEO), galeri album multi-upload, program, pengurus, sponsor — semuanya CRUD ke database.

## Tahap 3 — Event & pendaftaran nyata
- Modul event lengkap (draft/akan datang/buka/tutup/berlangsung/selesai/batal, status otomatis dari tanggal + override admin, kuota anti-race, duplicate, arsip).
- Seed hanya kegiatan nyata: MTQ Desa Sasak Panjang 2026, Turnamen Tenis Meja HUT RI Ke-81, Jalan Santai HUT RI Ke-81. Jumlah peserta mulai dari 0.
- Form Builder per event (14 jenis field, urutan drag-and-drop, validasi, wajib/opsional).
- Nomor registrasi otomatis unik `GENCB-MTQ-2026-001`. Anti-duplikat berdasarkan WhatsApp/email.
- Manajemen peserta: verifikasi, approve/reject, bulk, filter, cari, export Excel/CSV/PDF.
- Halaman publik `/cek-pendaftaran` (nomor registrasi atau WhatsApp), tanpa data sensitif.

## Tahap 4 — Operasional website
- Website Content CMS: hero, tentang, statistik, kontak & sosial media — frontend menyembunyikan section yang kosong.
- Inbox pesan (baru/dibaca/dibalas/arsip + badge belum dibaca), donasi (campaign + konfirmasi transfer manual), testimonial CMS (section tersembunyi bila kosong).
- Audit log, backup/export data, pengaturan + danger zone berkonfirmasi, profil admin (ubah nama & password).

## Tahap 5 — Kualitas & rilis
- Soft delete + trash (berita, event, peserta), pagination di semua daftar panjang, skeleton/empty/error state, halaman 404 GEN-CB.
- Waktu Asia/Jakarta ("15 Agustus 2026", "06.00 WIB"), SEO per halaman + sitemap, share WhatsApp/Facebook/salin tautan.
- Responsif desktop→ponsel (tabel admin scroll/kartu), lazy loading, autosave draft & peringatan keluar form.
- Uji seluruh alur end-to-end, bersihkan data testing.

## Catatan teknis
- Desain, palet, dan komponen yang sudah ada dipertahankan.
- Semua data pindah dari localStorage ke database; operasi admin lewat server function dengan pengecekan peran di server.
