const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",

  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
         linearBorderGradients: {
        directions: {
          tr: 'to top right',
          r: 'to right',
        },
        colors: {
          'blue-pink': ['#FF3E3D', '#466DFD'],
          'pink-red-light-brown': ['#FE5A75', '#FF3E3D'],
        },
        background: {
          'dark-1000': '#0D0415',
          'dark-900': '#0D0E21',
          'dark-800': '#202231',
          'dark-pink-red': '#4e3034',
        },
        border: {
          1: '1px',
          2: '2px',
          3: '3px',
          4: '4px',
        },
      },
      maxHeight: {
        kromatikaFrame: "410px",
        syncswapFrame: "540px",
      },
      backgroundColor: {
        golden: "#f99b0e",
      },
      backgroundImage: {
        "gradient-radial1":
          "radial-gradient(50% 60% at 50% 10%, rgba(255, 62, 61, 0.2) 0%, rgba(255, 62, 61, 0) 100%)",
        "gradient-radial2":
          "radial-gradient(50% 60% at 50% 10%, rgba(164, 255, 61, 0.1) 0%, rgba(255, 62, 61, 0) 100%)",
        "gradient-radial3":
          "radial-gradient(118% 53% at 50% 40%, rgba(61, 220, 255, 0.2) 0%, rgba(61, 220, 255, 0) 100%)",
          "gradient-radial4":
          "radial-gradient(50% 60% at 50% 10%, rgba(239, 255, 61, 0.2) 0%, rgba(239, 255, 61, 0) 100%)",
          "gradient-radial5":
          "radial-gradient(50% 60% at 50% 10%, rgba(251, 61, 255, 0.2) 0%, rgba(251, 61, 255, 0) 100%)",
          "gradient-radial6":
          "radial-gradient(50% 60% at 50% 10%, rgba(255, 122, 0, 0.2) 0%, rgba(255, 122, 0, 0) 100%)",
          "gradient-radial7":
          "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,.46) 0%, rgba(124,147,255,.26) 100%)",
          "gradient-radial8":
          "radial-gradient(50% 50% at 50% 50%, rgba(239,238,238,.115) 0%, rgba(255,255,255,.065) 100%)",
          "gradient-radial9":
          "radial-gradient(50% 50% at 50% 50%, rgba(239,238,238,.069) 0%, rgba(255,255,255,.039) 100%)",
          "gradient-radial10":
            "radial-gradient(50% 60% at 10% -6%, rgba(61, 220, 255, 0.2) 0%, rgba(61, 220, 255, 0) 100%)",
        borderLight: "linear-gradient(90deg,#D4D5F8 0%,#D4D5F8 100%)",
        backgroundGray:
          "linear-gradient(90deg,rgba(2,2,3,.05) 0%,rgba(2,2,3,.05) 100%)",
        backgroundLight:
          "linear-gradient(90deg,rgba(2,2,3,.05) 0%,rgba(2,2,3,.05) 100%)",
        borderGray: "rgba(124,147,255,.26)",
          'gradient-1':
          ' radial-gradient(50% 50% at 50% 50%, rgba(239, 238, 238, 0.069) 0%, rgba(255, 255, 255, 0.039) 100%)',
        'gradient-2':
          ' radial-gradient(50% 50% at 50% 50%, rgba(239, 238, 238, 0.115) 0%, rgba(255, 255, 255, 0.065) 100%)',
        'gradient-3':
          ' radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0.46) 0%, rgba(124, 147, 255, 0.26) 100%)',
        'gradient-4': ' radial-gradient(40.55% 50% at 50% 50%, rgba(24, 10, 23) 0%, rgba(18, 5, 21) 100%)',
        'linear-gradient': ' linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
        'light-gradient': ' linear-gradient(90deg, rgba(255, 62, 61, 0.1) 0%, rgba(70, 109, 253, 0.1) 100%)',
      },
      width: {
        "9/20": "45%",
        "11/20": "55%",
      },
      dropShadow: {
        glow: "0px 10px 100px rgba(255, 172, 172, 0.12)",
        currencyLogo: '0px 10px 100px rgba(255, 172, 172, 0.12)',

      },

      colors: {
        specialGray: "#304053",
        lightBlue: "#81A9D8",
        borderGray: "rgba(124,147,255,.26)",
        golden: "##f99b0e",
          purple: '#a755dd',
        blue: '#FF3E3D',
        pink: '#466DFD',
        green: '#7cff6b',
        red: '#ff3838',
        yellow: '#FF3E3D',
        orange: 'radial-gradient(50% 50% at 50% 50%, rgba(239, 238, 238, 0.115) 0%, rgba(255, 255, 255, 0.065) 100%)',
        'border-color': '#2C2E56',
        'opaque-blue': '#FF3E3D',
        'opaque-pink': '#466DFD',
        'pink-red': '#FE5A75',
        'light-brown': '#FF3E3D',
        'light-yellow': '#FFD166',
        'cyan-blue': '#0993EC',
        'dark-pink': '#221825',
        'dark-blue': '#07030938',
        'dark-1000': '#0D0415',
        'dark-900': '#0D0E21',
        'dark-850': '#1d1e2c',
        'dark-800': '#202231',
        'dark-700': '#2E3348',
        'dark-600': '#1C2D49',
        'dark-500': '#223D5E',
        'dark-400': '#466dfd0d',
        'low-emphesis': '#575757',
        primary: '#BFBFBF',
        'primary-light': '#bfbfbf33',
        secondary: '#81A9D8',
        'high-emphesis': '#E3E3E3',
      },
      borderRadius: {
        none: '0',
        px: '1px',
        DEFAULT: '0.625rem',
      },
      boxShadow: {
        swap: '0px 50px 250px -47px rgba(39, 176, 230, 0.29)',
        liquidity: '0px 50px 250px -47px rgba(123, 97, 255, 0.23)',
        'pink-glow': '0px 57px 90px -47px rgba(250, 82, 160, 0.15)',
        'blue-glow': '0px 57px 90px -47px rgba(39, 176, 230, 0.17)',
        'pink-glow-hovered': '0px 57px 90px -47px rgba(250, 82, 160, 0.30)',
        'blue-glow-hovered': '0px 57px 90px -47px rgba(39, 176, 230, 0.34)',
      },
      padding: {
        px: '1px',
        '3px': '3px',
      },
       minHeight: {
        empty: '128px',
        cardContent: '230px',
        fitContent: 'fit-content',
      },
       minWidth: {
        5: '1.25rem',
      },
        screens: {
        '3xl': '1600px',
      },
        animation: {
        ellipsis: 'ellipsis 1.25s infinite',
        'spin-slow': 'spin 2s linear infinite',
        fade: 'opacity 150ms linear',
      },
         keyframes: {
        ellipsis: {
          '0%': { content: '"."' },
          '33%': { content: '".."' },
          '66%': { content: '"..."' },
        },
        opacity: {
          '0%': { opacity: 0 },
          '100%': { opacity: 100 },
        },
      },
    },
  },
  variants: {
     linearBorderGradients: ['responsive', 'hover', 'dark'], // defaults to ['responsive']
    extend: {
      backgroundColor: ['checked', 'disabled'],
      backgroundImage: ['hover', 'focus'],
      borderColor: ['checked', 'disabled'],
      cursor: ['disabled'],
      opacity: ['hover', 'disabled'],
      placeholderColor: ['hover', 'active'],
      ringWidth: ['disabled'],
      ringColor: ['disabled'],
    },
  },
  plugins: [
    require('tailwindcss-border-gradient-radius'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.header-border-b': {
          background: 'linear-gradient(to right, #FF3E3D 0%, rgba(250, 82, 160, 0.2) 100%) left bottom no-repeat',
          backgroundSize: '100% 1px',
        },
      })
    }),
  ],
};
