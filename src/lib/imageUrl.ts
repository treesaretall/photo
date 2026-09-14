import { supabase } from './supabaseClient'

const PHOTOS_BUCKET = 'photos'

export function getImageUrl(storagePath: string): string {
  return supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(storagePath).data.publicUrl
}
