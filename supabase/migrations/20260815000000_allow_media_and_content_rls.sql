-- Permissive RLS Policies for Media Assets, Storage, and Content Tables

-- Ensure Storage Bucket media exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage objects policy for media bucket
DROP POLICY IF EXISTS "Public Access Media Bucket" ON storage.objects;
CREATE POLICY "Public Access Media Bucket"
  ON storage.objects FOR ALL
  USING (bucket_id = 'media')
  WITH CHECK (bucket_id = 'media');

-- media_assets table RLS policy
ALTER TABLE IF EXISTS public.media_assets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Media Assets" ON public.media_assets;
CREATE POLICY "Allow All Media Assets"
  ON public.media_assets FOR ALL
  USING (true)
  WITH CHECK (true);

-- news table RLS policy
ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All News" ON public.news;
CREATE POLICY "Allow All News"
  ON public.news FOR ALL
  USING (true)
  WITH CHECK (true);

-- events table RLS policy
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Events" ON public.events;
CREATE POLICY "Allow All Events"
  ON public.events FOR ALL
  USING (true)
  WITH CHECK (true);

-- donation_programs table RLS policy
ALTER TABLE IF EXISTS public.donation_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Donation Programs" ON public.donation_programs;
CREATE POLICY "Allow All Donation Programs"
  ON public.donation_programs FOR ALL
  USING (true)
  WITH CHECK (true);

-- notifications_log table RLS policy
ALTER TABLE IF EXISTS public.notifications_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow All Notifications Log" ON public.notifications_log;
CREATE POLICY "Allow All Notifications Log"
  ON public.notifications_log FOR ALL
  USING (true)
  WITH CHECK (true);
