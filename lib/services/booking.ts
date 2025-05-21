import { fetchData, insertData, updateData } from "@/lib/data"
import type { Database } from "@/types/supabase"

type Consultation = Database["public"]["Tables"]["consultations"]["Row"]

// Get consultations for a client
export async function getClientConsultations(clientId: string) {
  return fetchData<Consultation[]>(
    "consultations",
    (supabase) =>
      supabase
        .from("consultations")
        .select(`
        *,
        artist:artist_id(
          users!inner(full_name, email),
          artist_profiles!inner(*)
        )
      `)
        .eq("client_id", clientId)
        .order("consultation_date", { ascending: true }),
    `client:${clientId}:consultations`,
  )
}

// Get consultations for an artist
export async function getArtistConsultations(artistId: string) {
  return fetchData<Consultation[]>(
    "consultations",
    (supabase) =>
      supabase
        .from("consultations")
        .select(`
        *,
        client:client_id(
          users!inner(full_name, email)
        )
      `)
        .eq("artist_id", artistId)
        .order("consultation_date", { ascending: true }),
    `artist:${artistId}:consultations`,
  )
}

// Book a consultation
export async function bookConsultation(data: {
  clientId: string
  artistId: string
  consultationDate: string
  startTime: string
  endTime: string
  notes?: string
}) {
  return insertData<Consultation>(
    "consultations",
    {
      client_id: data.clientId,
      artist_id: data.artistId,
      consultation_date: data.consultationDate,
      start_time: data.startTime,
      end_time: data.endTime,
      status: "pending",
      notes: data.notes || null,
    },
    [`client:${data.clientId}:consultations`, `artist:${data.artistId}:consultations`],
  )
}

// Update consultation status
export async function updateConsultationStatus(consultationId: number, status: string, userId: string) {
  const { data: consultation, error } = await fetchData<Consultation>(
    "consultations",
    (supabase) => supabase.from("consultations").select("client_id, artist_id").eq("id", consultationId).single(),
    `consultation:${consultationId}`,
  )

  if (error || !consultation) {
    return { success: false, error: error || new Error("Consultation not found") }
  }

  return updateData<Consultation>(
    "consultations",
    consultationId,
    {
      status,
      updated_at: new Date().toISOString(),
    },
    "id",
    [
      `client:${consultation.client_id}:consultations`,
      `artist:${consultation.artist_id}:consultations`,
      `consultation:${consultationId}`,
    ],
  )
}
