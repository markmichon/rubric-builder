/** @jsx jsx */
import { css, jsx } from '@emotion/core'

const RubricRow = props => {
  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: `${props.template}`,
        gap: '1rem',
      }}
      {...props}
    />
  )
}

export default RubricRow
