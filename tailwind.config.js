/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@spartan-ng/ui-core/hlm-tailwind-preset')],
  content: [
    './index.html',
    './src/**/*.{html,ts}',
    './libs/ui/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
