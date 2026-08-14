-- ========== EVENTS: kolom operasional tambahan ==========
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS theme text,
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS contact_person text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS requirements_text text,
  ADD COLUMN IF NOT EXISTS rules_text text,
  ADD COLUMN IF NOT EXISTS prizes_text text,
  ADD COLUMN IF NOT EXISTS faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS map_url text,
  ADD COLUMN IF NOT EXISTS registration_open_override boolean,
  ADD COLUMN IF NOT EXISTS status_override boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS unique_by_phone boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS unique_by_email boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ========== NEWS ==========
ALTER TABLE public.news
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS author_name text,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ========== REGISTRATIONS ==========
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS admin_note text,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ========== CONTACT MESSAGES ==========
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS subject text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';

-- ========== MEDIA LIBRARY ==========
CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  path text NOT NULL,
  url text NOT NULL,
  folder text NOT NULL DEFAULT 'general',
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket, path)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "media assets manageable by staff" ON public.media_assets
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ========== FORM BUILDER ==========
CREATE TABLE IF NOT EXISTS public.event_form_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  field_key text NOT NULL,
  label text NOT NULL,
  field_type text NOT NULL DEFAULT 'text',
  placeholder text,
  help_text text,
  required boolean NOT NULL DEFAULT true,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  validation jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, field_key)
);
GRANT SELECT ON public.event_form_fields TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_form_fields TO authenticated;
GRANT ALL ON public.event_form_fields TO service_role;
ALTER TABLE public.event_form_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "form fields readable by everyone" ON public.event_form_fields
  FOR SELECT USING (true);
CREATE POLICY "form fields manageable by staff" ON public.event_form_fields
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ========== PENGURUS ==========
CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  photo_url text,
  bio text,
  period text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.organization_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT ALL ON public.organization_members TO service_role;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members readable when active" ON public.organization_members
  FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "members manageable by staff" ON public.organization_members
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ========== SITE SETTINGS ==========
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings readable by everyone" ON public.site_settings
  FOR SELECT USING (true);
CREATE POLICY "settings manageable by admin" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ========== AUDIT LOG ==========
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity text,
  entity_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit readable by admin" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "audit insert by staff" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

-- ========== TRIGGER updated_at ==========
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS events_touch ON public.events;
CREATE TRIGGER events_touch BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
DROP TRIGGER IF EXISTS news_touch ON public.news;
CREATE TRIGGER news_touch BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
DROP TRIGGER IF EXISTS registrations_touch ON public.registrations;
CREATE TRIGGER registrations_touch BEFORE UPDATE ON public.registrations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
DROP TRIGGER IF EXISTS members_touch ON public.organization_members;
CREATE TRIGGER members_touch BEFORE UPDATE ON public.organization_members FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
DROP TRIGGER IF EXISTS form_fields_touch ON public.event_form_fields;
CREATE TRIGGER form_fields_touch BEFORE UPDATE ON public.event_form_fields FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();