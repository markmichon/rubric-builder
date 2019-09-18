/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { css, jsx } from '@emotion/core'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import styled from '@emotion/styled'
import { Link } from '@reach/router'
import Nav from '../components/Nav'
import RubricRow from '../components/RubricRow'
import Feedback from '../components/Feedback'
const gridItem = css`
  padding: 0.5em;
`
const borderStyle = `1px solid #ccc`

const CommentContainer = styled.div`
  grid-column: 2 / -1;
  grid-row: 2;
  padding: 1rem;
  border-right: ${borderStyle};
  font-weight: bold;
`

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr repeat(4, 3fr);
`

const Headings = props => (
  <div
    css={css`
      display: grid;
      grid-template-columns: ${props.template};
      background-color: HSL(209, 77%, 8%);
      color: white;
    `}
    {...props}
  />
)

const Heading = styled.div`
  ${gridItem}
  padding: 1rem;
`

const NonInteractiveItem = styled.div`
  box-sizing: border-box;
  display: block;
  height: 100%;
  padding: 1rem;
  /* border-bottom: ${borderStyle}; */
`

const SelectableItem = styled.div`
  position: relative;
  border-bottom: ${borderStyle};

  &:not(:last-of-type) {
    border-right: ${borderStyle};
  }

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
    padding: 1rem;
  }

  input:disabled + label {
    background-color: #efefef;
  }

  input:checked + label {
    background-color: lightblue;
  }
  input:focus + label {
    outline: 1px solid blue;
  }
`

function TopicRow({ name, weight, id, criteria, handleUpdate }) {
  const [state, setState] = useState({
    id,
    topic: name,
    max: weight,
    score: 0,
    level: criteria.levelName,
    comment: '',
  })
  const handleChange = (criteria, e) => {
    if (e.target.checked && e.target.value) {
      const grade = weight * (criteria.weight / 100)
      const payload = {
        ...state,
        max: weight,
        score: grade,
        level: criteria.levelName,
      }
      handleUpdate(payload)
      setState(payload)
    }
  }

  const handleComment = e => {
    const payload = {
      ...state,
      comment: e.target.value,
    }
    handleUpdate(payload)
    setState(payload)
  }
  return (
    <RubricRow
      template={`2fr repeat(${criteria.length}, 2fr)`}
      css={css`
        gap: 0;
        border-left: ${borderStyle};
        border-bottom: ${borderStyle};
      `}
    >
      <NonInteractiveItem
        css={css`
          border-right: ${borderStyle};
          grid-row: 1/ 3;
          font-weight: bold;
        `}
      >
        <p>
          {name}
          {weight}
        </p>
      </NonInteractiveItem>
      {criteria.map(criteria => (
        <SelectableItem key={`${id}-${criteria.id}`}>
          <input
            type="radio"
            name={id}
            value={`${id}-${criteria.id}`}
            id={`${id}-${criteria.id}`}
            disabled={criteria.disabled}
            onChange={e => handleChange(criteria, e)}
          />
          <label htmlFor={`${id}-${criteria.id}`}>{criteria.description}</label>
        </SelectableItem>
      ))}
      <CommentContainer>
        <label htmlFor="">Comment:</label>
        <input type="text" onChange={handleComment} />
      </CommentContainer>
    </RubricRow>
  )
}
function Rubric({ rubric }) {
  const [topicGrades, setTopicGrades] = useState([])
  const [finalGrade, setFinalGrade] = useState(0)

  useEffect(() => {
    calculateGrade(topicGrades)
  }, [topicGrades])

  const handleRowUpdate = payload => {
    const filtered = topicGrades.filter(row => row.id !== payload.id)

    setTopicGrades([...filtered, payload])
    // calculateGrade(topicGrades)
  }
  const calculateGrade = grades => {
    if (grades) {
      const grade = grades.reduce((total, topic) => total + topic.score, 0)
      setFinalGrade(grade)
    }
  }

  return (
    <div>
      <Nav />
      {rubric ? (
        <>
          <h2>
            {rubric.name}{' '}
            <Link to={`/builder/${rubric.id}`} state={{ editing: true }}>
              Edit
            </Link>
          </h2>
          <Headings template={`2fr repeat(${rubric.levels.length}, 2fr)`}>
            <NonInteractiveItem />
            {rubric.levels.map(l => (
              <Heading key={l.id}>{l.name}</Heading>
            ))}
          </Headings>
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
          {topicGrades.length !== rubric.topics.length ? (
            <p>Finish grading to view output</p>
          ) : (
            <Feedback data={topicGrades} />
          )}
        </>
      ) : (
        <p>No rubric found</p>
      )}
    </div>
  )
}

const GET_RUBRIC_BY_ID = gql`
  query rubric($id: String!) {
    rubric(id: $id) {
      id
      name
      levels {
        id
        name
        weight
      }
      topics {
        id
        name
        weight
        criteria {
          id
          description
          disabled
          weight
          levelName
        }
      }
    }
  }
`

function RubricQueryWrapper({ rubricId }) {
  const { data, error, loading } = useQuery(GET_RUBRIC_BY_ID, {
    variables: { id: rubricId },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  return <Rubric rubric={data.rubric} />
}

export default RubricQueryWrapper
