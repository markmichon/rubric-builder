/** @jsx jsx */
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { css, jsx } from '@emotion/core'
import { Button } from './radicals'
import Icons from './Icons'
const DELETE_RUBRIC = gql`
  mutation deleteRubric($id: String!) {
    deleteRubric(id: $id) {
      success
    }
  }
`

function DeleteRubric({ id }, props) {
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
      <Button
        onClick={e => {
          setConfirm(true)
        }}
        // color="textLight"
        variant="danger"
        {...props}
      >
        Delete <Icons.close />
      </Button>
    )
  if (confirm)
    return (
      <span>
        <button onClick={handleDelete}>Yes</button>
        <button
          onClick={e => {
            setConfirm(false)
          }}
        >
          Never mind, cancel
        </button>
      </span>
    )
}

export default DeleteRubric
