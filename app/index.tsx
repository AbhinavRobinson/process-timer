// import firebase from 'firebase'

import React, { Component, Fragment, useEffect } from 'react'
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
import firebase from 'firebase'
import store, { AppDispatch } from './redux/store'

import { MetaApplicationActions } from './redux/states/MetaApplicationSlice'
if (firebase.apps.length === 0)
	firebase.initializeApp({
		apiKey: 'AIzaSyDCXLT3OhYO1gMndDKAoPWAtRFY1DWZWTM',
		authDomain: 'nudge-299511.firebaseapp.com',
		projectId: 'nudge-299511',
		storageBucket: 'nudge-299511.appspot.com',
		messagingSenderId: '637558220392',
		appId: '1:637558220392:web:1097b5ef12e6c0ec75fddd',
		serviceAccountId: 'firebase-adminsdk-1extw@nudge-299511.iam.gserviceaccount.com',
		databaseURL: 'https://nudge-299511-default-rtdb.firebaseio.com/',
	})
interface IMainState {
	sidebar: boolean
	loggedin: boolean
}

const TestStore = () => {
	const dispatch: AppDispatch = useDispatch()

	dispatch(MetaApplicationActions.setLogin(true))
	useEffect(() => {
		setImmediate(() => {
			console.log('loggedIn:', store.getState().MetaApplicationReducer.loggedIn)
		})
		return () => {}
	}, [])
	return <Fragment></Fragment>
}

class Main extends Component<{}, IMainState> {
	constructor(props: any) {
		super(props)
		Container.set('url', 'socket.nudge.aniketbiprojit.me')
	}
	state = {
		sidebar: false,
		loggedin: false,
	}

	async logout() {
		electron_store.clear()
		await firebase.auth().signOut()
	}

	componentDidMount() {
		ipcRenderer.on('redirect', () => {
			this.setState({ sidebar: true })
		})
		if (electron_store.has('fire_login') && electron_store.get('fire_login') === false) {
			electron_store.clear()
			return
		}
		if (electron_store.get('auth')) {
			this.setState({
				loggedin: true,
			})
		}
	}

	render() {
		return (
			<Fragment>
				<Provider store={store}>
					<TestStore />
					{this.state.sidebar ? <SideBar /> : <Redirect />}
				</Provider>
			</Fragment>
		)
		// return <App />
		// return <>{ipcRenderer.sendSync('sidebar_open_check') ? <SideBar /> : <App />}</>
	}
}

ReactDOM.render(<Main />, document.getElementById('app'))
