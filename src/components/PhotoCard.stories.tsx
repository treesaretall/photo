import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { Photo } from '../types/database'
import PhotoCard from './PhotoCard'

const photo: Photo = {
  id: 'p1',
  series_id: 's1',
  storage_path: 'quiet-places/1/original.jpg',
  thumb_path: 'quiet-places/1/thumb.jpg',
  medium_path: 'quiet-places/1/medium.jpg',
  caption: 'Morning light on the old harbor wall',
  position: 0,
  created_at: '2022-03-01T00:00:00.000Z',
}

const meta = {
  title: 'Components/PhotoCard',
  component: PhotoCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Renders a single photo with a series/location/year caption underneath. Pure and prop-driven — no hooks or store reads — so it can be reused in any grid layout.',
      },
    },
  },
  args: {
    photo,
    seriesTitle: 'Quiet Places',
    seriesLocation: 'Berlin',
    seriesYear: 2022,
    onClick: fn(),
  },
} satisfies Meta<typeof PhotoCard>

export default meta

type Story = StoryObj<typeof meta>

export const WithCaption: Story = {}

export const WithoutCaption: Story = {
  args: {
    photo: { ...photo, caption: null },
  },
}
