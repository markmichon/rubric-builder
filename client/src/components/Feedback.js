import React, { useState } from 'react'
import { TextArea } from './radicals'

let exampleOutput = `
<table>
  <thead>
    <tr>
      <th>Topic Area</th>
      <th>Grade</th>
      <th>Comments</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Development Environment</td>
      <td>Excellent</td>
      <td>Great work keeping the dev server going!</td>
    </tr>
  </tbody>
</table>

`

function Feedback(props) {
  const [output, setOutput] = useState(exampleOutput)
  return (
    <TextArea height="300px" readOnly>
      {output}
    </TextArea>
  )
}

export default Feedback
