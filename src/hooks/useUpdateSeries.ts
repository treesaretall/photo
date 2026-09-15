import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Series } from '../types/database'

export interface UpdateSeriesInput {
  seriesId: string
  title: string
  location: string
  year: number
}

async function updateSeries({ seriesId, title, location, year }: UpdateSeriesInput): Promise<void> {
  const { error } = await supabase.from('series').update({ title, location, year }).eq('id', seriesId)

  if (error) {
    throw error
  }
}

export function useUpdateSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSeries,
    onMutate: async ({ seriesId, title, location, year }) => {
      await queryClient.cancelQueries({ queryKey: ['series'] })

      const previousSeries = queryClient.getQueryData<Series[]>(['series'])

      queryClient.setQueryData<Series[]>(['series'], (series) =>
        series?.map((s) => (s.id === seriesId ? { ...s, title, location, year } : s)),
      )

      return { previousSeries }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSeries) {
        queryClient.setQueryData(['series'], context.previousSeries)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['series'] })
    },
  })
}
