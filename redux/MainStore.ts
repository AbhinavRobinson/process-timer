import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'
import { applyMiddleware, createStore } from 'redux'
import rootReducer from '../app/redux/rootReducer'

const middlewares = []

const store = createStore(rootReducer, applyMiddleware(triggerAlias, ...middlewares, forwardToRenderer))

replayActionMain(store)
