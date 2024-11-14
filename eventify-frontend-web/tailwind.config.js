// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui', '@tailwindcss/forms')],
  daisyui: {
    themes: ['autumn', 'corporate'], // El tema 'autumn' tiene tonos naranjas
  },
};
