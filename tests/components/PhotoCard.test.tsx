import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '../../src/types/database'
import PhotoCard from '../../src/components/PhotoCard'

vi.mock('../../src/lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
}))

const photo: Photo = {
  id: 'p1',
  series_id: 's1',
  storage_path: 'a.jpg',
  thumb_path: 'a-thumb.jpg',
  medium_path: 'a-medium.jpg',
  caption: 'A quiet morning',
  position: 0,
  created_at: '2020-01-01',
}

describe('PhotoCard', () => {
  it('renders the photo image and series caption', () => {
    render(
      <PhotoCard
        photo={photo}
        seriesTitle="Quiet Places"
        seriesLocation="Berlin"
        seriesYear={2022}
        onClick={vi.fn()}
      />,
    )

    const image = screen.getByRole('img', { name: 'A quiet morning' })
    expect(image).toHaveAttribute('src', 'https://example.com/a-medium.jpg')
    expect(screen.getByText('Quiet Places — Berlin, 2022')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(
      <PhotoCard
        photo={photo}
        seriesTitle="Quiet Places"
        seriesLocation="Berlin"
        seriesYear={2022}
        onClick={onClick}
      />,
    )

    fireEvent.click(screen.getByRole('button'))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
