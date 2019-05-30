import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { find } from 'lodash-es'
import styled from '@emotion/styled'
import { getRubric } from '../api'
const gridItem = css`
  padding: 0.5em;
`

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr repeat(4, 3fr);
`

const Heading = styled.div`
  ${gridItem}
`

const SelectableItem = styled.div`
  position: relative;
  input {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
  }
  label {
    box-sizing: border-box;
    display: block;
    height: 100%;
    padding: 0.5em;
  }

  input:disabled + label {
    background-color: #efefef;
  }

  input:checked + label {
    background-color: lightblue;
  }
  input:focus + label {
    outline: 1px solid #333;
  }
`

function TopicRow({ name, weight, id, options, handleUpdate }) {
  const handleChange = e => {
    if (e.target.checked && e.target.value) {
      const item = find(options, { id: e.target.value })
      const grade = weight * (item.weight / 100)
      handleUpdate({
        topic: id,
        item,
        grade,
      })
    }
  }
  return (
    <>
      <StyledRow>
        <div>{name}</div>
        <div>{weight}</div>
        {options.map(option => (
          <SelectableItem key={option.id}>
            <input
              type="radio"
              name={id}
              value={option.id}
              id={option.id}
              disabled={option.disabled}
              onChange={handleChange}
            />
            <label htmlFor={option.id}>{option.description}</label>
          </SelectableItem>
        ))}
      </StyledRow>
    </>
  )
}
export default function Rubric() {
  const [rubric, setRubric] = useState(null)
  const [topicGrades, setTopicGrades] = useState([])
  const [finalGrade, setFinalGrade] = useState(0)

  useEffect(() => {
    let rubric = getRubric()
    setRubric(rubric)
    calculateGrade(topicGrades)
  }, [topicGrades])

  const handleRowUpdate = payload => {
    const filtered = topicGrades.filter(grade => grade.topic !== payload.topic)

    setTopicGrades([...filtered, payload])
    calculateGrade(topicGrades)
  }
  const calculateGrade = grades => {
    const grade = grades.reduce((total, topic) => total + topic.grade, 0)
    setFinalGrade(grade)
  }

  return (
    rubric && (
      <>
        <StyledRow>
          {rubric.headings.map((r, i) => (
            <Heading key={i}>{r}</Heading>
          ))}
        </StyledRow>
        {rubric.topics.map(topic => {
          return (
            <TopicRow
              key={topic.id}
              {...topic}
              handleUpdate={handleRowUpdate}
            />
          )
        })}
        <div>Final Grade: {finalGrade}</div>
      </>
    )
  )
}
