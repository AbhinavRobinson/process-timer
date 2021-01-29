import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const initialState: ReduxStateTypes.MetaApplicaionType = {
	loggedIn: false,
}

export const MetaApplicationSlice = createSlice({
	name: 'MetaApplication',
	initialState,
	reducers: {
		setLogin(state, action: PayloadAction<boolean>) {
			state.loggedIn = action.payload
		},
	},
})

export const MetaApplicationActions = MetaApplicationSlice.actions

export const MetaApplicationReducer = MetaApplicationSlice.reducer
