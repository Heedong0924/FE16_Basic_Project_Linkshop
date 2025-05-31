export const ColorTypes = {
  PRIMARY: 'pri',
  ERROR: 'err',

  SECONDARY_BLACK: 'secBlack',
  SECONDARY_GRAY_100: 'secGray100',
  SECONDARY_GRAY_200: 'secGray200',
  SECONDARY_GRAY_300: 'secGray300',

  SECONDARY_WHITE_50: 'secWhite50',
  SECONDARY_WHITE_100: 'secWhite100',
};

export const FontTypes = {
  BOLD20: 'bold20',
  MEDIUM18: 'medium18',
  REGULAR18: 'regular18',
  SEMIBOLD17: 'semibold17',
  MEDIUM17: 'medium17',
  REGULAR17: 'regular17',
  BOLD16: 'bold16',
  SEMIBOLD16: 'semibold16',
  MEDIUM16: 'medium16',
  REGULAR16: 'regular16',
  SEMIBOLD15: 'semibold15',
  MEDIUM15: 'medium15',
  SEMIBOLD14: 'semibold14',
};

const theme = {
  colors: {
    pri: '#3e45ec',
    err: '#fb545b',
    secBlack: '#14151a',
    secWhite50: '#ffffff',
    secWhite100: '#fafafb',
    secGray100: '#dddcdf',
    secGray200: '#a2a2ac',
    secGray300: '#888790',
  },

  fonts: {
    bold20: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    medium18: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    regular18: {
      fontSize: '1.125rem',
      fontWeight: 400,
    },
    semibold17: {
      fontSize: '1.063rem',
      fontWeight: 600,
    },
    medium17: {
      fontSize: '1.063rem',
      fontWeight: 500,
    },
    regular17: {
      fontSize: '1.063rem',
      fontWeight: 400,
    },
    bold16: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    semibold16: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    medium16: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    regular16: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    semibold15: {
      fontSize: '0.938rem',
      fontWeight: 600,
    },
    medium15: {
      fontSize: '0.938rem',
      fontWeight: 500,
    },
    semibold14: {
      fontSize: '0.875rem',
      fontWeight: 600,
    },
  },
};

export default theme;
