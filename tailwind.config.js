/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'Cairo', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        blurZoom: {
          '0%': { opacity: '0', transform: 'scale(0.96)', filter: 'blur(6px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'blur-zoom': 'blurZoom 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
