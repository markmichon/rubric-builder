/** @jsx jsx */
import React, { useState, useEffect, useReducer } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { useDebouncedCallback } from 'use-debounce'
import { css, jsx } from '@emotion/core'
import styled from '@emotion/styled'
import nanoid from 'nanoid'
import Nav from '../components/Nav'
import RubricRow from '../components/RubricRow'
import { H, TextInput, Box, Button } from '../components/radicals'

const DEBOUNCE_TIME = 300

const Label = styled.label`
  display: block;
  font-size: 1em;
  font-weight: 600;
  color: hsl(0, 0%, 30%);
  margin-bottom: 0.25rem;
`
// const TextInput = styled.input`
//   display: block;
//   font-size: 1em;
//   &:not(:last-of-type) {
//     margin-bottom: 0.5rem;
//   }
// `

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

const SAVE_RUBRIC = gql`
  mutation saveRubric($rubricData: RubricInput) {
    saveRubric(rubric: $rubricData) {
      success
    }
  }
`
// const UPDATE_RUBRIC = gql`
//   mutation ()
// `

const baseReducer = name => (state, { type, payload }) => {
  switch (type) {
    case `ADD_${name}`:
      return [...state, { ...payload }]
    case `DELETE_${name}`:
      return state.filter(item => item.id !== payload.id)
    case `EDIT_${name}`:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...item, ...payload }
        }
        return item
      })
    case `RECONCILE_${name}`:
      return payload
    default:
      return state
  }
}

const topicReducer = baseReducer('TOPIC')
const levelReducer = baseReducer('LEVEL')

function critReducer(state, { type, payload }) {
  switch (type) {
    case 'ADD':
      return {
        ...state,
        [payload.topicId]: payload.criteria,
      }
    case 'EDIT':
      return {
        ...state,
        [payload.topicId]: state[payload.topicId].map(criteria => {
          if (criteria.id === payload.criteria.id) {
            return payload.criteria
          }
          return criteria
        }),
      }
    case 'RECONCILE':
      let newState = {}
      const keysArr = Object.keys(state)
      if (keysArr.length) {
        keysArr.forEach(key => {
          newState = {
            ...newState,
            [key]: reconcileCriteria(state[key], payload.levels),
          }
        })
        return newState
      }
      return {
        [payload.topics[0].id]: reconcileCriteria([], payload.levels),
      }
    default:
      return state
  }
}
function reconcileCriteria(criteria = [], levels = []) {
  return levels.map((level, idx) => {
    const newLevel = { ...level }
    delete newLevel.id
    delete newLevel.name
    if (criteria[idx]) {
      return {
        ...criteria[idx],
        ...newLevel,
        levelName: level.name,
      }
    }
    return {
      ...newLevel,
      levelName: level.name,
      id: nanoid(),
      description: '',
      disabled: false,
    }
  })
}
// const initCriteria ={
//   [initTopic.id]: [
//     {
//       id: initLevel.id,
//       description: '',
//       disabled: false,
//     },
//   ],
// }

const initLevel = {
  id: nanoid(),
  name: '',
  weight: null,
}
const initTopic = {
  id: nanoid(),
  name: '',
  weight: null,
  // criteria: [
  //   {
  //     ...initLevel,
  //     description: '',
  //     disabled: false,
  //   },
  // ],
}

function parseCriteria(topics) {
  let result = {}

  topics.forEach(topic => {
    result = {
      ...result,
      [topic.id]: topic.criteria,
    }
  })
  return result
}

function Builder({ rubric = {}, editing = false }) {
  const [output, setOutput] = useState(null)
  const [name, setName] = useState(rubric.name || '')
  const [levels, setLevels] = useReducer(
    levelReducer,
    rubric.levels || [initLevel]
  )
  const [topics, setTopics] = useReducer(
    topicReducer,
    rubric.topics || [initTopic]
  )
  const [criteria, setCriteria] = useReducer(
    critReducer,
    rubric.topics
      ? parseCriteria(rubric.topics)
      : {
          [initTopic.id]: [{ id: nanoid(), description: '', disabled: false }],
        }
  )

  const [saveRubric, { error, loading, data }] = useMutation(SAVE_RUBRIC, {
    variables: {
      rubricData: output,
    },
  })
  useEffect(() => {
    setCriteria({
      type: 'RECONCILE',
      payload: {
        topics,
        levels,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels, topics])

  const save = async () => {
    // setOutput(finalRubric)
    let newRubric = {
      name: name,
      levels: levels,
      topics: topics.map(topic => {
        return {
          ...topic,
          criteria: criteria[topic.id],
        }
      }),
    }
    if (editing) {
      newRubric.id = rubric.id
    }
    const omitTypename = (key, value) =>
      key === '__typename' ? undefined : value
    // eslint-disable-next-line no-param-reassign
    newRubric = JSON.parse(JSON.stringify(newRubric), omitTypename)
    await setOutput(newRubric)
    saveRubric()
  }

  const processLevelForm = e => {
    e.preventDefault()
    const newID = nanoid()
    setLevels({
      type: 'ADD_LEVEL',
      payload: {
        id: newID,
        name: '',
        weight: null,
      },
    })
  }

  const [handleUpdateLevel] = useDebouncedCallback(({ id, field, value }) => {
    setLevels({
      type: 'EDIT_LEVEL',
      payload: {
        id: id,
        [field]: value,
      },
    })
  }, DEBOUNCE_TIME)

  const [updateTopic] = useDebouncedCallback(({ id, field, value }) => {
    setTopics({
      type: 'EDIT_TOPIC',
      payload: {
        id: id,
        [field]: value,
      },
    })
  }, DEBOUNCE_TIME)

  const handleDelete = (type, id) => {
    if (type === 'TOPIC') {
      setTopics({
        type: 'DELETE_TOPIC',
        payload: {
          id,
        },
      })
    }
    if (type === 'LEVEL') {
      setLevels({
        type: 'DELETE_LEVEL',
        payload: {
          id,
        },
      })
    }
  }

  const resetBuilder = () => {
    // dispatch({
    //   type: 'RESET_ALL',
    // })
  }

  const [debounce] = useDebouncedCallback(fn => fn, DEBOUNCE_TIME)

  return (
    <div>
      <h1>Builder</h1>
      <Nav />
      <button onClick={resetBuilder}>Reset</button>
      <form onSubmit={processLevelForm}>
        <label htmlFor="rubricName">Rubric Name</label>
        <input
          type="text"
          id="rubricName"
          name="rubricName"
          defaultValue={name}
          onChange={e => {
            debounce(setName(e.target.value))
          }}
        />
        <p>Create Achievement Levels</p>
        <div
          css={css`
            display: flex;
          `}
        >
          {renderLevels(levels, handleUpdateLevel, handleDelete)}
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
            <div key={`level-heading-${level.id}`}>{level.name}</div>
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
                  onClick={e => handleDelete('TOPIC', topic.id)}
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
                      setCriteria({
                        type: 'EDIT',
                        payload: {
                          topicId: topic.id,
                          criteria: {
                            ...criteria,
                            disabled: e.target.checked ? true : false,
                          },
                        },
                      })
                    }
                  />
                  <TextArea
                    id={criteria.id}
                    defaultValue={criteria.description}
                    disabled={criteria.disabled}
                    onChange={e =>
                      setCriteria({
                        type: 'EDIT',
                        payload: {
                          topicId: topic.id,
                          criteria: {
                            ...criteria,
                            description: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </CriteriaFieldset>
              ))}
            </RubricRow>
          ))}
          <button
            type="button"
            onClick={() => {
              let newId = nanoid()
              setTopics({
                type: 'ADD_TOPIC',
                payload: {
                  id: newId,
                  name: '',
                  weight: null,
                },
              })
              setCriteria({
                type: 'ADD',
                payload: {
                  topicId: newId,
                  criteria: [
                    {
                      description: '',
                      disabled: false,
                    },
                  ],
                },
              })
            }}
          >
            Add new Topic
          </button>
        </form>
      </section>
      <hr />
      <button onClick={save}>Save Rubric</button>
      <hr />
      {output && <textarea value={`${JSON.stringify(output)}`} readOnly />}
      {data && (
        <p>
          Rubric saved status:{' '}
          {data.saveRubric && data.saveRubric.success ? `👍` : ':('}
        </p>
      )}
    </div>
  )
}

function renderLevels(levels, update, deleteLevel) {
  return levels.map(({ id, name, weight }, idx) => {
    return (
      <Fieldset key={`level-${id}`}>
        <button type="button" onClick={e => deleteLevel('LEVEL', id)}>
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

// const mapStateToProps = state => ({
//   name: state.name,
//   levels: state.levels,
//   topics: getTopics(state),
//   criteria: state.criteria,
//   finalRubric: getFullRubric(state),
// })
// export default connect(mapStateToProps)(Builder)

const GET_RUBRIC_BY_ID = gql`
  query rubric($id: String!) {
    rubric(id: $id) {
      name
      id
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
        }
      }
    }
  }
`
function BuilderQueryWrapper({ id }) {
  const { data, error, loading } = useQuery(GET_RUBRIC_BY_ID, {
    variables: { id: id },
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  return <Builder rubric={data.rubric} editing="true" />
}

function BuilderEditSwitcher(props) {
  if (props.id) {
    return BuilderQueryWrapper({ id: props.id })
  }
  return <Builder {...props} />
}

export default BuilderEditSwitcher
