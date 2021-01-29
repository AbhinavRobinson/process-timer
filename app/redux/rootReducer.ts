import { combineReducers } from '@reduxjs/toolkit'
import { MetaApplicationReducer } from './states/MetaApplicationSlice'

const rootReducer = combineReducers({
	MetaApplicationReducer: MetaApplicationReducer,
})

export default rootReducer
