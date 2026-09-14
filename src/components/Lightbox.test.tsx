import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useUiStore } from '../stores/uiStore'
import type { Photo } from '../types/database'
import Lightbox from './Lightbox'

vi.mock('../lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
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
    caption: 'Second photo',
    position: 1,
    created_at: '2020-01-02',
  },
]

afterEach(() => {
  useUiStore.setState({ lightboxOpenPhotoId: null })
})

describe('Lightbox', () => {
  it('renders nothing when no photo is open', () => {
    render(<Lightbox photos={photos} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders the open photo at full size', () => {
    useUiStore.setState({ lightboxOpenPhotoId: 'p1' })
    render(<Lightbox photos={photos} />)

    const image = screen.getByRole('img', { name: 'First photo' })
    expect(image).toHaveAttribute('src', 'https://example.com/a.jpg')
  })

  it('closes on Escape', () => {
    useUiStore.setState({ lightboxOpenPhotoId: 'p1' })
    render(<Lightbox photos={photos} />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(useUiStore.getState().lightboxOpenPhotoId).toBeNull()
  })

  it('closes when the backdrop is clicked', () => {
    useUiStore.setState({ lightboxOpenPhotoId: 'p1' })
    render(<Lightbox photos={photos} />)

    fireEvent.click(screen.getByRole('img').parentElement!)

    expect(useUiStore.getState().lightboxOpenPhotoId).toBeNull()
  })

  it('navigates to the next photo within the same series', () => {
    useUiStore.setState({ lightboxOpenPhotoId: 'p1' })
    render(<Lightbox photos={photos} />)

    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }))

    expect(useUiStore.getState().lightboxOpenPhotoId).toBe('p2')
  })
})
