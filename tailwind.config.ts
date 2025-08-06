import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx}',
    '!./node_modules/**/*',
    '!./backend/**/*'
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-3d': 'float-3d 6s ease-in-out infinite',
        'pulse-glow-3d': 'pulse-glow-3d 4s ease-in-out infinite',
        'rotate-3d': 'rotate-3d 20s linear infinite',
        'tilt-3d': 'tilt-3d 8s ease-in-out infinite',
        'curve-morph': 'curve-morph 15s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'shimmer-3d': 'shimmer-3d 3s infinite',
      },
      keyframes: {
        'float-3d': {
          '0%, 100%': { 
            transform: 'translateY(0px) rotateX(0deg) rotateY(0deg)' 
          },
          '33%': { 
            transform: 'translateY(-20px) rotateX(5deg) rotateY(5deg)' 
          },
          '66%': { 
            transform: 'translateY(-10px) rotateX(-3deg) rotateY(-3deg)' 
          },
        },
        'pulse-glow-3d': {
          '0%, 100%': { 
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 20px 60px rgba(99, 102, 241, 0.15)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 30px 80px rgba(99, 102, 241, 0.25)',
            transform: 'scale(1.05)' 
          },
        },
        'rotate-3d': {
          '0%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
          },
          '25%': {
            transform: 'perspective(1000px) rotateX(5deg) rotateY(90deg)'
          },
          '50%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(180deg)'
          },
          '75%': {
            transform: 'perspective(1000px) rotateX(-5deg) rotateY(270deg)'
          },
          '100%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(360deg)'
          },
        },
        'tilt-3d': {
          '0%, 100%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
          },
          '25%': {
            transform: 'perspective(1000px) rotateX(5deg) rotateY(10deg)'
          },
          '50%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
          },
          '75%': {
            transform: 'perspective(1000px) rotateX(-5deg) rotateY(-10deg)'
          },
        },
        'curve-morph': {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            transform: 'rotate(0deg) scale(1)'
          },
          '25%': {
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
            transform: 'rotate(90deg) scale(1.1)'
          },
          '50%': {
            borderRadius: '70% 30% 50% 60% / 30% 50% 60% 70%',
            transform: 'rotate(180deg) scale(1)'
          },
          '75%': {
            borderRadius: '40% 70% 60% 30% / 70% 40% 50% 30%',
            transform: 'rotate(270deg) scale(1.1)'
          },
        },
        'gradient-shift': {
          '0%, 100%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          },
        },
        'shimmer-3d': {
          '0%': {
            backgroundPosition: '-200% 0',
            transform: 'perspective(1000px) rotateY(-10deg)'
          },
          '50%': {
            transform: 'perspective(1000px) rotateY(0deg)'
          },
          '100%': {
            backgroundPosition: '200% 0',
            transform: 'perspective(1000px) rotateY(10deg)'
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;