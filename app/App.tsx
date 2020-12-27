import { ipcRenderer, remote } from 'electron'
import { join } from 'path'
import React, { Fragment } from 'react'

/**
 * Font Awesome Imports
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCheck, faAngleDoubleRight, faTimes } from '@fortawesome/free-solid-svg-icons'

/**
 * Checks active app in windows
 */
import getFile from '../run'

/**
 * DragRegion adds draggable section
 * Login adds login screen
 * CloseHandler closes current window
 */
import DragRegion from './components/DragRegion'
import Login from './screens/Login/Login'
import { CloseHandler } from './components/CloseHandler'

/**
 * Firestore imports
 */
import firebase from 'firebase'
// import Container from 'typedi'
// import { SocketContainerClass } from './SocketContainer'

import Store from 'electron-store'
const electron_store = new Store()

const isDevelopment = process.env.NODE_ENV !== 'production'

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

// create IHealth interface for app monitor
export interface IHealth {
	health: number
	percentage: number
	display_percentage: number
}

// App monitor interface
export interface IAppState {
	static: string
	active_app: string
	monitor_app: string
	backend_running: boolean
	total_time: number
	time_spent: IHealth[]
	running_time: number
	active_time: number
	LoginDialog: boolean
	closeHandler: boolean
}

// Main Component
export class App extends React.Component<{}, IAppState> {
	// Local states
	state = {
		static: __static,
		active_app: '',
		monitor_app: '',
		backend_running: false,
		total_time: isDevelopment ? 20 : 300,
		time_spent: [],
		running_time: 0,
		active_time: 0,
		LoginDialog: false,
		closeHandler: false,
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
		this.setState({ LoginDialog: false })

		// ipcRenderer.emit('update_user')
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

	// Get platform and initiate monitor
	async componentDidMount() {
		// if (remote.getCurrentWindow().id === 1)
		;(window as any).electron_store = electron_store
		// console.log(electron_store.path)
		if (electron_store.has('auth')) {
			if (electron_store.get('auth') === false) {
				remote.getCurrentWindow().setAlwaysOnTop(false)
				this.setState({ LoginDialog: true })
				await this.googleSignIn()
			}
		} else {
			remote.getCurrentWindow().setAlwaysOnTop(false)
			this.setState({ LoginDialog: true })
			await this.googleSignIn()
		}
		remote.getCurrentWindow().setAlwaysOnTop(true)
		remote.getCurrentWindow().setBounds({
			x: remote.screen.getPrimaryDisplay().bounds.width - 120,
			y: remote.screen.getPrimaryDisplay().bounds.height / 2 - document.getElementById('outer').clientHeight,
		})
		console.log('resolved')
		setInterval(() => {
			// For Windows
			if (process.platform === 'win32') {
				getFile(join(__static, 'dist', 'getwindow.exe'), (data) => {
					if (data['title'] !== 'Electron') {
						if (data['app'] === 'chrome.exe') this.setState({ active_app: data['title'] })
						else this.setState({ active_app: data['app'] })
					}
				})
			} else {
				// For MacOS and Linux
				const monitor = require('./active-window')
				monitor.getActiveWindow((data) => {
					if (data['title'] !== '"Electron"') {
						if (data['app'] !== '"google-chrome", "Google-chrome"') {
							this.setState({ active_app: data['app'] })
						} else {
							this.setState({ active_app: data['title'] })
						}
					}
				})
			}
			ipcRenderer.emit('time_data', this.state.time_spent)
		}, 2000)
	}

	private global_timeout: NodeJS.Timeout

	// Timer logic
	run_backend() {
		const { total_time } = this.state

		let health_array: IHealth[] = this.state.time_spent
		health_array.push({
			health: 100,
			percentage: 0,
			display_percentage: 0,
		})

		this.setState({ time_spent: health_array })

		const interval = setInterval(() => {
			let { running_time, active_app, monitor_app, active_time } = this.state
			running_time += 1
			if (active_app === monitor_app) {
				active_time += 1
			}

			health_array[health_array.length - 1].health = Math.ceil((1 - (running_time - active_time) / total_time) * 100)
			health_array[health_array.length - 1].percentage = Math.floor((running_time / total_time) * 100)
			health_array[health_array.length - 1].display_percentage = Math.floor((active_time / running_time) * 100)

			this.setState({ running_time: running_time, time_spent: health_array, active_time }, () => {
				// console.log(running_time, health_array[health_array.length - 1].health, health_array[health_array.length - 1].percentage, active_time)
			})
		}, 1000)

		this.global_timeout = interval

		setTimeout(() => {
			clearInterval(interval)
			if (health_array.length === 4) {
				health_array.splice(0, 1)
			}
			this.setState({ running_time: 0, time_spent: health_array, active_time: 0 })
			this.run_backend()
		}, total_time * 1000)
	}

	// Color grad logic
	getColorForPercentage(percentage: number) {
		let red = 255
		let green = 255
		if (percentage >= 0 && percentage <= 0.5) {
			green = 510 * percentage
		} else if (percentage > 0.5 && percentage <= 1) {
			red = -510 * percentage + 510
		}

		return 'rgb(' + [red, green, 0].join(',') + ')'
	}

	// Get color grad and fill bubble
	getStyle = (elem: IHealth) => {
		let color = this.getColorForPercentage(elem.health / 100)

		const fillStyle: React.CSSProperties = {
			backgroundColor: color,
			height: `${elem.percentage}%`,
			width: '100%',
			position: 'absolute',
			bottom: 0,
			left: 0,
		}

		return fillStyle
	}

	render() {
		if (this.state.LoginDialog) return <Login />
		return (
			<Fragment>
				<div className='outer' id='outer'>
					<div className='container'>
						<ul className='app-list'>
							{this.state.time_spent.map((elem: IHealth) => {
								return (
									<li
										className='itemStyle'
										style={
											this.state.active_app === this.state.monitor_app
												? { animation: 'glow-green 2s ease-in-out 4' }
												: { animation: 'glow-red 2s ease-in-out 4' }
										}
									>
										<span style={{ zIndex: 4 }} className='app-item'>
											<div className='v-middle text-center'>{`${elem.display_percentage}`}</div>
										</span>
										<div className='fill' style={this.getStyle(elem)}></div>
									</li>
								)
							})}
						</ul>
						{!this.state.backend_running ? (
							<button
								onClick={() => {
									console.log('clicked')
									const { active_app } = this.state
									this.setState({ monitor_app: active_app, backend_running: true })
									this.run_backend()
								}}
								className='play-button'
							>
								<FontAwesomeIcon icon={faPlay} />
							</button>
						) : (
							<Fragment>
								<button
									onClick={() => {
										clearInterval(this.global_timeout)
										this.setState({ running_time: 0, time_spent: [], active_time: 0, backend_running: false })
									}}
									className='pause-button'
								>
									<FontAwesomeIcon icon={faCheck} />
								</button>
							</Fragment>
						)}

						<button
							onClick={() => {
								ipcRenderer.send('open_sidebar')
							}}
							className='read-button my-1 xs'
						>
							<FontAwesomeIcon icon={faAngleDoubleRight} />
						</button>

						<button
							onClick={() => {
								if (!this.state.closeHandler) {
									this.setState({ closeHandler: true })

									CloseHandler("warning","Do you want to close Nudge?", () => {
										this.setState({ closeHandler: false })
									})
								}
							}}
							className='read-button sm'
						>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>

					{this.state.backend_running === false && <div className='active-app my-1'>Selected App: {this.state.active_app}</div>}

					{isDevelopment && <div className='monitor-app my-1 disable'>Monitor App: {this.state.monitor_app}</div>}

					<div className='my-1'></div>
					<DragRegion />
				</div>
			</Fragment>
		)
	}
}