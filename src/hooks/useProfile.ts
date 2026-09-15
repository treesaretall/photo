import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/database'

async function fetchProfile(): Promise<Profile> {
  const { data, error } = await supabase.from('profile').select('*').single()

  if (error) {
    throw error
  }

  return data
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  })
}
