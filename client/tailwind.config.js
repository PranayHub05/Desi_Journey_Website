/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#061B40',
        ocean: '#096FD2',
        cyan: '#12B4EA',
        mist: '#EAF7FF',
        sand: '#F9F4EA',
      },
      boxShadow: {
        glow: '0 12px 45px rgba(18, 180, 234, .22)',
      },
    },
  },
  plugins: [],
}
