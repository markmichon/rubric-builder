import React from 'react'
import Rubric from './containers/Rubric'
import Builder from './containers/Builder'
import Nav from './components/Nav'
import { Router, Link } from '@reach/router'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import { PersistGate } from 'redux-persist/integration/react'
import { Global, css } from '@emotion/core'

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
function Home() {
  return (
    <div>
      <h1>Rubric Builder</h1>
      <Nav />
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Global styles={globalStyles} />
        <Router>
          <Home path="/" />
          <Rubric path="/rubric" />
          <Builder path="/builder" />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
