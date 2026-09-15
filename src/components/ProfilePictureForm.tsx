import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { getImageUrl } from '../lib/imageUrl'

export type ProfilePictureStatus = 'idle' | 'pending' | 'success' | 'error'

interface ProfilePictureFormProps {
  currentAvatarPath: string | null
  status: ProfilePictureStatus
  errorMessage?: string | null
  onSubmit: (file: File) => void
}

export default function ProfilePictureForm({
  currentAvatarPath,
  status,
  errorMessage,
  onSubmit,
}: ProfilePictureFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const isPending = status === 'pending'

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null
    setFile(selected)
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!file) {
      return
    }

    onSubmit(file)
  }

  const displaySrc = previewUrl ?? (currentAvatarPath ? getImageUrl(currentAvatarPath) : null)

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {displaySrc && (
        <img src={displaySrc} alt="Profile picture preview" className="h-32 w-32 rounded-full object-cover" />
      )}

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Photo
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      {status === 'error' && (
        <p className="text-sm text-red-600">{errorMessage ?? 'Could not update profile picture.'}</p>
      )}
      {status === 'success' && <p className="text-sm text-green-600">Profile picture updated.</p>}

      <button
        type="submit"
        disabled={isPending || !file}
        className="mt-2 w-fit rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Uploading…' : 'Save profile picture'}
      </button>
    </form>
  )
}
