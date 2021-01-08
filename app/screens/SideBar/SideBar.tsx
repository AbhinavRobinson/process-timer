// IMPORT DEPENDENCIES

import { ipcRenderer } from 'electron'
import React, { Component, Fragment } from 'react'
import Container from 'typedi'
import { ApiMainLinks } from '../../api'

// IMPORT COMPONENTS
import { App } from '../../App'

// DEPRECIATED >> Using Call Component instead!
// import Video from '../../components/Video'

import DragBar from '../../components/DragBar'
import { PeerContainer } from '../../PeerContainer'
import { SocketContainerClass } from '../../SocketContainer'
import Call from '../../Call'

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
}

export class SideBar extends Component<ISideBarProps, ISideBarState> {
	state = {
		active_users: {},
		active_user_ids: [],
		received_data: '',
	}
	private socket
	async componentDidMount() {
		Container.get(SocketContainerClass).init()
		Container.get(PeerContainer).init()
		this.socket = Container.get(SocketContainerClass).io
		this.socket.on('chat_response', (data) => {
			// console.log(data)
			if (data && data.data && data.data.timer) {
				console.log(data.data.timer, 'timer')
				this.setState({ received_data: JSON.stringify(data.data.timer) })
			}
			if (data && data.data && data.data.calling) {
				const key = data.sent_by
				const calling_user = this.state.active_users[key]
				this.answer(key, calling_user)
				// this.answer()
			}
		})
		const active_users = await Container.get(ApiMainLinks).fetchActiveUsers()
		console.log(active_users)
		// const active_user_ids = []

		this.setState({ active_users })
		setInterval(async () => {
			const active_users = await Container.get(ApiMainLinks).fetchActiveUsers()
			this.setState({ active_users })
		}, 5 * 1000) // Update after 30 seconds
	}

	onChatResponse() {
		Container.get(PeerContainer).peer.on('connection', (conn) => {
			conn.on('data', (data) => {
				console.log(data, 2)
			})
			console.log('connected')
		})
	}

	render() {
		return (
			<Fragment>
				<DragBar></DragBar>
				<div className='received_data'>{this.state.received_data}</div>
				<div className='disable-view-only'>
					<App></App>
				</div>
				{/* <div className="disable-view-only"> */}
				<Call />
				{/* </div> */}
				{Object.keys(this.state.active_users).map((key) => {
					const active_user = this.state.active_users[key]

					return (
						<Fragment>
							<p
								onClick={() => {
									this.send_connect(active_user, key)
								}}
							>
								{active_user.user_details.name} {active_user.user_id} {key}
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
				})}
			</Fragment>
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
		this.socket.emit('chat_message', {
			data: data,
			key: key,
		})

		this.socket.on('chat_response', (data) => {
			console.log(data)
		})
	}
}
