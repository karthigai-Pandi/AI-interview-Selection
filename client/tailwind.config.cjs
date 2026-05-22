module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1066',
        },
        accent: {
          DEFAULT: '#06b6d4',
          400: '#2dd4bf',
          500: '#06b6d4',
          600: '#0891b2',
        },
        surface: {
          DEFAULT: '#0b1020',
          900: '#020617',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue'],
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(2,6,23,0.6)',
      },
    },
  },
  plugins: [],
};
