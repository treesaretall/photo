import { useState } from 'react'
import type { FormEvent } from 'react'

export type CreateSeriesStatus = 'idle' | 'pending' | 'success' | 'error'

export interface CreateSeriesFormValues {
  title: string
  location: string
  year: number
}

interface CreateSeriesFormProps {
  status: CreateSeriesStatus
  errorMessage?: string | null
  onSubmit: (values: CreateSeriesFormValues) => void
}

export default function CreateSeriesForm({ status, errorMessage, onSubmit }: CreateSeriesFormProps) {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [year, setYear] = useState(String(new Date().getFullYear()))

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
    setTitle('')
    setLocation('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Title
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Location
        <input
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-gray-700">
        Year
        <input
          type="number"
          value={year}
          onChange={(event) => setYear(event.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
        />
      </label>

      {status === 'error' && <p className="text-sm text-red-600">{errorMessage ?? 'Could not create series.'}</p>}
      {status === 'success' && <p className="text-sm text-green-600">Series created.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Creating…' : 'Create series'}
      </button>
    </form>
  )
}
