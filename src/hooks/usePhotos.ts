import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Photo } from '../types/database'

async function fetchPhotos(seriesId?: string): Promise<Photo[]> {
  let query = supabase.from('photos').select('*').order('position', { ascending: true })

  if (seriesId) {
    query = query.eq('series_id', seriesId)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export function usePhotos(seriesId?: string) {
  return useQuery({
    queryKey: ['photos', seriesId ?? 'all'],
    queryFn: () => fetchPhotos(seriesId),
  })
}
