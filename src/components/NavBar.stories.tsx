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
          'Fixed, vertically-centered site nav: Info/site title/Contacts links rotated -90° for sideways reading, collapsing to a normal horizontal bar on narrow screens. A static, prop-less component reused on every page.',
      },
    },
  },
} satisfies Meta<typeof NavBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
