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
		setTimeout(() => {
			if (this.state.channel === '-1') {
				socket_container.disconnect()
				this.initSocket(socket_container)
			}
		}, 5000)
	}

	private initSocket(socket_container: SocketContainerClass) {
		socket_container.init()
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
