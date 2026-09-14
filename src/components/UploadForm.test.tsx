import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Series } from '../types/database'
import UploadForm from './UploadForm'

const series: Series[] = [
  { id: 's1', title: 'Quiet Places', location: 'Berlin', year: 2022, position: 0, created_at: '2020-01-01' },
  { id: 's2', title: 'Reflections', location: 'Reykjavik', year: 2019, position: 1, created_at: '2020-01-02' },
]

function createFile() {
  return new File(['image-bytes'], 'photo.jpg', { type: 'image/jpeg' })
}

describe('UploadForm', () => {
  it('renders an option for each series', () => {
    render(<UploadForm series={series} status="idle" onSubmit={vi.fn()} />)

    expect(screen.getByRole('option', { name: 'Quiet Places' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Reflections' })).toBeInTheDocument()
  })

  it('calls onSubmit with the selected series, file, and trimmed caption', () => {
    const onSubmit = vi.fn()
    render(<UploadForm series={series} status="idle" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Series'), { target: { value: 's2' } })
    fireEvent.change(screen.getByLabelText('Photo'), { target: { files: [createFile()] } })
    fireEvent.change(screen.getByLabelText('Caption (optional)'), { target: { value: '  A quiet morning  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Upload photo' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    const values = onSubmit.mock.calls[0][0]
    expect(values.seriesId).toBe('s2')
    expect(values.file.name).toBe('photo.jpg')
    expect(values.caption).toBe('A quiet morning')
  })

  it('does not call onSubmit when no file has been chosen', () => {
    const onSubmit = vi.fn()
    render(<UploadForm series={series} status="idle" onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Upload photo' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows an error message when status is "error"', () => {
    render(<UploadForm series={series} status="error" errorMessage="Something went wrong" onSubmit={vi.fn()} />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('shows a success message when status is "success"', () => {
    render(<UploadForm series={series} status="success" onSubmit={vi.fn()} />)

    expect(screen.getByText('Photo uploaded.')).toBeInTheDocument()
  })

  it('disables the submit button while pending', () => {
    render(<UploadForm series={series} status="pending" onSubmit={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Uploading…' })).toBeDisabled()
  })
})
