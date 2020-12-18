import { spawnSync } from 'child_process'
import { join } from 'path'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import getFile from '../run'

interface IAppState {
	static: string
	active_app: string
}

class App extends React.Component<{}, IAppState> {
	state = {
		static: __static,
		active_app: '',
	}
	async componentDidMount() {
		setInterval(() => {
			getFile(join(__static, 'dist', 'getwindow.exe'), (data) => {
				this.setState({ active_app: data })
			})
		}, 1000)
	}

	render() {
		const timeSpent = [100, 75, 50, 25]
		const itemStyle = {
			color: 'black',
			background: '#ccc',
			border: '2px solid #333',
			maxWidth: '25px',
			minHeight: '25px',
			borderRadius: '25px',
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
						alignItems: 'center'
					}}
				>
					<ul
						className='app-list'
						style={{
							listStyle: 'none',
							padding: '0 0 5px 0',
							margin: 0,
							textAlign:'center',
							
						}}
					>
						<li style={itemStyle}>
							<span className='app-item'>{timeSpent[0]}</span>
						</li>
						<li style={itemStyle}>
							<span className='app-item'>{timeSpent[1]}</span>
						</li>
						<li style={itemStyle}>
							<span className='app-item'>{timeSpent[2]}</span>
						</li>
						<li style={itemStyle}>
							<span className='app-item'>{timeSpent[3]}</span>
						</li>
					</ul>
					<button
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
				</div>
				<div className="active-app" style={{ display: 'none' }}>
					{this.state.active_app}
				</div>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
