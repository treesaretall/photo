import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Series } from '../types/database'

async function fetchSeries(): Promise<Series[]> {
  const { data, error } = await supabase.from('series').select('*').order('position', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

export function useSeries() {
  return useQuery({
    queryKey: ['series'],
    queryFn: fetchSeries,
  })
}
