import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Photo } from '../types/database'

export interface UpdatePhotoInput {
  photoId: string
  caption: string | null
}

async function updatePhoto({ photoId, caption }: UpdatePhotoInput): Promise<void> {
  const { error } = await supabase.from('photos').update({ caption }).eq('id', photoId)

  if (error) {
    throw error
  }
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePhoto,
    onMutate: async ({ photoId, caption }) => {
      await queryClient.cancelQueries({ queryKey: ['photos'] })

      const previousPhotoQueries = queryClient.getQueriesData<Photo[]>({ queryKey: ['photos'] })

      queryClient.setQueriesData<Photo[]>({ queryKey: ['photos'] }, (photos) =>
        photos?.map((photo) => (photo.id === photoId ? { ...photo, caption } : photo)),
      )

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
