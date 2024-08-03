import { createTheme } from '@mui/material/styles';
import { alpha, PaletteMode, responsiveFontSizes } from '@mui/material';
const getDesignSystem = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        common: {
          black: '#fff',
          white: '#fff',
          border: '#D8DAF5',
        },
        primary: {
          dark: '#4767FB',
          main: '#466DFD',
        },
        secondary: {
          main: '#FF3E3D',
        },
        text: {
          primary: '#000',
          secondary: '#000',
          light: '#304053',
          success: '#348F50'

        },
        background: {
          default: '#fff',
        },
      }
      : {
        common: {
          black: '#000',
          white: '#fff',
          border: '#2C2E56',
        },
        primary: {
          dark: '#4767FB',
          main: '#466DFD',
        },
        secondary: {
          main: '#FF3E3D',
        },
        text: {
          primary: '#fff',
          secondary: '#81A9D8',
          light: '#81A9D8',
          success: '#348F50'
        },
        background: {
          default: '#020203',
          paper: '#0d1324',
        },
      }),
  },

  typography: {
    // eslint-disable-next-line quotes
    fontFamily: "'Poppins', 'sans-serif'",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    lineHeight: 1.5,
    allVariants: {
      color: mode === 'light' ? '#000' : '#fff',
    },
    h1: {
      fontSize: '32px',
      fontWeight: 700,
    },

    h2: {
      fontSize: '14px',
      color: 'text.light',
    },
    h3: {
      fontSize: '20px',
      background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
    },
    h4: {
      fontSize: '16px',
      background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: '500',
    },
    h5: {
      fontSize: '24px',
      fontWeight: 700,
    },
    h6: {
      fontSize: '20px',
      fontWeight: 600,
    },
    body2: {
      fontSize: '16px',
      fontWeight: 500,
    },
    caption: {
      fontSize: '14px',
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 15,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant !== 'outlined' && {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }),
          ...(ownerState.variant === 'outlined' && {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${theme.palette.common.border} `,
          }),
          boxShadow: 'none',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState.variant === 'outlined' && {
            '& input': {
              padding: theme.spacing(2.5),
              color: theme.palette.text.light,
            },
            '& input::-webkit-input-placeholder': {
              color: theme.palette.text.light,
              opacity: 1,
            },
            '& input::-moz-placeholder': {
              color: theme.palette.text.light,
              opacity: 1,
            },
            '& input:-ms-input-placeholder': {
              color: theme.palette.text.light,
              opacity: 1,
            },
            '& input:-moz-placeholder': {
              color: theme.palette.text.light,
              opacity: 1,
            },
            '& input::placeholder': {
              color: theme.palette.text.light,
              opacity: 1,
            },
            '& fieldset': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderColor: theme.palette.common.border,
            },
            '&:hover fieldset': {
              borderColor: `${theme.palette.common.border} !important`,
            },
            '&.Mui-focused fieldset': {
              borderColor: `${theme.palette.common.border} !important`,
            },
          }),
        }),
      },
    },
  },
});
const theme = responsiveFontSizes(
  createTheme({
    palette: {
      // alternate: {
      //   main: '',
      //   dark: '#152951',
      // },
      // cardShadow: 'rgba(71, 103, 251, 0.07);',
      common: {
        // cardBorder: '#81A9D8',
        // cardbg2: 'rgba(71, 103, 251, 0.1)',
        black: '#fff',
        white: '#fff',
        // blue: '#81A9D8',
        // DarkBlue: '#466DFD',
        // smText: '#81A9D8',
      },
      primary: {
        main: '#4767FB',
      },
      text: {
        primary: '#fff',
        secondary: '#fff',
        // light: '#81A9D8',
      },
      // mode: 'dark',
      background: {
        default: '#000',
        // level1: 'rgba(255, 255, 255, 0.05)',
      },
    },

    typography: {
      // eslint-disable-next-line quotes
      fontFamily: "'Poppins', 'sans-serif'",
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,
      // lineHeight: 1.5,

      body1: {
        fontSize: '14px',
        fontWeight: 'bolder',
        color: '#fff',

        background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      body2: {
        fontSize: '14px',
        fontWeight: 'medium'
      },
      h1: {
        fontSize: '32px',
        fontWeight: 'bolder',
      },

      h2: {
        fontSize: '14px',
        color: '#81A9D8',
      },
      h3: {
        fontSize: '20px',
        color: '#fff',
        background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
      },
      h4: {
        fontSize: '16px',
        color: '#fff',
        background: 'linear-gradient(90deg, #FF3E3D 0%, #466DFD 100%)',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      h5: {
        fontSize: '24px',
        color: '#fff',
      },
      h6: {
        fontSize: '20px',
        color: '#fff',
      },
    },

    // shape: {
    //   borderRadius: 15,
    // },
    components: {},
  }),
);

export default getDesignSystem;
