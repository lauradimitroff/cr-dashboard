import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f7ff',
          100: '#eceefe',
          200: '#dadfff',
          500: '#4668f2',
          600: '#3550c4',
          700: '#2b429f',
        },
      },
    },
  },
  plugins: [],
};

export default config;
