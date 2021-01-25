// IMPORT DEPENDENCIES

import { ipcRenderer } from 'electron'
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

import Call from '../../components/Call/Call'
import { SocketContainerClass } from '../../SocketContainer'

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
	channel: number
	token: string
}

export class SideBar extends Component<ISideBarProps, ISideBarState> {
	state = {
		active_users: {},
		active_user_ids: [],
		received_data: '',
		channel: -1,
		token: null,
	}
	static whyDidYouRender = true

	// private socket: any
	async componentDidMount() {
		const socket_container = Container.get(SocketContainerClass)
		// remote.getCurrentWindow().setBounds({
		// 	x: remote.screen.getPrimaryDisplay().bounds.width - 120,
		// 	y: remote.screen.getPrimaryDisplay().bounds.height / 2 - document.getElementById('outer').clientHeight,
		// })
		socket_container.init(true)
		socket_container.get_channel({
			callback: (data) => {
				const { channel, token } = data
				this.setState({ channel, token })
			},
		})
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
				<div className=''>{this.state.channel}</div>
				{/* <div className='received_data'>{this.state.received_data}</div> */}

				{/* <div className="disable-view-only"> */}
				<Call />

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
