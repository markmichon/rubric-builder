import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { find } from 'lodash-es'
import styled from '@emotion/styled'
import Nav from '../components/Nav'
import { connect } from 'react-redux'
import { getFullRubric } from '../reducers'
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

function TopicRow({ name, weight, id, criteria, handleUpdate }) {
  const handleChange = (criteria, e) => {
    if (e.target.checked && e.target.value) {
      const grade = weight * (criteria.weight / 100)
      handleUpdate({
        topic: id,
        criteria,
        grade,
      })
    }
  }
  return (
    <>
      <StyledRow>
        <div>{name}</div>
        <div>{weight}</div>
        {criteria.map(criteria => (
          <SelectableItem key={`${id}-${criteria.id}`}>
            <input
              type="radio"
              name={id}
              value={`${id}-${criteria.id}`}
              id={`${id}-${criteria.id}`}
              // disabled={criteria.disabled}
              onChange={e => handleChange(criteria, e)}
            />
            <label htmlFor={`${id}-${criteria.id}`}>
              {criteria.description}
            </label>
          </SelectableItem>
        ))}
      </StyledRow>
    </>
  )
}
function Rubric({ rubric }) {
  const [topicGrades, setTopicGrades] = useState([])
  const [finalGrade, setFinalGrade] = useState(0)

  useEffect(() => {
    calculateGrade(topicGrades)
  }, [topicGrades])

  const handleRowUpdate = payload => {
    const filtered = topicGrades.filter(grade => grade.topic !== payload.topic)

    setTopicGrades([...filtered, payload])
    calculateGrade(topicGrades)
  }
  const calculateGrade = grades => {
    if (grades) {
      const grade = grades.reduce((total, topic) => total + topic.grade, 0)
      setFinalGrade(grade)
    }
  }

  return (
    <div>
      <h1>Rubric</h1>
      <Nav />
      {rubric && (
        <>
          <StyledRow>
            <Heading>Topic</Heading>
            <Heading>Weight</Heading>
            {rubric.levels.map(l => (
              <Heading key={l.di}>{l.name}</Heading>
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
      )}
    </div>
  )
}

const mapState = state => ({
  rubric: getFullRubric(state),
})
export default connect(mapState)(Rubric)
