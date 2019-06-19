import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'

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
    <div>
      {/* {loading ? <p>Loading...</p> : null} */}
      {/* {error ? <p>Error: {error}</p> : null} */}
      {/* {data ? <p>Success!</p> : null} */}
      <form onSubmit={handleForm}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default LoginForm
