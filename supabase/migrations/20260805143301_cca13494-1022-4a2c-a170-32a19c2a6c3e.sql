CREATE POLICY "donations public verified read" ON public.donations FOR SELECT TO anon, authenticated USING (is_verified = true);
GRANT SELECT ON public.donations TO anon;