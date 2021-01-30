import { ActionType, StateType } from 'typesafe-actions'

export type Store = StateType<typeof import('./store').default>
export type RootState = StateType<ReturnType<typeof import('./rootReducer').default>>
export type RootActions = ActionType<typeof import('./rootActions').default>

// declare module 'typesafe-actions' {
// 	export interface ReduxActionTypes {
// 		RootAction: ActionType<typeof import('./rootActions').default>
// 	}
// }
