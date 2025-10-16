import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        magenta: {
          '500': '#ff00ff',
        },
        cyan: {
          '500': '#00ffff',
        },
      },
    },
  },
  plugins: [],
}
export default config
