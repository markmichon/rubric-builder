import { combineReducers } from 'redux'
import nanoid from 'nanoid'
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
const firstTopic = {
  id: nanoid(),
  name: '',
  weight: '',
}
const initTopics = [firstTopic]

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

// TODO: Optimize
const reconcileCriteria = (levels = [], criteria = []) => {
  let newlevelsById = {}

  levels.forEach(level => {
    newlevelsById = {
      ...newlevelsById,
      [level.id]: {
        id: level.id,
        description: '',
      },
    }
  })
  let criteriaById = {}
  if (criteria.length > 0) {
    criteria.forEach(crit => {
      criteriaById = {
        ...criteriaById,
        [crit.id]: {
          id: crit.id,
          description: crit.description,
        },
      }
    })
  }
  let merged = {
    ...newlevelsById,
    ...criteriaById,
  }
  return Object.keys(merged).map(key => merged[key])
}

const initCriteria = {
  [firstTopic.id]: [],
}
function criteria(state = initCriteria, { type, payload }) {
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
      const keysArr = Object.keys(state)
      if (keysArr.length) {
        keysArr.forEach(key => {
          newState = {
            ...newState,
            [key]: reconcileCriteria(payload.levels, state[key]),
          }
        })
        return newState
      }
      return {
        [payload.topics[0].id]: reconcileCriteria(payload.levels, []),
      }
    case 'SETUP_NEW_LEVEL_CRIT':
      return {
        ...state,
        [payload.id]: payload.levels.map(level => ({
          id: level.id,
          description: '',
        })),
      }

    default:
      return state
  }
}

export const getLevels = state => state.levels
export const getAllCriteria = state => state.criteria
export const getCriteriaById = (state, id) => state[id]
export const getTopics = state => {
  return state.topics.map(topic => ({
    ...topic,
    criteria: state.criteria[topic.id],
  }))
}

export default combineReducers({
  levels,
  topics,
  criteria,
})
