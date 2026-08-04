insert into public.programs (title, category, description, target_text, is_published) values
('Rumah Belajar Generasi','Pendidikan','Bimbingan belajar gratis, kelas literasi, dan pendampingan akademik untuk anak-anak desa.','Pelajar SD–SMA',true),
('MTQ & Kajian Remaja','Keagamaan','Musabaqah Tilawatil Qur''an, kelas tahfidz, dan kajian rutin yang membentuk karakter religius.','Anak & Remaja',true),
('Bakti Sosial & Santunan','Sosial','Santunan anak yatim, paket sembako, dan aksi tanggap bantuan bagi warga yang membutuhkan.','Masyarakat Umum',true),
('GEN-CB Sport Community','Olahraga','Turnamen tenis meja, jalan santai, dan liga kampung untuk menghidupkan semangat sportivitas.','Pemuda & Warga',true),
('Aksi Desa Hijau','Lingkungan','Kerja bakti, penanaman pohon, bank sampah, dan edukasi pengelolaan lingkungan berkelanjutan.','Warga & Relawan',true),
('Kelas Digital Muda','Teknologi','Pelatihan komputer, desain, dan literasi digital agar pemuda desa siap bersaing di era digital.','Pemuda 15–25 tahun',true);

insert into public.events (slug, title, category, description, location_text, quota, registered_count, registration_end, event_date_start, status, price) values
('mtq-desa-sasak-panjang','MTQ Desa Sasak Panjang','Keagamaan','Musabaqah Tilawatil Qur''an tingkat desa dengan empat cabang lomba untuk anak dan remaja.','Masjid Jami Al-Ikhlas, Sasak Panjang',200,0,'2026-09-05T23:59:00+07','2026-09-12T07:00:00+07','open',0),
('seminar-pemuda-berdaya','Seminar Pemuda Berdaya','Kepemudaan','Seminar kepemudaan tentang karier, wirausaha desa, dan literasi digital.','Aula Desa Sasak Panjang',150,0,'2026-09-28T23:59:00+07','2026-10-03T08:30:00+07','soon',25000),
('turnamen-tenis-meja','Turnamen Tenis Meja GEN-CB','Olahraga','Turnamen tenis meja antar-RW dengan sistem gugur dan kelas tunggal serta ganda.','Lapangan Serbaguna RW 04',64,0,'2026-07-25T23:59:00+07','2026-08-01T15:00:00+07','ongoing',50000),
('peringatan-17-agustus','Festival Kemerdekaan 17 Agustus','Kebangsaan','Upacara, karnaval, dan lomba rakyat memperingati HUT Kemerdekaan RI.','Lapangan Desa Sasak Panjang',400,0,'2026-08-12T23:59:00+07','2026-08-17T06:30:00+07','open',0),
('pelatihan-literasi-digital','Pelatihan Literasi Digital Muda','Pendidikan','Pelatihan komputer dasar, desain grafis, dan keamanan digital untuk pemuda desa.','Rumah Belajar GEN-CB',40,0,'2026-09-15T23:59:00+07','2026-09-20T09:00:00+07','open',0),
('jalan-santai-keluarga','Jalan Santai Keluarga GEN-CB','Olahraga','Jalan santai 5 km bersama keluarga dengan doorprize dan bazar UMKM desa.','Start & Finish Lapangan Desa',500,0,'2026-11-01T23:59:00+07','2026-11-08T06:00:00+07','soon',15000),
('bakti-sosial-ramadan','Bakti Sosial & Santunan Ramadan','Sosial','Santunan anak yatim dan pembagian paket sembako untuk warga prasejahtera.','Balai Warga Sasak Panjang',100,0,'2026-03-10T23:59:00+07','2026-03-18T15:00:00+07','closed',0),
('festival-anak-sholeh','Festival Anak Sholeh','Keagamaan','Lomba adzan, hafalan surat pendek, dan cerdas cermat islami untuk anak-anak TPA.','Halaman Masjid Jami Al-Ikhlas',120,0,'2026-12-05T23:59:00+07','2026-12-12T08:00:00+07','soon',0);

insert into public.event_categories_lomba (event_id, name, requirements_text)
select e.id, v.name, v.req from public.events e
join (values
  ('Tilawah','Seni membaca Al-Qur''an dengan maqra'' yang ditentukan panitia. Usia 10–17 tahun.'),
  ('Hifdzil Qur''an','Hafalan Juz 30 dengan tiga pertanyaan sambung ayat. Usia 8–15 tahun.'),
  ('Murottal','Bacaan tartil dengan penekanan pada kaidah tajwid. Usia 8–15 tahun.'),
  ('Adzan','Adzan Maghrib lengkap dengan doa sesudah adzan. Usia 10–17 tahun.')
) as v(name, req) on true
where e.slug = 'mtq-desa-sasak-panjang';

insert into public.news (slug, title, category, content, status, published_at, seo_title, seo_description) values
('gencb-buka-pendaftaran-mtq','GEN-CB Resmi Membuka Pendaftaran MTQ Tingkat Desa','Keagamaan','Empat cabang lomba dibuka: Tilawah, Hifdzil Qur''an, Murottal, dan Adzan, terbuka untuk anak dan remaja Desa Sasak Panjang dan sekitarnya.','published','2026-07-24T09:00:00+07','Pendaftaran MTQ Desa Sasak Panjang Dibuka','Empat cabang lomba MTQ GEN-CB dibuka untuk anak dan remaja.'),
('rumah-belajar-tembus-300-siswa','Rumah Belajar GEN-CB Tembus 300 Siswa Aktif','Pendidikan','Program bimbingan belajar gratis terus tumbuh berkat dukungan relawan pengajar dari kalangan mahasiswa.','published','2026-07-12T09:00:00+07','Rumah Belajar GEN-CB 300 Siswa','Bimbingan belajar gratis GEN-CB kini melayani 300 siswa aktif.'),
('aksi-bersih-desa','Aksi Bersih Desa Libatkan 120 Relawan Muda','Sosial','Kolaborasi bersama karang taruna dan pemerintah desa menghasilkan titik bank sampah baru di dua RW.','published','2026-06-30T09:00:00+07','Aksi Bersih Desa GEN-CB','120 relawan muda mengikuti aksi bersih desa GEN-CB.');

insert into public.gallery_albums (id, title, description) values
('11111111-1111-4111-8111-111111111111','Dokumentasi Kegiatan GEN-CB','Kumpulan foto kegiatan yayasan sepanjang tahun.');

insert into public.gallery_media (album_id, media_type, url, caption) values
('11111111-1111-4111-8111-111111111111','photo','local:prog-keagamaan','MTQ Desa Sasak Panjang'),
('11111111-1111-4111-8111-111111111111','photo','local:prog-pendidikan','Kelas Rumah Belajar'),
('11111111-1111-4111-8111-111111111111','photo','local:prog-sosial','Bakti Sosial Warga'),
('11111111-1111-4111-8111-111111111111','photo','local:prog-olahraga','Turnamen Tenis Meja'),
('11111111-1111-4111-8111-111111111111','photo','local:hero','Kebersamaan Relawan GEN-CB'),
('11111111-1111-4111-8111-111111111111','photo','local:prog-pendidikan','Pelatihan Literasi Digital');

insert into public.partners (name, category, is_active) values
('Pemerintah Desa Sasak Panjang','Pemerintah Desa',true),
('SDN Sasak Panjang 01','Sekolah',true),
('Masjid Jami Al-Ikhlas','Masjid',true),
('Karang Taruna Desa','Komunitas',true),
('MTs Nurul Huda','Sekolah',true),
('Komunitas Literasi Bogor','Komunitas',true),
('PKK Desa','Komunitas',true),
('Remaja Masjid','Komunitas',true);

insert into public.testimonials (name, role_or_affiliation, message, rating, is_published) values
('Ustadz Rahman','Pembina Masjid Al-Ikhlas','GEN-CB menghidupkan kembali semangat anak muda desa untuk belajar dan berkontribusi nyata.',5,true),
('Siti Nurhaliza','Orang tua peserta','Anak saya jadi lebih percaya diri setelah ikut kelas Rumah Belajar dan lomba MTQ GEN-CB.',5,true),
('Dimas Prakoso','Relawan pengajar','Organisasinya rapi, programnya jelas, dan dampaknya benar-benar terasa di masyarakat.',5,true);

insert into public.donation_programs (title, description, target_amount, is_active) values
('Beasiswa Anak Desa','Membantu biaya sekolah dan perlengkapan belajar anak kurang mampu di Desa Sasak Panjang.',50000000,true),
('Renovasi Rumah Belajar','Perbaikan ruang kelas dan pengadaan komputer untuk Rumah Belajar GEN-CB.',35000000,true);