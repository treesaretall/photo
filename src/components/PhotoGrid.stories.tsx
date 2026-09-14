import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { Photo, Series } from '../types/database'
import PhotoGrid from './PhotoGrid'
import type { PhotoGroup } from './PhotoGrid'

const quietPlaces: Series = {
  id: 's1',
  title: 'Quiet Places',
  location: 'Berlin',
  year: 2022,
  position: 0,
  created_at: '2022-01-01T00:00:00.000Z',
}

const reflections: Series = {
  id: 's2',
  title: 'Reflections',
  location: 'Reykjavik',
  year: 2019,
  position: 1,
  created_at: '2019-01-01T00:00:00.000Z',
}

function makePhoto(id: string, seriesId: string, position: number, caption: string | null): Photo {
  return {
    id,
    series_id: seriesId,
    storage_path: `${seriesId}/${id}/original.jpg`,
    thumb_path: `${seriesId}/${id}/thumb.jpg`,
    medium_path: `${seriesId}/${id}/medium.jpg`,
    caption,
    position,
    created_at: '2022-01-01T00:00:00.000Z',
  }
}

const meta = {
  title: 'Components/PhotoGrid',
  component: PhotoGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lays out photos grouped by series in a responsive grid, rendering a PhotoCard per photo. Pure and driven entirely by the `groups` prop.',
      },
    },
  },
  args: {
    onPhotoClick: fn(),
  },
} satisfies Meta<typeof PhotoGrid>

export default meta

type Story = StoryObj<typeof meta>

export const SingleSeries: Story = {
  args: {
    groups: [
      {
        series: quietPlaces,
        photos: [
          makePhoto('p1', 's1', 0, 'Morning light on the old harbor wall'),
          makePhoto('p2', 's1', 1, 'Empty platform, 6am'),
        ],
      },
    ] satisfies PhotoGroup[],
  },
}

export const MultipleSeries: Story = {
  args: {
    groups: [
      {
        series: quietPlaces,
        photos: [
          makePhoto('p1', 's1', 0, 'Morning light on the old harbor wall'),
          makePhoto('p2', 's1', 1, 'Empty platform, 6am'),
          makePhoto('p3', 's1', 2, null),
        ],
      },
      {
        series: reflections,
        photos: [makePhoto('p4', 's2', 0, 'Glacial lagoon at dusk')],
      },
    ] satisfies PhotoGroup[],
  },
}
