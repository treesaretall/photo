import type { Meta, StoryObj } from '@storybook/react-vite'
import Footer from './Footer'

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Site-wide footer with a centered copyright line. A static, prop-less component reused on every page.',
      },
    },
  },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
