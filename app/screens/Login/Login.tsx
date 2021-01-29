// import { remote } from 'electron'
import { faTimes, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { remote } from 'electron'
import React from 'react'
import DragRegion from '../../components/DragRegion'
import { Fragment } from 'react'
import ReactTooltip from 'react-tooltip'
import './Login.css'
import { ipcRenderer } from 'electron'

import { CloseHandler } from '../../components/CloseHandler'
import { Prompt } from '../../components/Prompt'
/**
 * Shows Login Screen
 */

import firebase from 'firebase'
import Store from 'electron-store'
import App from '../App'
const electron_store = new Store()
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

export interface State {
	closeHandler: boolean
	verifying: boolean
	loggedin: boolean
}

export class Login extends React.Component<{}, State> {
	state = {
		closeHandler: false,
		verifying: false,
		loggedin: false,
	}

	async initUser(credential: any) {
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

		const userDetails = (resolve: any) =>
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
					remote.getCurrentWindow().setAlwaysOnTop(true)
					remote.getCurrentWindow().setSize(90, 600)

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

	componentDidMount() {
		if (electron_store.get('auth')) {
			this.setState({
				loggedin: true,
			})
		}
	}

	render() {
		return this.state.loggedin ? (
			<App />
		) : (
			<Fragment>
				<ReactTooltip />
				<div className='outer' id='outer'>
					{/* <p>{this.state.active_app}</p> */}
					<div className='container'>
						<button
							onClick={() => {
								if (!this.state.verifying) {
									this.setState({ verifying: true })
									this.googleSignIn()
								} else {
									this.setState({ verifying: false })
									Prompt('info', 'Oops!! A window is already opened or something went wrong, press login again for a fresh start!')
								}
							}}
							className='read-button'
							data-tip='Login to explore'
						>
							<FontAwesomeIcon icon={faSignInAlt} />
						</button>
						<button
							onClick={() => {
								if (!this.state.closeHandler) {
									this.setState({ closeHandler: true })

									CloseHandler('warning', 'Do you want to close Nudge?', () => {
										this.setState({ closeHandler: false })
									})
								}
							}}
							className='read-button sm'
							data-tip='Exit'
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>

					<div className='my-1'></div>
					<DragRegion />
				</div>
			</Fragment>
		)
	}
}

export default Login
