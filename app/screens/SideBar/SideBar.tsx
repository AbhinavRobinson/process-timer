import React, { Component, Fragment } from 'react'
import Container from 'typedi'
import { ApiMainLinks } from '../../api'
import DragBar from '../../components/DragBar'

interface ISideBarProps {}

interface ISideBarState {
	active_users: {
		[socketid: string]: {
			user_id: string
			user_details: {
				name: string
				email: string
				profile_pic: string
			}
		}
	}
	active_user_ids: Array<string>
}

export class SideBar extends Component<ISideBarProps, ISideBarState> {
	state = {
		active_users: {},
		active_user_ids: [],
	}

	async componentDidMount() {
		const active_users = await Container.get(ApiMainLinks).fetchActiveUsers()
		const active_user_ids = []

		Object.keys(this.state.active_users).map((key) => {
			const active_user = this.state.active_users[key]
			active_user_ids.push(active_user)
		})
		console.log(active_user_ids, active_users)
		this.setState({ active_users })
		setInterval(async () => {
			const active_users = await Container.get(ApiMainLinks).fetchActiveUsers()
			this.setState({ active_users })
		}, 30 * 1000) // Update after 30 seconds
	}

	render() {
		return (
			<Fragment>
				<DragBar></DragBar>
				{Object.keys(this.state.active_users).map((key) => {
					const active_user = this.state.active_users[key]
					return (
						<p>
							{active_user.user_details.name} {active_user.user_id}
						</p>
					)
				})}
			</Fragment>
		)
	}
}
