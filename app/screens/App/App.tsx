import { ipcRenderer } from 'electron'
import React, { Fragment } from 'react'

/**
 * Font Awesome Imports
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCheck, faTimes, faPhone, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import { FaUnlockAlt } from 'react-icons/fa'

import ReactTooltip from 'react-tooltip'

/**
 * DragRegion adds draggable section
 * Login adds login screen
 * CloseHandler closes current window
 */
import DragRegion from '../../components/DragRegion'
// import Login from './screens/Login/Login'
import { CloseHandler } from '../../components/CloseHandler'

import Store from 'electron-store'
const electron_store = new Store()

import MessageHandler from '../../components/MessageHandler'
import { ext_run_backend } from './ext_run_backend'
import { set_up_window } from './set_up_window'

import AppList from './AppList'
import { macPermissionCheck } from './utilities'
import { game_loop } from './game_loop'

const isDevelopment = process.env.NODE_ENV !== 'production'

// create IHealth interface for app monitor
export interface IHealth {
	health: number
	percentage: number
	display_percentage: number
}

// App monitor interface
export interface IAppState {
	static: string
	backend_running: boolean
	time_spent: IHealth[]
	LoginDialog: boolean
	closeHandler: boolean
	test_active: any
}

// Main Component
export class App extends React.Component<{}, IAppState> {
	// Local states
	state = {
		static: __static,
		backend_running: false,
		time_spent: [],
		LoginDialog: false,
		closeHandler: false,
		test_active: '',
	}

	// App tracking
	active_app = ''
	monitor_app = ''

	// Total time of each round
	total_time = isDevelopment ? 20 : 300
	running_time = 0
	active_time = 0

	global_interval_timeout: NodeJS.Timeout
	active_app_interval_timeout: NodeJS.Timeout
	backend_timeout: NodeJS.Timeout

	// Get platform and initiate monitor
	async componentDidMount() {
		ipcRenderer.addListener('start_timer', () => {
			this.stop_backend()
			this.setState({ backend_running: true })
			this.monitor_app = this.active_app
			this.run_backend()
		})

		if (process.platform !== 'win32')
			ipcRenderer.on('appUpdate', (_, data: string) => {
				this.active_app = data
			})

		set_up_window()
		console.log('resolved')
		if (process.platform !== 'darwin') game_loop(this)
		if (process.platform === 'darwin') ipcRenderer.send('startAppTracking')
	}

	async componentDidUpdate() {
		ipcRenderer.send('control_state_change', this.state)
	}

	componentWillUnmount() {
		clearTimeout(this.backend_timeout)
		clearInterval(this.global_interval_timeout)
		clearInterval(this.active_app_interval_timeout)
	}
	// Timer logic
	run_backend() {
		ext_run_backend(this)
	}

	render() {
		return (
			<Fragment>
				<ReactTooltip type='dark' delayShow={750} effect='solid' />
				<div className='outer' id='outer'>
					{/* <p>{this.state.active_app}</p> */}
					<div className='container'>
						<AppList
							{...{
								time_spent: this.state.time_spent,
								backend_running: this.state.backend_running,
								isOnMonitor: this.active_app === this.monitor_app,
							}}
						/>
						{!this.state.backend_running ? (
							<button onClick={this.backend_handler(this)} className='play-button' data-tip='Focus Mode'>
								<FontAwesomeIcon icon={faPlay} />
							</button>
						) : (
							<Fragment>
								<button
									onClick={() => {
										this.stop_backend()
									}}
									className='pause-button'
								>
									<FontAwesomeIcon icon={faCheck} />
								</button>
							</Fragment>
						)}

						<button
							onClick={() => {
								this.backend_handler(this)()
									.then((started) => {
										if (started) ipcRenderer.send('open_sidebar')
									})
									.catch(console.error)
							}}
							className='read-button'
							data-tip='Video Call'
						>
							<FontAwesomeIcon icon={faPhone} />
						</button>

						<button
							onClick={() => {
								ipcRenderer.send('open_timer')
							}}
							className='read-button'
							data-tip='Open Timer'
						>
							<FontAwesomeIcon icon={faStopwatch} />
						</button>

						<button
							onClick={() => {
								electron_store.clear()
								// Set a flag so as not to fire login on
								// logout and reset it on that page.
								electron_store.set('fire_login', false)
								window.location.reload()
								window.resizeTo(400, 600)
							}}
							className='logout-button sm'
							data-tip='Logout'
						>
							<FaUnlockAlt />
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

	backend_handler = (ref: App) => async (): Promise<boolean> => {
		if (process.platform === 'darwin') {
			const accRes = macPermissionCheck('accessibility')
			const scrRes = macPermissionCheck('screen')
			const permissionResponse = `${accRes}${scrRes}`
			if (permissionResponse) {
				await MessageHandler(permissionResponse, () => null, !!permissionResponse)
				return false
			}
		}

		var confirm = await MessageHandler(
			ref.active_app
				? `Do you want to start with ${ref.active_app}`
				: 'Please select an app by cliking anywhere on the desired application once. Nudge takes 2 seconds to track the current app after clicking',
			() => null,
			!ref.active_app
		)
		if (ref.active_app && confirm === 0) {
			ref.monitor_app = ref.active_app
			ref.setState({ backend_running: true })
			ref.run_backend()
			return true
		}

		return false
	}

	private stop_backend() {
		clearTimeout(this.backend_timeout)
		clearInterval(this.global_interval_timeout)
		clearInterval(this.active_app_interval_timeout)
		this.running_time = 0
		this.active_time = 0
		this.setState({ time_spent: [], backend_running: false }, () => {
			this.setState({ time_spent: [], backend_running: false })
		})
		this.componentDidMount()
		// TODO: Handle flickering without reload
		// window.location.reload()
	}
}
