import React from 'react'
import Rubric from './containers/Rubric'
import Builder from './containers/Builder'
import Nav from './components/Nav'
import { Router, Link } from '@reach/router'
import { Provider } from 'react-redux'
import configureStore from './configureStore'
import { PersistGate } from 'redux-persist/integration/react'

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
