const heading = {
  fontFamily: 'heading',
  fontWeight: 'heading',
  lineHeight: 'heading',
  mt: 0,
  mb: 2,
}

const colors = {
  black: 'hsl(212,5%,20%)',
  white: '#fff',
  textLight: 'hsl(212,81%,20%)',
  text: '#000',
  background: '#fff',
  primary: 'hsl(212,80%,50%)',
  secondary: 'hsl(212,90%,30%)',
  accent: 'hsl(170,80%,40%)',
  muted: 'hsl(212,30%,90%)',
  warning: 'hsl(49, 84%, 63%)',
  danger: 'hsl(10, 80%, 60%)',
}

const fontSizes = [12, 14, 16, 20, 24, 32, 48]
fontSizes.body = fontSizes[2]

const sizes = []
const space = [0, 4, 8, 16, 32, 64]

const scale = ['.675em', '1em', '1.25em', '1.5em', '2em']

scale.small = scale[0]
scale.regular = scale[1]
scale.large = scale[2]

space.base = space[2]
space.compact = space[1]

const radii = [0, 2, 4, 8]

const links = {
  unstyled: {
    fontWeight: 'bold',
    color: colors.primary,

    '&:hover': {
      color: colors.secondary,
    },
  },
}

const buttons = {
  primary: {
    // color: colors.white,
    // backgroundColor: colors.primary,
  },
  secondary: {
    color: colors.textLight,
    backgroundColor: colors.muted,
  },
  warning: {
    color: colors.textLight,
    backgroundColor: colors.warning,
  },
  danger: {
    color: colors.textLight,
    backgroundColor: colors.danger,
  },
}

export const defaults = {
  button: {
    p: 2,
    backgroundColor: 'primary',
    color: 'white',
    fontWeight: 400,
    lineHeight: 1,
    borderRadius: 2,
  },
  heading: {
    fontWeight: 600,
    lineHeight: 1,
    mb: 2,
  },
}

export default {
  colors,
  fontSizes,
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125,
  },
  letterSpacings: {
    body: 'normal',
    caps: '0.2em',
  },
  space,
  radii,
  buttons,
  sizes,
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
    },
    h1: {
      ...heading,
      fontSize: 5,
    },
    h2: {
      ...heading,
      fontSize: 4,
    },
    h3: {
      ...heading,
      fontSize: 3,
    },
    h4: {
      ...heading,
      fontSize: 2,
    },
  },
}
