import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for the app
        profit: '#22c55e',
        loss: '#ef4444',
        neutral: '#6b7280',
        surface: {
          DEFAULT: '#0a0a0a',
          secondary: '#141414',
          tertiary: '#1f1f1f',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        }
      },
    },
  },
  plugins: [],
}
export default config
