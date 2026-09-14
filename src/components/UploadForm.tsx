import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Series } from '../types/database'

export type UploadStatus = 'idle' | 'pending' | 'success' | 'error'

export interface UploadFormValues {
  seriesId: string
  file: File
  caption: string | null
}

interface UploadFormProps {
  series: Series[]
  status: UploadStatus
  errorMessage?: string | null
  onSubmit: (values: UploadFormValues) => void
}

export default function UploadForm({ series, status, errorMessage, onSubmit }: UploadFormProps) {
  const [seriesId, setSeriesId] = useState(series[0]?.id ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')

  const isPending = status === 'pending'

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!seriesId || !file) {
      return
    }

    onSubmit({ seriesId, file, caption: caption.trim() === '' ? null : caption.trim() })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Series
        <select
          value={seriesId}
          onChange={(event) => setSeriesId(event.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        >
          {series.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Photo
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Caption (optional)
        <input
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      {status === 'error' && <p className="text-sm text-red-600">{errorMessage ?? 'Upload failed.'}</p>}
      {status === 'success' && <p className="text-sm text-green-600">Photo uploaded.</p>}

      <button
        type="submit"
        disabled={isPending || series.length === 0}
        className="mt-2 rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Uploading…' : 'Upload photo'}
      </button>
    </form>
  )
}
