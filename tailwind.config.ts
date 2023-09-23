import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography"), require("tailwind-scrollbar")],
  daisyui: {
    themes: ["light", "dark", {
      mytheme: {
      
"primary": "#ef23b9",
      
"secondary": "#f94d6a",
      
"accent": "#dd9568",
      
"neutral": "#14161F",
      
"base-100": "#E9E3ED",
      
"info": "#8FC4E5",
      
"success": "#64EDD1",
      
"warning": "#C98A03",
      
"error": "#F15037",
      },
    },],
  },
}
export default config
