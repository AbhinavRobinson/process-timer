import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component<{}, { static: string }> {
	state = {
		static: __static,
	}
    async componentDidMount() {
		console.log(this.state.static)
		this.setState({ static: __static })
	}

	render() {
		return <div>
			v0.0.4
		</div>
		
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
