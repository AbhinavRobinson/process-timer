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
		return <div>v0.0.4</div>
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
