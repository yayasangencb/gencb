-- Media bucket: gambar publik (dibaca lewat route publik), dikelola pengelola
DROP POLICY IF EXISTS "media readable by anyone" ON storage.objects;
CREATE POLICY "media readable by anyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "media writable by staff" ON storage.objects;
CREATE POLICY "media writable by staff" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "media updatable by staff" ON storage.objects;
CREATE POLICY "media updatable by staff" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'media' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "media deletable by staff" ON storage.objects;
CREATE POLICY "media deletable by staff" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_staff(auth.uid()));

-- Documents bucket: dokumen sensitif peserta, hanya pengelola yang boleh membaca
DROP POLICY IF EXISTS "documents readable by staff" ON storage.objects;
CREATE POLICY "documents readable by staff" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'documents' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "documents uploadable by anyone" ON storage.objects;
CREATE POLICY "documents uploadable by anyone" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "documents deletable by staff" ON storage.objects;
CREATE POLICY "documents deletable by staff" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'documents' AND public.is_staff(auth.uid()));