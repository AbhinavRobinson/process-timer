// import firebase from 'firebase'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { SideBar } from './screens/SideBar/SideBar'

import { ipcRenderer, remote } from 'electron'

import './css/index.css'
import './css/utilities.css'
import Container from 'typedi'

// Amplify
import Amplify from 'aws-amplify'
import config from './aws-exports.js'
Amplify.configure(config)

import Store from 'electron-store'
const electron_store = new Store()

import firebase from 'firebase'
import Login from './screens/Login/Login'
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
const firestore = firebase.firestore()
interface IMainState {
	sidebar: boolean
	loggedin: boolean
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

	async initUser(credential) {
		electron_store.set('auth', true)
		if (credential.user.email) {
			electron_store.set('email', credential.user.email)
		}

		electron_store.set('user_uid', credential.user.uid)
		if (credential.user.photoURL) {
			electron_store.set('profile_pic', credential.user.photoURL)
		}
		if (credential.user.displayName) {
			electron_store.set('name', credential.user.displayName)
		}
		this.setState({ loggedin: true })

		ipcRenderer.emit('update_user')
		const user_data = {
			name: credential.user.displayName,
			email: credential.user.email,
			profile_pic: credential.user.photoURL,
		}

		await firestore.collection('users').doc(credential.user.uid).set(user_data)
	}

	googleSignIn = async () => {
		const id = require('uuid').v4()

		const oneTimeCodeRef = firebase.database().ref(`ot-auth-codes/${id}`)

		remote.shell.openExternal(`https://nudge.aniketbiprojit.me/?ot-auth-code=${id}`)

		const userDetails = (resolve) =>
			oneTimeCodeRef.on('value', async (snapshot) => {
				const authToken = snapshot.val()
				if (authToken) {
					const credential = await firebase.auth().signInWithCustomToken(authToken)
					remote.getCurrentWindow().setAlwaysOnTop(true)
					this.initUser(credential)
					// this.setState({ LoginDialog: false })
					electron_store.set('auth', true)
					electron_store.set('email', credential.user.email)
					electron_store.set('name', credential.user.displayName)

					electron_store.set('profile_pic', credential.user.photoURL)
					electron_store.set('user_uid', credential.user.uid)

					remote.getCurrentWindow().show()
					remote.getCurrentWindow().focus()

					let user_data = {
						name: credential.user.displayName,
						email: credential.user.email,
						profile_pic: credential.user.photoURL,
					}
					await firestore.collection('users').doc(credential.user.uid).set(user_data)
					resolve()
					// return user_data
				}
			})
		return new Promise((resolve) =>
			setTimeout(() => {
				return userDetails(resolve)
			}, 1000)
		)
	}

	async logout() {
		electron_store.clear()
		await firebase.auth().signOut()
	}

	componentDidMount() {
		ipcRenderer.on('redirect', (e) => {
			this.setState({ sidebar: true })
		})
		if (electron_store.get('auth')) {
			this.setState({
				loggedin: true,
			})
		} else {
			this.googleSignIn()
		}
	}

	render() {
		return this.state.loggedin ? this.state.sidebar ? <SideBar /> : <App /> : <Login />
		// return <App />
		// return <>{ipcRenderer.sendSync('sidebar_open_check') ? <SideBar /> : <App />}</>
	}
}

ReactDOM.render(<Main />, document.getElementById('app'))
