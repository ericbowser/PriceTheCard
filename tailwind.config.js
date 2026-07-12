/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                burtons: ['../src/assets/fonts/Burtons.otf']
            },
            colors: {
                ink: {
                    DEFAULT: '#0D0D0D',
                    light: '#1A1A1A',
                },
                parchment: '#F3EAD9',
                foil: {
                    DEFAULT: '#FFC72C',
                    dark: '#E0A800',
                },
                ledger: '#2E7D32',
                ember: '#B5502D',
            },
        },
    },
    plugins: [],
}