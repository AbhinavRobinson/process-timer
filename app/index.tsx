import firebase from 'firebase'

import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'

import { HashRouter as Router, Route, Switch } from 'react-router-dom'

import { App } from './App'
import { SideBar } from './screens/SideBar/SideBar'

import './css/index.css'
import './css/utilities.css'
import Container from 'typedi'

const { ipcRenderer } = require('electron')

class Main extends Component {
	constructor(props) {
		super(props)
		Container.set('url', 'socket.nudge.aniketbiprojit.me')
	}
	async componentDidMount() {
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
	}
	render() {
		return (
			<Fragment>
				<Router>
					<Switch>
						<Route exact path='/'>
							{ipcRenderer.sendSync('sidebar_open_check') ? <SideBar /> : <App />}
						</Route>
					</Switch>
				</Router>
			</Fragment>
		)
	}
}

ReactDOM.render(<Main />, document.getElementById('app'))
