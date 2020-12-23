import { spawnSync } from 'child_process'
import { app, ipcRenderer, remote } from 'electron'
import { join } from 'path'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

// Font Awesome
const { FontAwesomeIcon } = require('@fortawesome/react-fontawesome')
const { faPlay, faCheck, faAngleDoubleRight, faTimes } = require('@fortawesome/free-solid-svg-icons')

import getFile from '../run'
import './utilities.css'
import './index.css'

// components
import DragRegion from './components/DragRegion'
import firebase from 'firebase'

import Store from 'electron-store'
const electron_store = new Store()

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

const isDevelopment = process.env.NODE_ENV !== 'production'

// create IHealth interface for app monitor
interface IHealth {
	health: number
	percentage: number
	display_percentage: number
}

// App monitor interface
interface IAppState {
	static: string
	active_app: string
	monitor_app: string
	backend_running: boolean
	total_time: number
	time_spent: IHealth[]
	running_time: number
	active_time: number
}

// Main Component
class App extends React.Component<{}, IAppState> {
	// Local states
	state = {
		static: __static,
		active_app: '',
		monitor_app: '',
		backend_running: false,
		total_time: isDevelopment ? 20 : 300, // seconds
		time_spent: [],
		running_time: 0,
		active_time: 0,
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
		// this.setState({ LoginDialog: false })

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

		setTimeout(() => {
			oneTimeCodeRef.on('value', async (snapshot) => {
				const authToken = snapshot.val()
				if (authToken) {
					const credential = await firebase.auth().signInWithCustomToken(authToken)
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
				}
			})
		}, 5000)

		remote.shell.openExternal(`https://nudge.aniketbiprojit.me/?ot-auth-code=${id}`)
	}

	// Get platform and initiate monitor
	async componentDidMount() {
		electron_store.clear()
		// console.log(electron_store.path)
		if (electron_store.has('auth')) {
			if (electron_store.get('auth') === false) {
				this.googleSignIn()
			}
		} else {
			this.googleSignIn()
		}
		remote.getCurrentWindow().setBounds({
			x: remote.screen.getPrimaryDisplay().bounds.width - 120,
			y: remote.screen.getPrimaryDisplay().bounds.height / 2 - document.getElementById('outer').clientHeight,
		})
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
		return (
			<div className='outer' id='outer'>
				<div className='container'>
					<ul className='app-list'>
						{this.state.time_spent.map((elem: IHealth) => {
							return (
								<li
									className='itemStyle'
									style={
										this.state.active_app === this.state.monitor_app
											? { boxShadow: '0 0 0 1px gray' }
											: { boxShadow: '0 0 0 1px red' }
									}
								>
									<span style={{ zIndex: 4 }} className='app-item'>{`${elem.display_percentage}`}</span>
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
							{/* {this.state.running_time} */}
						</Fragment>
					)}

					{/* SHOW MORE */}
					<button
						onClick={() => {
							new Notification("Dev's Note", {
								body: 'This feature is currently under devolopment!',
							})
						}}
						className='read-button my-1 xs'
					>
						<FontAwesomeIcon icon={faAngleDoubleRight} />
					</button>

					{/* CLOSE APP */}
					<button
						onClick={() => {
							remote.dialog
								.showMessageBox(null, {
									buttons: ['&Yes, close nudge app.', '&No, keep nudge open.'],
									message: 'Do you want to close Nudge?',
								})
								.then((data) => {
									if (data.response === 0) {
										window.close()
									}
								})
						}}
						className='read-button xs'
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>

				{/* SHOWS IN-FOCUS APP */}
				{this.state.backend_running === false && <div className='active-app my-1'>Selected App: {this.state.active_app}</div>}

				{/* SHOWS MONITORING (SELECTED) APP */}
				{isDevelopment && <div className='monitor-app my-1 disable'>Monitor App: {this.state.monitor_app}</div>}

				{/* DRAG REGION */}
				<div className='my-1'></div>
				<DragRegion />
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
