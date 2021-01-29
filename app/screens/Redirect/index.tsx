import React, { useEffect, useState } from 'react'
import firebase from 'firebase'
import Store from 'electron-store'
import App from '../App'
import LoginButtons from './LoginButtons'

const electron_store = new Store()

//Firebase Init
if (firebase.apps.length === 0)
	firebase.initializeApp({
		apiKey: 'AIzaSyDCXLT3OhYO1gMndDKAoPWAtRFY1DWZWTM',
		authDomain: 'nudge-299511.firebaseapp.com',
		projectId: 'nudge-299511',
		storageBucket: 'nudge-299511.appspot.com',
		messagingSenderId: '637558220392',
		appId: '1:637558220392:web:1097b5ef12e6c0ec75fddd',
		serviceAccountId: 'firebase-adminsdk-1extw@nudge-299511.iam.gserviceaccount.com',
		databaseURL: 'https://nudge-299511-default-rtdb.firebaseio.com/',
	})
const firestore = firebase.firestore()

export interface LoginState {
	closeHandler: boolean
	verifying: boolean
	loggedin: boolean
}

export const Redirect: React.FC = () => {
	const [loginState, changeLoginState] = useState<LoginState>({
		closeHandler: false,
		verifying: false,
		loggedin: false,
	})

	useEffect(() => {
		if (electron_store.get('auth')) {
			changeLoginState({
				...loginState,
				loggedin: true,
			})
		}
	}, [])

	return loginState.loggedin ? <App /> : <LoginButtons {...{ loginState, changeLoginState, electron_store, firebase, firestore }} />
}

export default Redirect
