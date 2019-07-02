import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'

const DELETE_RUBRIC = gql`
  mutation deleteRubric($id: String!) {
    deleteRubric(id: $id) {
      success
    }
  }
`

function DeleteRubric({ id }) {
  const [confirm, setConfirm] = useState(false)
  const [deleteRubric, { error, loading, data }] = useMutation(DELETE_RUBRIC, {
    variables: {
      id: id,
    },
    refetchQueries: ['getRubrics'],
  })
  const handleDelete = () => {
    deleteRubric()
  }
  if (!confirm)
    return (
      <button
        onClick={e => {
          setConfirm(true)
        }}
      >
        ❌
      </button>
    )
  if (confirm)
    return (
      <div>
        <button onClick={handleDelete}>Yes</button>)
        <button
          onClick={e => {
            setConfirm(false)
          }}
        >
          Never mind, cancel
        </button>
      </div>
    )
}

export default DeleteRubric
