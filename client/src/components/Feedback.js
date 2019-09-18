import React, { useState, useEffect, useRef } from 'react'
import { TextArea, Box } from './radicals'
import { useCopyToClipboard } from 'react-use'

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

let structure = [
  {
    topic: 'Topic 1',
    max: 50,
    score: 50,
    comment: 'Great work!',
    level: 'Excellent',
    criteria: 'Completed all necessary items',
  },
  {
    topic: 'Topic 2',
    max: 20,
    score: 10,
    comment: 'Great work!',
    level: 'Good',
    criteria: 'Completed all necessary items',
  },
  {
    topic: 'Topic 3',
    max: 30,
    score: 30,
    comment: 'Great work!',
    level: 'Excellent',
    criteria: 'Completed all necessary items',
  },
]

function process(data) {
  let grade = 0
  let max = 0
  const headers = `
    <thead>
      <tr>
        <th>Topic Area</th>
        <th>Grade</th>
        <th>Comments</th>
      </tr>
    </thead>`

  const rows = data.map(row => {
    grade += row.score
    max += row.max
    return `
    <tr>
      <td>${row.topic}</td>
      <td>${row.level} (${row.score}/${row.max})</td>
      <td>${row.comment}</td>
    </tr>`
  })

  return `
    <table>
      ${headers}
      ${rows.join('')}
      <tfoot>
        <tr>
          <td>Final Grade</td><td>${grade}/${max}</td>
        </tr>
      </tfoot>
    </table>
  `
}

function Feedback({ data }) {
  const [output, setOutput] = useState('')
  const [copied, copyToClipboard] = useCopyToClipboard()
  const textareaRef = useRef(null)

  useEffect(() => {
    setOutput(process(data))
  }, [data])

  const handleCopy = e => {
    textareaRef.current.select()
    Document.execCommand('copy')
  }
  return (
    <Box as="section">
      <button onClick={() => copyToClipboard(output)}>Copy to Clipboard</button>
      {copied.value ? '👍' : ''}
      <TextArea ref={textareaRef} height="300px" readOnly value={output} />
    </Box>
  )
}

export default Feedback
