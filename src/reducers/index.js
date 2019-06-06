import { combineReducers } from 'redux'
import nanoid from 'nanoid'
import merge from 'deepmerge'
const initLevels = [
  {
    id: nanoid(),
    name: '',
    weight: '',
  },
]
function levels(state = initLevels, { type, payload }) {
  switch (type) {
    case `ADD_LEVEL`:
      return [...state, { ...payload }]
    case `DELETE_LEVEL`:
      return state.filter(item => item.id !== payload.id)
    case `EDIT_LEVEL`:
      return state.map(item => {
        if (item.id === payload.id) {
          return { ...payload }
        }
        return item
      })
    default:
      return state
  }
}
const initTopics = [
  {
    id: nanoid(),
    name: '',
    weight: '',
  },
]
function topics(state = initTopics, { type, payload }) {
  switch (type) {
    case 'ADD_TOPIC':
      return [...state, payload]
    case 'EDIT_TOPIC':
      return state.map(topic => {
        if (topic.id === payload.id) {
          return payload
        }
        return topic
      })
    default:
      return state
  }
}

const reconcileCriteria = (levels, criteria) => {
  const newlevels = levels.map(level => ({
    id: level.id,
    description: '',
  }))
  return merge(newlevels, criteria)
}

function criteriaByTopicId(state = {}, { type, payload }) {
  switch (type) {
    case 'ADD_CRIT':
      return {
        ...state,
        [payload.id]: payload.criteria,
      }
    case 'EDIT_CRIT':
      return {
        ...state,
        [payload.id]: state[payload.id].map(criteria => {
          if (criteria.id === payload.criteria.id) {
            return payload.criteria
          }
          return criteria
        }),
      }
    case 'RECONCILE_CRIT':
      let newState = {}
      Object.keys(state).forEach(key => {
        newState = {
          ...newState,
          [state[key]]: reconcileCriteria(payload.levels, state[key]),
        }
      })
      return newState
    default:
      return state
  }
}

export default combineReducers({
  levels,
  topics,
  criteria: criteriaByTopicId,
})
