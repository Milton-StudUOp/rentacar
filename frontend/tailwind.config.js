/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#fef2f2',
                    100: '#fde6e6',
                    200: '#f9b3b3',
                    300: '#f58080',
                    400: '#e63946',
                    500: '#C8102E', // Primary Corporate Red
                    600: '#a80d26',
                    700: '#880a1e',
                    800: '#680817',
                    900: '#480510',
                    950: '#2d0309',
                },
                charcoal: {
                    50: '#f5f5f6',
                    100: '#e5e5e7',
                    200: '#ccccce',
                    300: '#a8a8ab',
                    400: '#7c7c80',
                    500: '#616165',
                    600: '#525254',
                    700: '#464648',
                    800: '#3d3d3f',
                    900: '#1C1C1E', // Primary Charcoal
                    950: '#121214',
                },
                snow: '#FAFAFA',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
                'fade-in-left': 'fadeInLeft 0.8s ease-out forwards',
                'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 6s ease-in-out infinite',
                'count-up': 'countUp 2s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeInRight: {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(200, 16, 46, 0.3)' },
                    '100%': { boxShadow: '0 0 40px rgba(200, 16, 46, 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            boxShadow: {
                'corporate': '0 4px 30px rgba(200, 16, 46, 0.08)',
                'corporate-lg': '0 10px 50px rgba(200, 16, 46, 0.15)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            },
            backgroundImage: {
                'gradient-corporate': 'linear-gradient(135deg, #C8102E 0%, #a80d26 100%)',
                'gradient-dark': 'linear-gradient(135deg, #1C1C1E 0%, #121214 100%)',
                'gradient-hero': 'linear-gradient(160deg, #121214 0%, #1C1C1E 50%, #2d0309 100%)',
            },
        },
    },
    plugins: [],
}
