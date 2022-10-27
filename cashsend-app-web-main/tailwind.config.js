const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        newWhite: '#fdfff5',
        shadowGreen: '#9ecec0',
        deco: '#bedd9a',
        jungleGreen: '#32a37f',
        jungleGreenBright: '#37B08A',
        jungleGreenBrightest: '#4AF0BB',
        jungleGreenDark: '#2B8A6C',
        deepSeaGreen: '#0a6259',
        eggWhite: '#fff4c5',
        goldenTainoi: '#fece63',
        bittersweet: '#fd6f63',
        romantic: '#fec9b4',
        newBlack: '#182b33',
        authBlue: '#4285F4',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    backgroundImage: ['dark'],
    borderColor: ['dark'],
    textColor: ['dark', 'hover'],
    divideColor: ['dark'],
    gradientColorStops: ['dark'],
    translate: ['dark'],
    opacity: ['dark', 'group-hover'],
    duration: ['dark'],
    scale: ['group-hover'],
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
  purge: {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: ['w-12', 'w-16', 'w-20', 'w-24', 'w-32'],
  },
}
