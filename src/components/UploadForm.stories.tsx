import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { Series } from '../types/database'
import UploadForm from './UploadForm'

const series: Series[] = [
  { id: 's1', title: 'Quiet Places', location: 'Berlin', year: 2022, position: 0, created_at: '2022-01-01' },
  { id: 's2', title: 'Reflections', location: 'Reykjavik', year: 2019, position: 1, created_at: '2019-01-01' },
]

const meta = {
  title: 'Components/UploadForm',
  component: UploadForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Admin form for uploading a new photo: series select, file input, optional caption. Mutation-agnostic — it reports submitted values via `onSubmit` and renders whatever `status`/`errorMessage` it is given, so the actual upload mutation stays outside the component.',
      },
    },
  },
  args: {
    series,
    onSubmit: fn(),
  },
} satisfies Meta<typeof UploadForm>

export default meta

type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: { status: 'idle' },
}

export const Pending: Story = {
  args: { status: 'pending' },
}

export const Success: Story = {
  args: { status: 'success' },
}

export const Error: Story = {
  args: { status: 'error', errorMessage: 'Upload failed: network error.' },
}
