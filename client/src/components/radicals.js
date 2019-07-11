import styled from '@emotion/styled'
import {
  compose,
  space,
  color,
  layout,
  grid,
  flexbox,
  typography,
  border,
  variant,
  buttonStyle,
} from 'styled-system'
import shouldForwardProp from '@styled-system/should-forward-prop'
import { Link as RouterLink } from '@reach/router'
import theme, { defaults } from '../theme'
const Box = styled.div(
  {
    boxSizing: 'border-box',
    minWidth: 0,
  },
  compose(
    space,
    color,
    layout,
    grid,
    flexbox,
    border
  )
)

Box.defaultStyles = {
  m: 0,
  p: 0,
}

const Text = styled.p({})

const baseInputStyles = `
  font-family: inherit;
  background-color: inherit;
  font-size: inherit;
`

const TextInput = styled.input`
  ${baseInputStyles}
  font-size: 1em;
  border-radius: 4px;
  outline: none;
  vertical-align: middle;
  border: 1px solid ${theme.colors.muted};

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }

  ${compose(
    space,
    typography,
    color,
    layout,
    border
  )}
`

TextInput.defaultProps = {
  display: 'block',
  padding: 1,
  mb: 3,
}

const TextArea = styled.textarea(
  {
    fontSize: 'inherit',
    fontFamily: 'inherit',
    width: '100%',
    overflow: 'auto',
  },
  compose(
    space,
    typography,
    color,
    layout,
    border
  )
)

TextArea.defaultProps = {
  borderRadius: 1,
}

const linkStyles = variant({
  scale: 'links',
  prop: 'variant',
})

const Link = styled(RouterLink)`
  text-decoration: none;
  display: inline-block;
  ${compose(
    space,
    typography,
    color
  )}
  ${linkStyles}
`

Link.defaultProps = {
  color: 'primary',
}

const Button = styled('button', { shouldForwardProp })(
  {
    lineHeight: 1,
    outline: 'none',
  },
  compose(
    color,
    typography,
    space,
    border,
    layout
  ),
  buttonStyle
)

Button.defaultProps = {
  ...defaults.button,
  border: 'none',
}

const ButtonLink = styled(RouterLink, { shouldForwardProp })(
  {
    textDecoration: 'none',
    outline: 'none',
    lineHeight: 1,
  },
  compose(
    color,
    typography,
    space,
    border,
    layout
  ),
  buttonStyle
)

ButtonLink.defaultProps = {
  ...defaults.button,
  border: 'none',
}

const H = styled.h1`
${typography}
${color}
${space}
`

H.defaultProps = {
  fontWeight: 'bold',
  color: 'black',
  fontSize: 4,
}

const Label = styled.label(
  {
    fontWeight: '600',
  },
  compose(
    typography,
    color,
    space
  )
)

Label.defaultProps = {
  color: 'text',
}

export { Box, Text, TextInput, Link, Button, ButtonLink, H, Label, TextArea }
