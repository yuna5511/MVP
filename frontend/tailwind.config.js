const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    extend: {
      zIndex: {
        100: '100',
      },
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  darkMode: 'class', // fix: https://github.com/onesine/react-tailwindcss-datepicker/issues/175#issuecomment-1662255148
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}',
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('daisyui'),
  ],
  daisyui: {
    themes: ['light'],
  },
};
