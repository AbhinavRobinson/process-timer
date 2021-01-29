import { forwardToMain, getInitialStateRenderer } from 'electron-redux'
import { applyMiddleware, createStore } from 'redux'
import rootReducer from './rootReducer'

const initialState = getInitialStateRenderer()
// import { RootState } from './types'

const middlewares = []

const store = createStore(rootReducer, initialState, applyMiddleware(forwardToMain, ...middlewares))

export type AppDispatch = typeof store.dispatch

export default store
