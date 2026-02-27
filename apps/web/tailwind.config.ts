import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fff7f0',
                    100: '#ffedd8',
                    200: '#ffd9b0',
                    300: '#ffbf7d',
                    400: '#ff9a44',
                    500: '#FF6B35',
                    600: '#f04d12',
                    700: '#c73a0d',
                    800: '#a03012',
                    900: '#832914',
                    950: '#46120a',
                },
                night: {
                    50: '#f0f0ff',
                    100: '#e4e4ff',
                    200: '#cccbff',
                    300: '#ada9ff',
                    400: '#8b7dff',
                    500: '#6d52ff',
                    600: '#5c31fd',
                    700: '#4f1fe8',
                    800: '#3e18c0',
                    900: '#1a1a2e',
                    950: '#0d0d1a',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
            },
            backgroundImage: {
                'gradient-brand': 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
                'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            },
            animation: {
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'slide-in': 'slideIn 0.5s ease-out forwards',
                'float': 'float 3s ease-in-out infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideIn: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(0)' } },
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
            },
            boxShadow: {
                'brand': '0 4px 24px rgba(255, 107, 53, 0.35)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

export default config
