create policy "documents owner read" on storage.objects for select to authenticated
  using (bucket_id = 'documents' and (owner = auth.uid() or public.is_staff(auth.uid())));
create policy "documents insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents');
create policy "documents owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and (owner = auth.uid() or public.is_staff(auth.uid())));

create policy "media public read" on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
create policy "media staff insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "media staff update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));
create policy "media staff delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff(auth.uid()));