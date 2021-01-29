import * as React from 'react'
import ReactDOM from 'react-dom'

import Redirect from './screens/Redirect'
import { SideBar } from './screens/SideBar/SideBar'

import { ipcRenderer } from 'electron'

import './css/index.css'
import './css/utilities.css'
import Container from 'typedi'

import { Provider } from 'react-redux'

import Store from 'electron-store'
const electron_store = new Store()

import { useDispatch } from 'react-redux'
import store, { AppDispatch } from './redux/store'

import { MetaApplicationActions } from './redux/states/MetaApplicationSlice'

interface IMainState {
	sidebar: boolean
	loggedin: boolean
}

const TestStore: React.FC = () => {
	const dispatch: AppDispatch = useDispatch()

	dispatch(MetaApplicationActions.setLogin(true))
	React.useEffect(() => {
		setImmediate(() => {
			console.log('loggedIn:', store.getState().MetaApplicationReducer.loggedIn)
		})
		return () => {}
	}, [])
	return <></>
}

const Main: React.FC = () => {
	const [state, changeState] = React.useState<IMainState>({
		sidebar: false,
		loggedin: false,
	})

	//	const logout = async () => {
	//		electron_store.clear()
	//		await firebase.auth().signOut()
	//	}

	React.useEffect(() => {
		Container.set('url', 'socket.nudge.aniketbiprojit.me')
		ipcRenderer.on('redirect', () => {
			changeState({ ...state, sidebar: true })
		})
		if (electron_store.has('fire_login') && electron_store.get('fire_login') === false) {
			electron_store.clear()
			return
		}
		if (electron_store.get('auth')) {
			changeState({
				...state,
				loggedin: true,
			})
		}
	}, [])

	return (
		<>
			<Provider store={store}>
				<TestStore />
				{state.sidebar ? <SideBar /> : <Redirect />}
			</Provider>
		</>
	)
}

ReactDOM.render(<Main />, document.getElementById('app'))
