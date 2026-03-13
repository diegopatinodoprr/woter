import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const WoterBlueGrayPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef4ed',
      100: '#dfe8e8',
      200: '#c9d6de',
      300: '#b3c3d3',
      400: '#8da9c4',
      500: '#134074',
      600: '#13315c',
      700: '#0b2545',
      800: '#091e38',
      900: '#07172b',
      950: '#050f1d'
    },
    colorScheme: {
      light: {
        surface: {
          0: '#eef4ed',
          50: '#e8efec',
          100: '#dce6e8',
          200: '#cad8de',
          300: '#b1c5d1',
          400: '#8da9c4',
          500: '#6d8aaa',
          600: '#4f6e90',
          700: '#13315c',
          800: '#0f2a4f',
          900: '#0b2545',
          950: '#081a33'
        }
      },
      dark: {
        surface: {
          0: '#eef4ed',
          50: '#8da9c4',
          100: '#7a98b6',
          200: '#5c7ea1',
          300: '#486b92',
          400: '#325883',
          500: '#134074',
          600: '#13315c',
          700: '#10294f',
          800: '#0b2545',
          900: '#081d37',
          950: '#061529'
        }
      }
    }
  }
});

