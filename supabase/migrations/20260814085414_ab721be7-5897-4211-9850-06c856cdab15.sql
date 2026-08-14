ALTER TYPE public.event_status ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE public.event_status ADD VALUE IF NOT EXISTS 'finished';
ALTER TYPE public.event_status ADD VALUE IF NOT EXISTS 'cancelled';
ALTER TYPE public.news_status ADD VALUE IF NOT EXISTS 'archived';
ALTER TYPE public.verification_status ADD VALUE IF NOT EXISTS 'accepted';
ALTER TYPE public.verification_status ADD VALUE IF NOT EXISTS 'waiting';
ALTER TYPE public.verification_status ADD VALUE IF NOT EXISTS 'present';
ALTER TYPE public.verification_status ADD VALUE IF NOT EXISTS 'absent';