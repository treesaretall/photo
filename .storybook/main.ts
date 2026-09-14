import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  async viteFinal(viteConfig) {
    viteConfig.resolve ??= {}
    viteConfig.resolve.alias = [
      ...(Array.isArray(viteConfig.resolve.alias) ? viteConfig.resolve.alias : []),
      // Avoids requiring a live Supabase project just to render placeholder images in stories.
      { find: /^\.\.\/lib\/imageUrl$/, replacement: path.resolve(dirname, './mocks/imageUrl.ts') },
    ]
    return viteConfig
  },
}
export default config
