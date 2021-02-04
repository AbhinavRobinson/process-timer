// IMPORT DEPENDENCIES

import { ipcRenderer, remote } from 'electron'
// import { remote } from 'electron/renderer'
import React, { Component } from 'react'
import { Container } from 'typedi'
// import Container from 'typedi'
// import { ApiMainLinks } from '../../api'

// if (true) {
// const whyDidYouRender = require('@welldone-software/why-did-you-render')
// 	whyDidYouRender(React, {
// 		trackAllPureComponents: true,
// 	})
// }
import firebase from 'firebase'

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

const firestore = firebase.firestore()

import Call from '../../components/Call/Call'
import { SocketContainerClass } from '../../SocketContainer'
import { log } from 'electron-log'

interface ISideBarProps {}

type UserDataType = {
	user_id: string
	user_details: {
		name: string
		email: string
		profile_pic: string
	}
}

interface ISideBarState {
	active_users: {
		[socketid: string]: UserDataType
	}
	active_user_ids: Array<string>
	received_data: string
	channel: string
	token: string
	error: string | undefined
}

export class SideBar extends Component<ISideBarProps, ISideBarState> {
	state = {
		active_users: {},
		active_user_ids: [],
		received_data: '',
		channel: '-1',
		token: null,
		error: undefined,
	}
	static whyDidYouRender = true

	// private socket: any
	async componentDidMount() {
		const socket_container = Container.get(SocketContainerClass)
		const develop = false
		const url = `wss://socket.nudge.aniketbiprojit.me`
		this.initSocket(socket_container, url, develop)
		remote.getCurrentWindow().setSize(220, 625)
		remote.getCurrentWindow().setBounds({
			x: remote.screen.getPrimaryDisplay().bounds.width - 315,
		})
		setInterval(() => {
			if (this.state.channel === '-1') {
				window.location.reload()
			}
		}, 2000)
	}

	/**
	 * Initialize socket and call update channels.
	 */
	private initSocket(socket_container: SocketContainerClass, url: string, develop: boolean = false) {
		socket_container.init(url)
		this.update_channel(socket_container)
	}

	private update_channel(socket_container: SocketContainerClass) {
		try {
			socket_container.get_channel({
				callback: (data) => {
					const { channel, token } = data
					this.setState({ channel, token: token.toString() })
				},
			})
		} catch (err) {
			this.setState({ error: err.toString() })
		}
	}

	onChatResponse() {
		// Container.get(PeerContainer).peer.on('connection', (conn) => {
		// 	conn.on('data', (data) => {
		// 		console.log(data, 2)
		// 	})
		// 	console.log('connected')
		// })
	}

	render() {
		return (
			<>
				{/*<div className='' style={{ backgroundColor: 'white' }}>
					{this.state.channel}
				</div>
				<div className='' style={{ backgroundColor: 'white' }}>
					{this.state.token}
				</div>*/}
				{/* <div className='received_data'>{this.state.received_data}</div> */}

				{/* <div className="disable-view-only"> */}
				{/*<Call channel={this.state.channel.toString()} token={this.state.token} error={this.state.error} />*/}
				<Call {...this.state} />

				{/* </div> */}
				{/*Object.keys(this.state.active_users).map((key) => {
					const active_user = this.state.active_users[key]
					return (
						<Fragment>
							<p
								onClick={() => {
									this.send_connect(active_user, key)
								}}
							>
								{active_user.user_details.name}
							</p>
							<button
								onClick={() => {
									this.call(active_user, key)
								}}
							>
								Start
							</button>
						</Fragment>
					)
						})*/}
			</>
		)
	}

	answer(user: UserDataType, key: string) {
		ipcRenderer.emit('start_timer')
		ipcRenderer.on('time_data', (data) => {
			this.send_connect(user, key, {
				timer: data,
			})
		})
	}

	call(user: UserDataType, key: string) {
		ipcRenderer.emit('start_timer')
		ipcRenderer.on('time_data', (data) => {
			this.send_connect(user, key, {
				timer: data,
			})
		})
		this.send_connect(user, key, {
			calling: { user, key },
		})
	}
	send_connect(user: UserDataType, key: string, data: any = 'hi') {
		// this.socket.emit('chat_message', {
		// 	data: data,
		// 	key: key,
		// })
		// this.socket.on('chat_response', (data) => {
		// 	console.log(data)
		// })
	}
}
