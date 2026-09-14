import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Photo } from '../types/database'

const PHOTOS_BUCKET = 'photos'

export interface DeletePhotoInput {
  photoId: string
  storagePath: string
  thumbPath: string
  mediumPath: string
}

async function deletePhoto({ photoId, storagePath, thumbPath, mediumPath }: DeletePhotoInput): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .remove([storagePath, thumbPath, mediumPath])

  if (storageError) {
    throw storageError
  }

  const { error: dbError } = await supabase.from('photos').delete().eq('id', photoId)

  if (dbError) {
    throw dbError
  }
}

export function useDeletePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: (_data, { photoId }) => {
      queryClient.setQueriesData<Photo[]>({ queryKey: ['photos'] }, (photos) =>
        photos?.filter((photo) => photo.id !== photoId),
      )
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
  })
}
