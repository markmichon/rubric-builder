export const addLevel = payload => (dispatch, getState) => {
  dispatch({ type: 'ADD_LEVEL', payload })
  // const { levels, topics } = getState()
  dispatch({
    type: 'RECONCILE_CRIT',
    payload: { levels: getState().levels, topics: getState().topics },
  })
}
export const deleteLevel = payload => (dispatch, getState) => {
  dispatch({ type: 'DELETE_LEVEL', payload })
  dispatch({
    type: 'RECONCILE_CRIT',
    payload: { levels: getState().levels, topics: getState().topics },
  })
}

export const addTopic = payload => (dispatch, getState) => {
  const { levels } = getState()
  dispatch({ type: 'ADD_TOPIC', payload })
  dispatch({
    type: 'SETUP_NEW_LEVEL_CRIT',
    payload: { ...payload, levels: levels },
  })
}

const edit = name => payload => ({
  type: `EDIT_${name}`,
  payload,
})

export const editLevel = edit('LEVEL')
export const editTopic = edit('TOPIC')
export const editCriteria = edit('CRIT')
