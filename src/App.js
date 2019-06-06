import React from 'react'
import Rubric from './containers/Rubric'
import Builder from './containers/Builder'
import { Router, Link } from '@reach/router'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

function Home() {
  return (
    <div>
      <h1>Rubric Builder</h1>
      <div>
        <Link to="/rubric">Rubric</Link> / <Link to="/builder">Builder</Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Home path="/" />
        <Rubric path="/rubric" />
        <Builder path="/builder" />
      </Router>
    </Provider>
  )
}

export default App
