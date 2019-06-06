/** @jsx jsx */
import React, { useState, useReducer, useEffect } from 'react'
import { css, jsx } from '@emotion/core'
import nanoid from 'nanoid'
import { connect } from 'react-redux'
import { getTopics } from '../reducers'
import {
  addLevel,
  editLevel,
  editTopic,
  editCriteria,
  addTopic,
} from '../actions'
// const Input = (props) => {

// }

const RubricGrid = ({ children, count }) => {
  return (
    <div
      css={css`
        display: grid;
        grid-template-columns: 2fr 1fr repeat(${count}, 3fr);
      `}
    >
      {children}
    </div>
  )
}

const renderLevels = (levels, update) => {
  return levels.map(({ id }, idx) => {
    return (
      <fieldset
        css={css`
          display: flex;
          flex-direction: row;
        `}
        key={`level-${id}`}
      >
        <label htmlFor={`lName-${id}`}>Tier Name</label>
        <input
          type="text"
          id={`lName-${id}`}
          name={`lName-${id}`}
          onChange={e => update({ id: id, field: 'name' }, e)}
        />
        <label htmlFor={`lWeight-${id}`}>Weight</label>
        <input
          type="text"
          id={`lWeight-${id}`}
          name={`lWeight-${id}`}
          onChange={e => update({ id: id, field: 'weight' }, e)}
        />
      </fieldset>
    )
  })
}

function Builder({ levels, topics, criteria, dispatch }) {
  // const topics = useTopics()

  useEffect(() => {
    // Reconcile levels with topics
    dispatch({
      type: 'RECONCILE_CRIT',
      payload: { levels, topics },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const updateLevel = ({ id, field }, e) => {
    dispatch(
      editLevel({
        ...levels.filter(level => level.id === id)[0],
        [field]: e.target.value,
      })
    )
  }

  const updateTopic = ({ id, field }, e) => {
    dispatch(
      editTopic({
        ...topics.filter(topic => topic.id === id)[0],
        [field]: e.target.value,
      })
    )
  }

  return (
    <div>
      <h1>Builder</h1>
      <form onSubmit={processLevelForm}>
        <p>Create Achievement Levles</p>
        <div
          css={css`
            display: flex;
          `}
        >
          {renderLevels(levels, updateLevel)}
          <button type="submit">Add Another Achievement Level</button>
        </div>
      </form>
      <h2>Topics</h2>
      <RubricGrid count={levels.length + 1}>
        <div>Topics</div>
        <div>Weight (%)</div>
        {levels.map(level => (
          <div key={`level-${level.id}`}>{level.name}</div>
        ))}
      </RubricGrid>
      <form>
        {topics.map(topic => (
          <RubricGrid key={topic.id} count={levels.length + 1}>
            <fieldset>
              <label htmlFor={`tName-${topic.id}`}>Topic</label>
              <input
                type="text"
                id={`tName-${topic.id}`}
                name={`tName-${topic.id}`}
                onChange={e => updateTopic({ field: 'name', id: topic.id }, e)}
              />
            </fieldset>
            <fieldset>
              <label htmlFor={`tWeight-${topic.id}`}>Weight</label>
              <input
                type="text"
                id={`tWeight-${topic.id}`}
                name={`tWeight-${topic.id}`}
                onChange={e =>
                  updateTopic({ field: 'weight', id: topic.id }, e)
                }
              />
            </fieldset>
            {criteria[topic.id].map(criteria => (
              <fieldset key={criteria.id}>
                <label htmlFor={criteria.id}>Criteria</label>
                <textarea
                  id={criteria.id}
                  onChange={e =>
                    dispatch(
                      editCriteria({
                        id: topic.id,
                        criteria: { ...criteria, description: e.target.value },
                      })
                    )
                  }
                />
              </fieldset>
            ))}
          </RubricGrid>
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
      <hr />
      <button>Save Rubric</button>
      <hr />
      {/* {output && <textarea value={`${JSON.stringify(output)}`} readOnly />} */}
    </div>
  )
}

const mapStateToProps = state => ({
  levels: state.levels,
  topics: getTopics(state),
  criteria: state.criteria,
})
export default connect(mapStateToProps)(Builder)
