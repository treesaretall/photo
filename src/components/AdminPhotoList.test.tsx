import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Photo } from '../types/database'
import AdminPhotoList from './AdminPhotoList'

const { updateMutate, deleteMutate, reorderMutate } = vi.hoisted(() => ({
  updateMutate: vi.fn(),
  deleteMutate: vi.fn(),
  reorderMutate: vi.fn(),
}))

vi.mock('../lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
}))

vi.mock('../hooks/useUpdatePhoto', () => ({
  useUpdatePhoto: () => ({ mutate: updateMutate }),
}))

vi.mock('../hooks/useDeletePhoto', () => ({
  useDeletePhoto: () => ({ mutate: deleteMutate }),
}))

vi.mock('../hooks/useReorderPhotos', () => ({
  useReorderPhotos: () => ({ mutate: reorderMutate }),
}))

const photos: Photo[] = [
  {
    id: 'p1',
    series_id: 's1',
    storage_path: 'a.jpg',
    thumb_path: 'a-thumb.jpg',
    medium_path: 'a-medium.jpg',
    caption: 'First photo',
    position: 0,
    created_at: '2020-01-01',
  },
  {
    id: 'p2',
    series_id: 's1',
    storage_path: 'b.jpg',
    thumb_path: 'b-thumb.jpg',
    medium_path: 'b-medium.jpg',
    caption: null,
    position: 1,
    created_at: '2020-01-02',
  },
]

afterEach(() => {
  vi.restoreAllMocks()
  updateMutate.mockClear()
  deleteMutate.mockClear()
  reorderMutate.mockClear()
})

describe('AdminPhotoList', () => {
  it('renders a row per photo with its caption', () => {
    render(<AdminPhotoList seriesId="s1" photos={photos} />)

    expect(screen.getAllByLabelText('Caption')).toHaveLength(2)
    expect(screen.getByDisplayValue('First photo')).toBeInTheDocument()
  })

  it('saves the caption when the field is blurred with a changed value', () => {
    render(<AdminPhotoList seriesId="s1" photos={photos} />)

    const [firstCaptionInput] = screen.getAllByLabelText('Caption')
    fireEvent.change(firstCaptionInput, { target: { value: 'Updated caption' } })
    fireEvent.blur(firstCaptionInput)

    expect(updateMutate).toHaveBeenCalledWith({ photoId: 'p1', caption: 'Updated caption' })
  })

  it('does not save when the caption is blurred unchanged', () => {
    render(<AdminPhotoList seriesId="s1" photos={photos} />)

    const [firstCaptionInput] = screen.getAllByLabelText('Caption')
    fireEvent.blur(firstCaptionInput)

    expect(updateMutate).not.toHaveBeenCalled()
  })

  it('deletes the photo when the delete button is clicked and confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    render(<AdminPhotoList seriesId="s1" photos={photos} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

    expect(deleteMutate).toHaveBeenCalledWith({
      photoId: 'p1',
      storagePath: 'a.jpg',
      thumbPath: 'a-thumb.jpg',
      mediumPath: 'a-medium.jpg',
    })
  })

  it('does not delete the photo when the confirmation is declined', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    render(<AdminPhotoList seriesId="s1" photos={photos} />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

    expect(deleteMutate).not.toHaveBeenCalled()
  })
})
