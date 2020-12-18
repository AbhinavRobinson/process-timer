import { spawnSync } from 'child_process'
import { join } from 'path'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component<{}, { static: string }> {
	state = {
		static: __static,
	}
	async componentDidMount() {
		console.log(join(__static, 'dist', 'getwindow.exe'))
	}

	render() {
		const timeSpent = [0,0,0,0]

		return (
			<div className="container flex flex-column">
				<ul className="app-list flex flex-column"> 
					<li><span className="app-item">{timeSpent[0]}</span>%</li>
					<li><span className="app-item">{timeSpent[1]}</span>%</li>
					<li><span className="app-item">{timeSpent[2]}</span>%</li>
					<li><span className="app-item">{timeSpent[3]}</span>%</li>
				</ul>
				<button className="play-button bg-dark">▶</button>	
			</div>
		)		
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
