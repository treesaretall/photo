import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Series } from '../types/database'

export interface CreateSeriesInput {
  title: string
  location: string
  year: number
}

async function getNextPosition(): Promise<number> {
  const { data, error } = await supabase.from('series').select('*').order('position', { ascending: false }).limit(1)

  if (error) {
    throw error
  }

  return (data[0]?.position ?? -1) + 1
}

async function createSeries(input: CreateSeriesInput): Promise<Series> {
  const position = await getNextPosition()

  const { data, error } = await supabase
    .from('series')
    .insert([{ ...input, position }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export function useCreateSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSeries,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
    },
  })
}
