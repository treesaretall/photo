import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resizeImage } from '../lib/resizeImage'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/database'

const PHOTOS_BUCKET = 'photos'
const AVATAR_MAX_DIMENSION = 800

export interface UpdateProfilePictureInput {
  file: File
  previousPath: string | null
}

async function updateProfilePicture({ file, previousPath }: UpdateProfilePictureInput): Promise<Profile> {
  const resized = await resizeImage(file, AVATAR_MAX_DIMENSION)
  const avatarPath = `profile/${crypto.randomUUID()}.jpg`

  const { error: uploadError } = await supabase.storage.from(PHOTOS_BUCKET).upload(avatarPath, resized)
  if (uploadError) {
    throw uploadError
  }

  const { data, error: updateError } = await supabase
    .from('profile')
    .update({ avatar_path: avatarPath, updated_at: new Date().toISOString() })
    .eq('id', true)
    .select()
    .single()

  if (updateError) {
    throw updateError
  }

  if (previousPath) {
    await supabase.storage.from(PHOTOS_BUCKET).remove([previousPath])
  }

  return data
}

export function useUpdateProfilePicture() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: (profile) => {
      queryClient.setQueryData(['profile'], profile)
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
