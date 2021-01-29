// import { remote } from 'electron'
import { faEyeSlash, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { remote } from 'electron'
import React, { useEffect } from 'react'
import DragRegion from '../../components/DragRegion'

import './Login.css'

/**
 * Shows Login Screen
 */
const Login = ({ loginHandler }) => {
	useEffect(() => {
		// const primary_display = remote.screen.getPrimaryDisplay()
		//Use for size
		remote.getCurrentWindow().setSize(250, 200)
		// remote.getCurrentWindow().setPosition(primary_display.bounds.width / 2 - 200, primary_display.bounds.height / 2 - 300)

		return () => {}
	}, [])
	return (
		<div className='login-container'>
			<div className='login'>
				<button
					onClick={() => {
						remote.getCurrentWindow().setAlwaysOnTop(false)
						remote.getCurrentWindow().minimize()
					}}
				>
					<FontAwesomeIcon icon={faEyeSlash} style={{ color: '#333' }} />
				</button>
				<FontAwesomeIcon icon={faSignInAlt} className='icon' style={{ color: '#333' }} />
				<a
					href='#'
					onClick={(e) => {
						e.preventDefault()
						loginHandler()
					}}
				>
					<h2>Login to Nudge</h2>
				</a>
				<DragRegion />
			</div>
		</div>
	)
}

export default Login
