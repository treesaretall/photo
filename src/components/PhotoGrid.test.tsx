import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo, Series } from '../types/database'
import PhotoGrid from './PhotoGrid'

vi.mock('../lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
}))

const series: Series = {
  id: 's1',
  title: 'Quiet Places',
  location: 'Berlin',
  year: 2022,
  position: 0,
  created_at: '2020-01-01',
}

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
    caption: 'Second photo',
    position: 1,
    created_at: '2020-01-02',
  },
]

describe('PhotoGrid', () => {
  it('renders a section per series with its photos', () => {
    render(<PhotoGrid groups={[{ series, photos }]} onPhotoClick={vi.fn()} />)

    expect(screen.getByText('Quiet Places')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'First photo' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Second photo' })).toBeInTheDocument()
  })

  it('calls onPhotoClick with the clicked photo id', () => {
    const onPhotoClick = vi.fn()
    render(<PhotoGrid groups={[{ series, photos }]} onPhotoClick={onPhotoClick} />)

    fireEvent.click(screen.getByRole('img', { name: 'Second photo' }))

    expect(onPhotoClick).toHaveBeenCalledWith('p2')
  })
})
