import React from 'react'
import Rubric from './containers/Rubric'
import Builder from './containers/Builder'
import Nav from './components/Nav'
import { Router } from '@reach/router'
import { css, Global } from '@emotion/core'
import { ThemeProvider } from 'emotion-theming'
import Apollo from './setupApollo'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Box, Text, Link } from './components/radicals'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import Layout from './components/Layout'
import theme from './theme'

const globalStyles = css`
  * {
    box-sizing: border-box;
  }

  html {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 16px;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  p,
  ul,
  ol,
  li,
  fieldset {
    margin: 0;
    padding: 0;
  }

  fieldset {
    border: 0;
    padding: 0;
    margin: 0;
  }

  input,
  button,
  select,
  option {
    font-family: inherit;
    font-size: inherit;
  }
`

const IS_LOGGED_IN = gql`
  query isLoggedIn {
    isLoggedIn @client(always: true)
  }
`

const LoggedOut = () => <LoginForm />

const LOG_OUT = gql`
  mutation logout {
    logOut @client
  }
`
const LoggedIn = () => {
  const [logout, { error, loading, data }] = useMutation(LOG_OUT, {})

  const handleLogOut = () => {
    logout()
  }
  return (
    <>
      <Layout logOut={handleLogOut}>
        <Router>
          <Dashboard path="/" />
          <Rubric path="/rubric/:rubricId" />
          <Builder path="/builder" />
          <Builder path="/builder/:id" />
        </Router>
      </Layout>
    </>
  )
}

const AuthHandler = () => {
  const { data } = useQuery(IS_LOGGED_IN)
  const { isLoggedIn } = data

  if (isLoggedIn) return <LoggedIn />
  return <LoggedOut />
}

function App() {
  return (
    <Apollo>
      <ThemeProvider theme={theme}>
        <>
          <Global styles={globalStyles} />
          <AuthHandler />
        </>
      </ThemeProvider>
    </Apollo>
  )
}

export default App
