import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect } from 'react'
import { useUiStore } from '../stores/uiStore'
import type { Photo } from '../types/database'
import Lightbox from './Lightbox'

function makePhoto(id: string, position: number): Photo {
  return {
    id,
    series_id: 's1',
    storage_path: `s1/${id}/original.jpg`,
    thumb_path: `s1/${id}/thumb.jpg`,
    medium_path: `s1/${id}/medium.jpg`,
    caption: `Photo ${position + 1}`,
    position,
    created_at: '2022-01-01T00:00:00.000Z',
  }
}

interface OpenLightboxProps {
  photos: Photo[]
  openPhotoId: string
}

function OpenLightbox({ photos, openPhotoId }: OpenLightboxProps) {
  useEffect(() => {
    useUiStore.setState({ lightboxOpenPhotoId: openPhotoId })
    return () => useUiStore.setState({ lightboxOpenPhotoId: null })
  }, [openPhotoId])

  return <Lightbox photos={photos} />
}

const meta = {
  title: 'Components/Lightbox',
  component: Lightbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Full-screen overlay showing the currently open photo at full size. Reads open/current state from the uiStore (a global "current overlay" concept) but takes its photo list via props. Closes on backdrop click or Escape.',
      },
    },
  },
  args: {
    photos: [],
  },
} satisfies Meta<typeof Lightbox>

export default meta

type Story = StoryObj<typeof meta>

export const WithNextAndPrevious: Story = {
  render: () => <OpenLightbox photos={[makePhoto('p1', 0), makePhoto('p2', 1), makePhoto('p3', 2)]} openPhotoId="p2" />,
}

export const SinglePhoto: Story = {
  render: () => <OpenLightbox photos={[makePhoto('p1', 0)]} openPhotoId="p1" />,
}
