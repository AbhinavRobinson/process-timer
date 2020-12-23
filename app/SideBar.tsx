import React, { Component, Fragment } from 'react'

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
		return <Fragment>SideBar</Fragment>
	}
}
