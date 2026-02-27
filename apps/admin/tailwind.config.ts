import type { Config } from 'tailwindcss';
const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                brand: { 500: '#FF6B35', 600: '#e55a24', 50: '#fff7f0', 100: '#ffedd8', 400: '#ff8c42' },
                night: { 900: '#1a1a2e', 800: '#16213e', 700: '#0f3460' },
            },
            fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
        },
    },
    plugins: [],
};
export default config;
