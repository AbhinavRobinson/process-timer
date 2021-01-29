import { forwardToMain, triggerAlias } from 'electron-redux'
import { applyMiddleware, createStore } from 'redux'
import rootReducer from './rootReducer'
// import { RootState } from './types'

const middlewares = []

const store = createStore(rootReducer, applyMiddleware(triggerAlias, ...middlewares, forwardToMain))

export type AppDispatch = typeof store.dispatch

export default store
