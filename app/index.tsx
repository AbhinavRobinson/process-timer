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
}

class App extends React.Component<{}, IAppState> {
	state = {
		static: __static,
		active_app: '',
		monitor_app: '',
		backend_running: true,
		total_time: 300,
		time_spent: [100, 75, 50, 25],
		running_time: 0,
	}
	async componentDidMount() {
		setInterval(() => {
			getFile(join(__static, 'dist', 'getwindow.exe'), (data) => {
				this.setState({ active_app: data })
			})
		}, 1000)
	}

	run_backend() {
		const { total_time } = this.state
		let time_spent = this.state.time_spent
		time_spent.push(0)
		this.setState({ time_spent })
		const interval = setInterval(() => {
			let { running_time, active_app, monitor_app } = this.state
			if (active_app === monitor_app) {
				running_time += 1
				time_spent[time_spent.length - 1] = (running_time / total_time) * 100
			}
			this.setState({ running_time: running_time, time_spent })
		}, 1000)
		setTimeout(() => {
			clearInterval(interval)
		}, 300 * 1000)
	}

	render() {
		// const timeSpent = [100, 75, 50, 25]

		const itemStyle = {
			color: 'black',
			background: '#ccc',
			border: '2px solid #333',
			maxWidth: '25px',
			minHeight: '25px',
			borderRadius: '25px',
			padding: '5px',
			margin: '5px 0',
		}

		return (
			<div className='draggable'
				style={{
					maxWidth: '50px',
					background: '#ccc',
					padding: '10px',
					borderRadius: '15px',
					fontFamily: 'monospace',
					WebkitUserSelect: 'none'
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
									<span className='app-item'>{elem}</span>
								</li>
							)
						})}
					</ul>
					{this.state.backend_running ? (
						<button
							onClick={() => {
								const { active_app } = this.state
								this.setState({ monitor_app: active_app, backend_running: true })
							}}
							className='play-button'
							style={{
								maxWidth: '25px',
								minHeight: '25px',
								background: '#ccc',
								border: '2px solid #333',
								borderRadius: '25px',
							}}
						>
							▶
						</button>
					) : (
						<Fragment>Pause</Fragment>
					)}
				</div>
				<div
					className='active-app'
					 style={{ display: 'none' }}
				>
					{this.state.active_app}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
