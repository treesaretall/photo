import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resizeImage } from '../lib/resizeImage'
import { supabase } from '../lib/supabaseClient'
import type { Photo } from '../types/database'

const PHOTOS_BUCKET = 'photos'
const THUMB_MAX_DIMENSION = 400
const MEDIUM_MAX_DIMENSION = 1600

export interface UploadPhotoInput {
  seriesId: string
  file: File
  caption: string | null
}

async function getNextPosition(seriesId: string): Promise<number> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('series_id', seriesId)
    .order('position', { ascending: false })
    .limit(1)

  if (error) {
    throw error
  }

  return (data[0]?.position ?? -1) + 1
}

async function uploadPhoto({ seriesId, file, caption }: UploadPhotoInput): Promise<Photo> {
  const [thumbBlob, mediumBlob] = await Promise.all([
    resizeImage(file, THUMB_MAX_DIMENSION),
    resizeImage(file, MEDIUM_MAX_DIMENSION),
  ])

  const folder = `${seriesId}/${crypto.randomUUID()}`
  const originalPath = `${folder}/original.jpg`
  const thumbPath = `${folder}/thumb.jpg`
  const mediumPath = `${folder}/medium.jpg`

  const uploadResults = await Promise.all([
    supabase.storage.from(PHOTOS_BUCKET).upload(originalPath, file),
    supabase.storage.from(PHOTOS_BUCKET).upload(thumbPath, thumbBlob),
    supabase.storage.from(PHOTOS_BUCKET).upload(mediumPath, mediumBlob),
  ])

  const uploadError = uploadResults.find((result) => result.error)?.error
  if (uploadError) {
    throw uploadError
  }

  const position = await getNextPosition(seriesId)

  const { data, error } = await supabase
    .from('photos')
    .insert([
      {
        series_id: seriesId,
        storage_path: originalPath,
        thumb_path: thumbPath,
        medium_path: mediumPath,
        caption,
        position,
      },
    ])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
  })
}
