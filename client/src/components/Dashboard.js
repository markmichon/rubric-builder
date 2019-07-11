/** @jsx jsx */
import React from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { css, jsx } from '@emotion/core'
import { Box, Text, Link, ButtonLink } from './radicals'
import DeleteRubric from './DeleteRubric'
import Icons from './Icons'

const GET_RUBRICS = gql`
  query getRubrics {
    rubrics {
      id
      name
      # createdAt
      # updatedAt
    }
  }
`

function Dashboard() {
  const { data, error, loading } = useQuery(GET_RUBRICS)
  const { rubrics } = data
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return (
    <Box
      as="ul"
      css={css`
        list-style-type: none;
        margin: 0;
        padding: 0;
      `}
    >
      {rubrics.map(rubric => (
        <Box as="li" key={rubric.id} mb="3">
          <Link to={`rubric/${rubric.id}`} variant="unstyled" mb="1">
            {rubric.name}
          </Link>
          <Box display="flex">
            <ButtonLink
              to={`/builder/${rubric.id}`}
              state={{ editing: true }}
              mr="2"
              variant="secondary"
            >
              Edit <Icons.edit />
            </ButtonLink>
            <DeleteRubric id={rubric.id} fontSize="1" />
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default Dashboard
