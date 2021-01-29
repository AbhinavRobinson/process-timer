import { ipcRenderer } from 'electron'
import React, { Fragment } from 'react'

/**
 * Font Awesome Imports
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faCheck, faTimes, faPhone, faStopwatch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import ReactTooltip from 'react-tooltip'

/**
 * DragRegion adds draggable section
 * Login adds login screen
 * CloseHandler closes current window
 */
import DragRegion from '../../components/DragRegion'
// import Login from './screens/Login/Login'
import { CloseHandler } from '../../components/CloseHandler'

/**
 * Firestore imports
 */
// import firebase from 'firebase'
// import Container from 'typedi'
// import { SocketContainerClass } from './SocketContainer'

import Store from 'electron-store'
const electron_store = new Store()

import MessageHandler from '../../components/MessageHandler'
import { ext_run_backend } from './ext_run_backend'
import { game_loop } from './game_loop'
import { set_up_window } from './set_up_window'

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
	active_app: string
	monitor_app: string
	backend_running: boolean
	total_time: number
	time_spent: IHealth[]
	running_time: number
	active_time: number
	LoginDialog: boolean
	closeHandler: boolean
	test_active: any
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
		test_active: '',
	}

	global_interval_timeout: NodeJS.Timeout
	active_app_interval_timeout: NodeJS.Timeout
	backend_timeout: NodeJS.Timeout

	// Get platform and initiate monitor
	async componentDidMount() {
		ipcRenderer.addListener('start_timer', () => {
			const { active_app } = this.state
			this.stop_backend()
			this.setState({ monitor_app: active_app, backend_running: true })
			this.run_backend()
		})

		set_up_window()
		console.log('resolved')
		game_loop(this)
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
			<Fragment>
				<ReactTooltip />
				<div className='outer' id='outer'>
					{/* <p>{this.state.active_app}</p> */}
					<div className='container'>
						{this.app_list()}
						{!this.state.backend_running ? (
							this.ifBackendRunning()
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
								ipcRenderer.send('open_sidebar')
							}}
							className='read-button'
							data-tip='Start Video Call'
						>
							<FontAwesomeIcon icon={faPhone} />
						</button>

						<button
							onClick={() => {
								ipcRenderer.send('open_timer')
							}}
							className='read-button'
							data-tip='Pomo Timer'
						>
							<FontAwesomeIcon icon={faStopwatch} />
						</button>

						<button
							onClick={() => {
								electron_store.clear()
								window.location.reload()
							}}
							className='logout-button sm'
							data-tip='Logout'
						>
							<FontAwesomeIcon icon={faSignOutAlt} className='icon' />
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

	private app_list() {
		return (
			<ul className='app-list'>
				{this.state.backend_running &&
					this.state.time_spent.map((elem: IHealth, ind) => {
						return (
							<li
								className='itemStyle'
								style={
									this.state.active_app === this.state.monitor_app
										? { animation: 'glow-green 2s ease-in-out 4' }
										: { animation: 'glow-red 2s ease-in-out 4' }
								}
								key={ind}
							>
								<span style={{ zIndex: 4 }} className='app-item'>
									<div className='text-center'>{`${elem.display_percentage}`}</div>
								</span>
								<div className='fill' style={this.getStyle(elem)}></div>
							</li>
						)
					})}
			</ul>
		)
	}

	private ifBackendRunning(): React.ReactNode {
		return (
			<button
				onClick={async () => {
					const { active_app } = this.state
					var confirm = await MessageHandler(
						active_app
							? `Do you want to start with ${active_app}`
							: 'Please select an app by cliking anywhere on the desired application once',
						() => null,
						!active_app
					)
					if (active_app && confirm === 0) {
						this.setState({ monitor_app: active_app, backend_running: true })
						this.run_backend()
					}
				}}
				className='play-button'
				data-tip='Focus Mode'
			>
				<FontAwesomeIcon icon={faPlay} />
			</button>
		)
	}

	private stop_backend() {
		clearInterval(this.global_interval_timeout)
		this.setState({ running_time: 0, time_spent: [], active_time: 0, backend_running: false })
		window.location.reload()
	}
}
