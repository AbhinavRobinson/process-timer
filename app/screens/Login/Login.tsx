// import { remote } from 'electron'
import React, { useEffect } from 'react'

import './Login.css'

/**
 * Shows Login Screen
 */
const Login = () => {
	useEffect(() => {
		// const primary_display = remote.screen.getPrimaryDisplay()
		// remote.getCurrentWindow().setPosition(primary_display.bounds.x / 2, primary_display.bounds.y / 2)
		return () => {}
	}, [])
	return (
		<div className='flex login-container'>
			<div className='login login-box'>
				<h2>Login to Continue</h2>
			</div>
		</div>
	)
}

export default Login
