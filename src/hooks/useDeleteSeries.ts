import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Photo, Series } from '../types/database'

const PHOTOS_BUCKET = 'photos'

export interface DeleteSeriesInput {
  seriesId: string
  photos: Photo[]
}

async function deleteSeries({ seriesId, photos }: DeleteSeriesInput): Promise<void> {
  const paths = photos.flatMap((photo) => [photo.storage_path, photo.thumb_path, photo.medium_path])

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(PHOTOS_BUCKET).remove(paths)

    if (storageError) {
      throw storageError
    }
  }

  // Photo rows cascade-delete in the database once the series row is gone.
  const { error: dbError } = await supabase.from('series').delete().eq('id', seriesId)

  if (dbError) {
    throw dbError
  }
}

export function useDeleteSeries() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSeries,
    onSuccess: (_data, { seriesId }) => {
      queryClient.setQueryData<Series[]>(['series'], (series) => series?.filter((s) => s.id !== seriesId))
      queryClient.invalidateQueries({ queryKey: ['series'] })
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
  })
}
