import React, { Component, Fragment } from 'react'
import DragBar from './components/DragBar'

interface ISideBarProps {}

interface ISideBarState {}

export class SideBar extends Component<ISideBarProps, ISideBarState> {
	constructor(props: ISideBarProps) {
		super(props)
	}

	componentDidMount() {
		console.log('sidebar')
	}

	render() {
		return (
			<Fragment>
				<DragBar></DragBar>
			</Fragment>
		)
	}
}
