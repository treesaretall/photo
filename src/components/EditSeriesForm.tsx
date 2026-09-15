import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Series } from '../types/database'

export type EditSeriesStatus = 'idle' | 'pending' | 'success' | 'error'

export interface EditSeriesFormValues {
  title: string
  location: string
  year: number
}

interface EditSeriesFormProps {
  series: Series
  status: EditSeriesStatus
  errorMessage?: string | null
  onSubmit: (values: EditSeriesFormValues) => void
  onCancel: () => void
}

export default function EditSeriesForm({ series, status, errorMessage, onSubmit, onCancel }: EditSeriesFormProps) {
  const [title, setTitle] = useState(series.title)
  const [location, setLocation] = useState(series.location)
  const [year, setYear] = useState(String(series.year))

  const isPending = status === 'pending'

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedLocation = location.trim()
    const parsedYear = Number(year)

    if (!trimmedTitle || !trimmedLocation || !Number.isInteger(parsedYear)) {
      return
    }

    onSubmit({ title: trimmedTitle, location: trimmedLocation, year: parsedYear })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Title
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded border border-gray-300 px-2 py-1"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Location
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="rounded border border-gray-300 px-2 py-1"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Year
        <input
          type="number"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          className="w-20 rounded border border-gray-300 px-2 py-1"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-gray-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save'}
      </button>
      <button type="button" onClick={onCancel} className="text-sm text-gray-600 underline">
        Cancel
      </button>

      {status === 'error' && <p className="w-full text-sm text-red-600">{errorMessage ?? 'Could not update series.'}</p>}
    </form>
  )
}
