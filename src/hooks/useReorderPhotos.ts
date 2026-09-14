import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Photo } from '../types/database'

export interface ReorderPhotosInput {
  seriesId: string
  photoIds: string[]
}

async function reorderPhotos({ photoIds }: ReorderPhotosInput): Promise<void> {
  const results = await Promise.all(
    photoIds.map((photoId, index) => supabase.from('photos').update({ position: index }).eq('id', photoId)),
  )

  const error = results.find((result) => result.error)?.error
  if (error) {
    throw error
  }
}

export function useReorderPhotos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reorderPhotos,
    onMutate: async ({ photoIds }) => {
      await queryClient.cancelQueries({ queryKey: ['photos'] })

      const previousPhotoQueries = queryClient.getQueriesData<Photo[]>({ queryKey: ['photos'] })
      const positionById = new Map(photoIds.map((id, index) => [id, index]))

      queryClient.setQueriesData<Photo[]>({ queryKey: ['photos'] }, (photos) => {
        if (!photos) {
          return photos
        }

        return [...photos]
          .map((photo) => (positionById.has(photo.id) ? { ...photo, position: positionById.get(photo.id)! } : photo))
          .sort((a, b) => a.position - b.position)
      })

      return { previousPhotoQueries }
    },
    onError: (_error, _variables, context) => {
      context?.previousPhotoQueries.forEach(([queryKey, photos]) => {
        queryClient.setQueryData(queryKey, photos)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
  })
}
