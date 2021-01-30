import * as React from 'react'
import ReactTooltip from 'react-tooltip'
import { LoginState } from './index'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaUserLock } from 'react-icons/fa'
import './Login.css'

import Store from 'electron-store'
import { CloseHandler } from '../../components/CloseHandler'
import DragRegion from '../../components/DragRegion'
import { Prompt } from '../../components/Prompt'
import { googleSignIn } from './utilities'
import firebase from 'firebase'

export interface LoginProps {
	loginState: LoginState
	changeLoginState: React.Dispatch<React.SetStateAction<LoginState>>
	electron_store: Store<Record<string, unknown>>
	firebase: typeof firebase
	firestore: firebase.firestore.Firestore
}

const LoginButtons: React.FC<LoginProps> = ({ loginState, changeLoginState, electron_store, firebase, firestore }) => {
	return (
		<>
			<ReactTooltip type='dark' delayShow={750} effect='solid' />
			<div className='login-wrapper' id='outer'>
				<div className='text-container'>
					<h1 className='head'>Welcome to Nudge</h1>
					<p className='subhead'>Get work done at home.</p>
				</div>
				<div className='button-container'>
					<button
						onClick={() => {
							if (!loginState.verifying) {
								changeLoginState({ ...loginState, verifying: true })
								googleSignIn({ changeLoginState, loginState, firestore, firebase, electron_store })
							} else {
								changeLoginState({ ...loginState, verifying: false })
								Prompt('info', 'Oops!! A window is already opened or something went wrong, press login again for a fresh start!')
							}
						}}
						className='login-button'
						data-tip='Login'
					>
						<FaUserLock className='login-icon' />
						Login
					</button>
					<button
						onClick={() => {
							if (!loginState.closeHandler) {
								changeLoginState({ ...loginState, closeHandler: true })

								CloseHandler('warning', 'Do you want to close Nudge?', () => {
									changeLoginState({ ...loginState, closeHandler: false })
								})
							}
						}}
						className='exit-button'
						data-tip='Exit'
					>
						<FontAwesomeIcon icon={faTimes} className='exit-icon' />
						Close
					</button>
				</div>
				<div className='drag-container'>
					<DragRegion />
				</div>
			</div>
		</>
	)
}

export default LoginButtons
