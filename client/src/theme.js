import { size } from 'styled-system'

const colors = {
  text: 'hsl(212,5%,20%)',
  black: 'hsl(212,5%,20%)',
  white: '#fff',
  textLight: 'hsl(212,81%,20%)',
  background: '#fff',
  primary: 'HSL(212, 61%, 48%)',
  secondary: 'HSL(212, 70%, 20%)',
  muted: 'hsl(212,5%,90%)',
}

const fontSizes = [12, 14, 16, 20, 24, 32, 48]
fontSizes.body = fontSizes[2]

const space = [0, 4, 8, 16, 32, 64]

const sizes = ['.675em', '1em', '1.25em', '1.5em', '2em']

sizes.small = sizes[0]
sizes.regular = sizes[1]
sizes.large = sizes[2]

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
  space,
  radii,
  buttons,
  sizes,
}
