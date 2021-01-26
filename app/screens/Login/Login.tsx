// import { remote } from 'electron'
import { remote } from 'electron'
import React, { useEffect } from 'react'

import './Login.css'

/**
 * Shows Login Screen
 */
const Login = () => {
	useEffect(() => {
		// const primary_display = remote.screen.getPrimaryDisplay()
		//Use for size
		remote.getCurrentWindow().setSize(200, 300)
		// remote.getCurrentWindow().setPosition(primary_display.bounds.width / 2 - 200, primary_display.bounds.height / 2 - 300)

		return () => {}
	}, [])
	return (
		<div className='flex login-container'>
			<div className='login login-box'>
				<h2>Login to Continue</h2>
				<button
					onClick={() => {
						remote.getCurrentWindow().setAlwaysOnTop(false)
						remote.getCurrentWindow().minimize()
					}}
				>
					Hide
				</button>
			</div>
		</div>
	)
}

export default Login
