export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 20px 80px rgba(15, 23, 42, 0.16)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(96,165,250,0.24), transparent 45%), radial-gradient(circle at bottom right, rgba(168,85,247,0.18), transparent 35%)',
      },
    },
  },
  plugins: [],
};
