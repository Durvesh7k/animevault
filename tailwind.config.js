/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Outfit', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      colors: {
        bg:      '#07070f',
        surface: 'rgba(255,255,255,0.04)',
        accent:  '#7c3aed',
        accent2: '#0891b2',
        glow:    'rgba(124,58,237,0.25)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease both',
        'float':     'float 3.5s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
        'drift1':    'drift1 22s ease-in-out infinite alternate',
        'drift2':    'drift2 28s ease-in-out infinite alternate',
        'shake':     'shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97) both',
        'slide-in':  'slideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'fade-out':  'fadeOut 0.3s ease 2.9s forwards',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        float:    { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        drift1:   { from: { transform: 'translate(0,0)' }, to: { transform: 'translate(80px,60px)' } },
        drift2:   { from: { transform: 'translate(0,0)' }, to: { transform: 'translate(-60px,-80px)' } },
        shake:    { '10%,90%': { transform: 'translateX(-3px)' }, '20%,80%': { transform: 'translateX(6px)' }, '30%,50%,70%': { transform: 'translateX(-6px)' }, '40%,60%': { transform: 'translateX(6px)' } },
        slideIn:  { from: { opacity: '0', transform: 'translateX(48px) scale(0.9)' }, to: { opacity: '1', transform: 'translateX(0) scale(1)' } },
        fadeOut:  { to: { opacity: '0', transform: 'translateX(48px)' } },
      },
      backdropBlur: { xs: '4px' },
      boxShadow: {
        glow:  '0 0 40px rgba(124,58,237,0.3)',
        card:  '0 24px 64px rgba(0,0,0,0.65), 0 0 40px rgba(124,58,237,0.2)',
      },
    },
  },
  plugins: [],
}
