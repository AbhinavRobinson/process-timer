import { spawnSync } from 'child_process'
import { join } from 'path'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import getFile from '../run'
import './index.css'

interface IAppState {
	static: string
	active_app: string
	monitor_app: string
	backend_running: boolean
	total_time: number
	time_spent: number[]
	running_time: number
	active_time: number
}

class App extends React.Component<{}, IAppState> {
	state = {
		static: __static,
		active_app: '',
		monitor_app: '',
		backend_running: false,
		total_time: 10, // seconds
		time_spent: [],
		running_time: 0,
		active_time: 0,
	}
	async componentDidMount() {
		setInterval(() => {
			getFile(join(__static, 'dist', 'getwindow.exe'), (data) => {
				if (data !== 'Electron') this.setState({ active_app: data })
			})
		}, 2000)
	}
	private global_timeout: NodeJS.Timeout

	run_backend() {
		const { total_time } = this.state
		let time_spent = this.state.time_spent
		time_spent.push(0)
		this.setState({ time_spent })
		const interval = setInterval(() => {
			let { running_time, active_app, monitor_app, active_time } = this.state
			running_time += 1
			if (active_app === monitor_app) {
				active_time += 1
				time_spent[time_spent.length - 1] = Math.floor((active_time / total_time) * 100)
			}
			this.setState({ running_time: running_time, time_spent, active_time })
		}, 1000)
		this.global_timeout = interval
		setTimeout(() => {
			clearInterval(interval)
			if (time_spent.length === 4) {
				time_spent.splice(0, 1)
			}
			this.setState({ running_time: 0, time_spent, active_time: 0 })
			this.run_backend()
		}, total_time * 1000)
	}

	render() {
		// const timeSpent = [100, 75, 50, 25]

		const itemStyle = {
			color: 'black',
			background: '#ccc',
			border: '2px solid #333',
			maxWidth: '25px',
			minHeight: '25px',
			maxHeight: '25px',
			borderRadius: '50%',
			padding: '5px',
			margin: '5px 0'
		}

		return (
			<div 
				style={{
					maxWidth: '50px',
					background: '#ccc',
					padding: '10px',
					borderRadius: '15px',
					fontFamily: 'monospace'
					}}
			>
				<div
					className='container'
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<ul
						className='app-list'
						style={{
							listStyle: 'none',
							padding: '0 0 5px 0',
							margin: 0,
							textAlign: 'center',
						}}
					>
						{this.state.time_spent.map((elem) => {
							return (
								<li style={itemStyle}>
									<span className='app-item'>{`${elem} %`}</span>
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
							style={{
								maxWidth: '25px',
								minHeight: '25px',
								background: '#ccc',
								border: '2px solid #333',
								borderRadius: '25px',
								cursor: 'pointer',
							}}
						>
							▶
						</button>
					) : (
						<Fragment>
							<button
								onClick={() => {
									clearInterval(this.global_timeout)
									this.setState({ running_time: 0, time_spent: [], active_time: 0, backend_running: false })
								}}
								className='pause-button'
								style={{
									maxWidth: '25px',
									minHeight: '25px',
									background: '#ccc',
									border: '2px solid #333',
									borderRadius: '25px',
									cursor: 'pointer',
								}}
							>
								||
							</button>
							{this.state.running_time}
						</Fragment>
					)}
				</div>
				<div className='active-app draggable' style={{ paddingTop: '20px' }}>
					Active App: {this.state.active_app}
				</div>
				<div className='monitor-app draggable disable' style={{ paddingTop: '20px' }}>
					Monitor App: {this.state.monitor_app}
				</div>
				{/* <div className=''>{JSON.stringify(this.state)}</div> */}
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
