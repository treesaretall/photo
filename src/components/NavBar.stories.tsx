import type { Meta, StoryObj } from '@storybook/react-vite'
import NavBar from './NavBar'

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Site-wide header: the owner name links home on the left, with Info/Contacts links on the right. A static, prop-less component reused on every page.',
      },
    },
  },
} satisfies Meta<typeof NavBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
