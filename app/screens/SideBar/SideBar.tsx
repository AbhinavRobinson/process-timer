import React, { Component, Fragment } from 'react'
import Container from 'typedi'
import { ApiMainLinks } from '../../api'
import DragBar from '../../components/DragBar'
import { PeerContainer } from '../../PeerContainer'
import { SocketContainerClass } from '../../SocketContainer'
// import { PeerContainer } from '../../PeerContainer'
// import { PeerContainer } from '../../PeerContainer'

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
}

export class SideBar extends Component<ISideBarProps, ISideBarState> {
	state = {
		active_users: {},
		active_user_ids: [],
	}

	async componentDidMount() {
		Container.get(SocketContainerClass).init()
		Container.get(PeerContainer).init()
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
				{Object.keys(this.state.active_users).map((key) => {
					const active_user = this.state.active_users[key]

					return (
						<p
							onClick={() => {
								this.connect(active_user, key)
							}}
						>
							{active_user.user_details.name} {active_user.user_id} {key}
						</p>
					)
				})}
			</Fragment>
		)
	}
	connect(user: UserDataType, key: string) {
		const conn = Container.get(PeerContainer).peer.connect(key)

		conn.on('open', () => {
			console.log('sent')
			conn.send('hi' + user.user_details.name)
		})
		conn.on('error', (err) => {
			console.error('disconnected', err)
		})
		// throw new Error('Method not implemented.')
	}
}
