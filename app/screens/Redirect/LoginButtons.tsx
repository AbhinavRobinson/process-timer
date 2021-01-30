import * as React from 'react'
import ReactTooltip from 'react-tooltip'
import { LoginState } from './index'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaUserLock } from 'react-icons/fa'

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
			<div className='outer' id='outer'>
				<div className='container'>
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
						className='read-button'
						data-tip='Login'
					>
						<FaUserLock className='icon' />
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
						className='read-button sm'
						data-tip='Exit'
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>

				<div className='my-1'></div>
				<DragRegion />
			</div>
		</>
	)
}

export default LoginButtons
