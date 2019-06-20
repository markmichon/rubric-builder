/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useDebouncedCallback } from 'use-debounce'
import { css, jsx } from '@emotion/core'
import styled from '@emotion/styled'
import nanoid from 'nanoid'
import { connect } from 'react-redux'
import Nav from '../components/Nav'
import RubricRow from '../components/RubricRow'
import { getTopics, getFullRubric } from '../reducers'
import {
  addLevel,
  editLevel,
  deleteLevel,
  editTopic,
  editCriteria,
  addTopic,
} from '../actions'

const DEBOUNCE_TIME = 300

const Label = styled.label`
  display: block;
  font-size: 1em;
  font-weight: 600;
  color: hsl(0, 0%, 30%);
  margin-bottom: 0.25rem;
`
const TextInput = styled.input`
  display: block;
  font-size: 1em;
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
`

const Fieldset = styled.fieldset`
  border: none;
  padding: 0.5rem;
  /* box-shadow: 0 0 8px #333; */
  border: 2px solid hsl(0, 0%, 90%);
  /* border-radius: 4px; */
`

const CriteriaFieldset = styled.div`
  border: none;
  background-color: HSL(0, 0%, 100%);
  border-radius: 4px;
  display: grid;
  grid-template-rows: auto 1fr;
`

const CriteriaLabel = styled.label`
  display: block;
  font-size: 1em;
  font-weight: 600;
  background-color: HSL(209, 77%, 12%);
  color: hsl(0, 0%, 100%);
  padding: 0.5rem;
  border-radius: 4px 4px 0 0;
`

const TextArea = styled.textarea`
  background-color: HSL(210, 23%, 90%);
  border: none;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  display: block;
  resize: none;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 4px;
  height: 8em;
`

const renderLevels = (levels, update, deleteLevel) => {
  return levels.map(({ id, name, weight }, idx) => {
    return (
      <Fieldset key={`level-${id}`}>
        <button type="button" onClick={e => deleteLevel(id)}>
          X
        </button>
        <Label htmlFor={`lName-${id}`}>Tier Name</Label>
        <TextInput
          type="text"
          id={`lName-${id}`}
          name={`lName-${id}`}
          defaultValue={name}
          onChange={e =>
            update({ id: id, field: 'name', value: e.target.value })
          }
        />
        <Label htmlFor={`lWeight-${id}`}>Weight</Label>
        <TextInput
          type="text"
          id={`lWeight-${id}`}
          name={`lWeight-${id}`}
          defaultValue={weight}
          onChange={e =>
            update({ id: id, field: 'weight', value: Number(e.target.value) })
          }
        />
      </Fieldset>
    )
  })
}

const SAVE_RUBRIC = gql`
  mutation makeRubric($rubricData: RubricInput) {
    makeRubric(rubric: $rubricData) {
      name
      id
    }
  }
`

function Builder({ levels, topics, criteria, finalRubric, dispatch }) {
  const [output, setOutput] = useState(null)
  const [makeRubric, { error, loading, data }] = useMutation(SAVE_RUBRIC, {
    variables: {
      rubricData: finalRubric,
    },
  })
  useEffect(() => {
    // Reconcile levels with topics
    // TODO: Move up the tree to fire on app load rather than builder load
    dispatch({
      type: 'RECONCILE_CRIT',
      payload: { levels, topics },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const save = () => {
    setOutput({
      finalRubric,
    })
    makeRubric()
  }

  const processLevelForm = e => {
    e.preventDefault()
    dispatch(
      addLevel({
        id: nanoid(),
        name: '',
        weight: '',
      })
    )
  }

  const [handleUpdateLevel] = useDebouncedCallback(({ id, field, value }) => {
    dispatch(
      editLevel({
        ...levels.filter(level => level.id === id)[0],
        [field]: value,
      })
    )
  }, DEBOUNCE_TIME)

  const [updateTopic] = useDebouncedCallback(({ id, field, value }) => {
    dispatch(
      editTopic({
        ...topics.filter(topic => topic.id === id)[0],
        [field]: value,
      })
    )
  }, DEBOUNCE_TIME)

  const [handleDeleteLevel] = useDebouncedCallback(id => {
    dispatch(
      deleteLevel({
        id,
      })
    )
  }, DEBOUNCE_TIME)

  const [handleDeleteTopic] = useDebouncedCallback(id => {
    dispatch({
      type: 'DELETE_TOPIC',
      payload: { id },
    })
  }, DEBOUNCE_TIME)

  const [debounceDispatch] = useDebouncedCallback(fn => {
    dispatch(fn)
  }, DEBOUNCE_TIME)

  return (
    <div>
      <h1>Builder</h1>
      <Nav />
      <form onSubmit={processLevelForm}>
        <p>Create Achievement Levles</p>
        <div
          css={css`
            display: flex;
          `}
        >
          {renderLevels(levels, handleUpdateLevel, handleDeleteLevel)}
          <button type="submit">Add Another Achievement Level</button>
        </div>
      </form>
      <section
        css={css`
          background-color: HSL(210, 23%, 95%);
          padding-top: 1rem;
        `}
      >
        {/* <h2>Topics</h2> */}
        <RubricRow template={`repeat(${levels.length + 1}, 1fr)`}>
          <div>Topics</div>
          {levels.map(level => (
            <div key={`level-${level.id}`}>{level.name}</div>
          ))}
        </RubricRow>
        <form>
          {topics.map(topic => (
            <RubricRow
              key={topic.id}
              template={`repeat(${levels.length + 1}, 1fr)`}
            >
              <Fieldset>
                <button
                  type="button"
                  onClick={e => handleDeleteTopic(topic.id)}
                >
                  Delete Topic
                </button>
                <Label htmlFor={`tName-${topic.id}`}>Topic</Label>
                <TextInput
                  type="text"
                  id={`tName-${topic.id}`}
                  name={`tName-${topic.id}`}
                  defaultValue={topic.name}
                  onChange={e =>
                    updateTopic({
                      field: 'name',
                      id: topic.id,
                      value: e.target.value,
                    })
                  }
                />
                <Label htmlFor={`tWeight-${topic.id}`}>Weight</Label>
                <TextInput
                  type="text"
                  id={`tWeight-${topic.id}`}
                  name={`tWeight-${topic.id}`}
                  defaultValue={topic.weight}
                  onChange={e =>
                    updateTopic({
                      field: 'weight',
                      id: topic.id,
                      value: Number(e.target.value),
                    })
                  }
                />
              </Fieldset>
              {criteria[topic.id].map(criteria => (
                <CriteriaFieldset key={criteria.id}>
                  <CriteriaLabel htmlFor={criteria.id}>Criteria</CriteriaLabel>
                  <label htmlFor={`${topic.id}-${criteria.id}-disabled`}>
                    Disabled
                  </label>
                  <input
                    type="checkbox"
                    id={`${topic.id}-${criteria.id}-disabled`}
                    checked={criteria.disabled}
                    onChange={e =>
                      dispatch(
                        editCriteria({
                          id: topic.id,
                          criteria: {
                            ...criteria,
                            disabled: e.target.checked ? true : false,
                          },
                        })
                      )
                    }
                  />
                  <TextArea
                    id={criteria.id}
                    defaultValue={criteria.description}
                    disabled={criteria.disabled}
                    onChange={e =>
                      debounceDispatch(
                        editCriteria({
                          id: topic.id,
                          criteria: {
                            ...criteria,
                            description: e.target.value,
                          },
                        })
                      )
                    }
                  />
                </CriteriaFieldset>
              ))}
            </RubricRow>
          ))}
          <button
            type="button"
            onClick={() =>
              dispatch(addTopic({ id: nanoid(), name: '', weight: '' }))
            }
          >
            Add new Topic
          </button>
        </form>
      </section>
      <hr />
      <button onClick={save}>Save Rubric</button>
      <hr />
      {output && <textarea value={`${JSON.stringify(output)}`} readOnly />}
      {data && <p>Rubric Successfully Saved 👍</p>}
    </div>
  )
}

const mapStateToProps = state => ({
  levels: state.levels,
  topics: getTopics(state),
  criteria: state.criteria,
  finalRubric: getFullRubric(state),
})
export default connect(mapStateToProps)(Builder)
