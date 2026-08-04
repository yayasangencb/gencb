import { supabase } from "@/integrations/supabase/client";

export type CloudRegistrationInput = {
  eventSlug: string;
  fullName: string;
  nik: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  rw: string;
  phone: string;
  email: string;
  school: string;
  competition: string;
  hasKtp: boolean;
  hasKk: boolean;
  hasPhoto: boolean;
  hasPayment: boolean;
};

/**
 * Simpan pendaftaran ke database. Mengembalikan nomor peserta & QR bila berhasil.
 * Gagal secara diam-diam agar pendaftaran lokal tetap tersimpan.
 */
export async function submitRegistrationToCloud(input: CloudRegistrationInput) {
  try {
    const { data: event } = await supabase
      .from("events")
      .select("id")
      .eq("slug", input.eventSlug)
      .maybeSingle();
    if (!event) return null;

    let lombaCategoryId: string | null = null;
    if (input.competition && input.competition !== "-") {
      const { data: lomba } = await supabase
        .from("event_categories_lomba")
        .select("id")
        .eq("event_id", event.id)
        .eq("name", input.competition)
        .maybeSingle();
      lombaCategoryId = lomba?.id ?? null;
    }

    const { data, error } = await supabase
      .from("registrations")
      .insert({
        event_id: event.id,
        full_name: input.fullName,
        nik: input.nik,
        birth_place: input.birthPlace,
        birth_date: input.birthDate || null,
        gender: input.gender,
        address: input.address,
        rw: input.rw,
        phone: input.phone,
        email: input.email,
        school: input.school,
        lomba_category_id: lombaCategoryId,
        ktp_url: input.hasKtp ? "uploaded" : null,
        kk_url: input.hasKk ? "uploaded" : null,
        photo_url: input.hasPhoto ? "uploaded" : null,
        payment_proof_url: input.hasPayment ? "uploaded" : null,
        agreement_checked: true,
      })
      .select("participant_number, qr_code_value")
      .maybeSingle();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    message: input.message,
  });
  return !error;
}
