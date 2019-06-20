import React from 'react'
import Rubric from './containers/Rubric'
import Builder from './containers/Builder'
import Nav from './components/Nav'
import { Router, Link } from '@reach/router'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import { PersistGate } from 'redux-persist/integration/react'
import { Global, css } from '@emotion/core'
import Apollo from './setupApollo'
import { useQuery, useMutation } from 'react-apollo'
import gql from 'graphql-tag'

import LoginForm from './components/LoginForm'

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
`

const { store, persistor } = configureStore()

const GET_RUBRICS = gql`
  query {
    getRubrics {
      id
      name
      # createdAt
      # updatedAt
    }
  }
`
function Dashboard() {
  const { data, error, loading } = useQuery(GET_RUBRICS)
  const { getRubrics } = data
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  return (
    <div>
      <h1>Dashboard</h1>
      {/* <Nav /> */}
      {getRubrics.map(rubric => (
        <Link to={`rubric/${rubric.id}`}>{rubric.name}</Link>
      ))}
    </div>
  )
}

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
      <main>
        <h1>Hello</h1>
        <button onClick={handleLogOut}>Log Out</button>
        <Router>
          <Dashboard path="/" />
          <Rubric path="/rubric/:rubricId" />
          <Builder path="/builder" />
        </Router>
      </main>
    </>
  )
}

const AuthHandler = () => {
  const { data } = useQuery(IS_LOGGED_IN)
  const { isLoggedIn } = data
  console.log(data)

  if (isLoggedIn) return <LoggedIn />
  return <LoggedOut />
}

function App() {
  return (
    <Apollo>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Global styles={globalStyles} />
          <AuthHandler />
        </PersistGate>
      </Provider>
    </Apollo>
  )
}

export default App
