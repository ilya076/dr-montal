/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#15333b',
        mist: '#f2f8f8',
        teal: {
          50: '#eefafa',
          100: '#d4f1f1',
          200: '#ade3e4',
          500: '#248ea1',
          600: '#167d8f',
          700: '#146675',
          800: '#165462',
        },
      },
      boxShadow: {
        card: '0 18px 45px -28px rgba(21, 51, 59, 0.28)',
      },
    },
  },
  plugins: [],
}
