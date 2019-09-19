import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import { Box, TextInput, Label, Button, H } from './radicals'
const LOG_IN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        email
      }
      token
    }
  }
`

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { error, loading, data }] = useMutation(LOG_IN, {
    variables: {
      email: email,
      password: password,
    },
    update: (cache, { data: { login } }) => {
      const { token } = login
      if (token) {
        localStorage.setItem('token', token)
        cache.writeData({ data: { isLoggedIn: true } })
      }
    },
    // refetchQueries: ['IS_LOGGED_IN'],
  })

  const handleForm = e => {
    e.preventDefault()
    if (email && password) {
      login()
    }
  }
  return (
    <Box maxWidth="400px" mx="auto">
      {/* {loading ? <p>Loading...</p> : null} */}
      {/* {error ? <p>Error: {error}</p> : null} */}
      {/* {data ? <p>Success!</p> : null} */}
      <H as="h2" mb={3}>
        Welcome back.
      </H>
      <form onSubmit={handleForm}>
        <Label htmlFor="email">Email</Label>
        <TextInput
          type="email"
          id="email"
          onChange={e => setEmail(e.target.value)}
          width="100%"
        />
        <Label htmlFor="password">Password</Label>
        <TextInput
          type="password"
          name="password"
          id="password"
          onChange={e => setPassword(e.target.value)}
          width="100%"
        />
        <Button variant="primary" type="submit" display="block" width="100%">
          Log in
        </Button>
      </form>
    </Box>
  )
}

export default LoginForm
