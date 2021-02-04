import { ipcRenderer, remote } from 'electron'
import Container from 'typedi'
import { LoginProps } from './LoginButtons'

type utilityFunction = (obj: LoginProps, credential?: any) => Promise<void>

export const initUser: utilityFunction = async ({ electron_store, changeLoginState, loginState, firestore }, credential) => {
	electron_store.set('auth', true)
	if (credential.user.email) {
		electron_store.set('email', credential.user.email)
	}

	electron_store.set('user_uid', credential.user.uid)
	if (credential.user.photoURL) {
		electron_store.set('profile_pic', credential.user.photoURL)
	}
	if (credential.user.displayName) {
		electron_store.set('name', credential.user.displayName)
	}
	changeLoginState({ ...loginState, loggedin: true })

	ipcRenderer.emit('update_user')
	const user_data = {
		name: credential.user.displayName,
		email: credential.user.email,
		profile_pic: credential.user.photoURL,
	}

	await firestore.collection('users').doc(credential.user.uid).set(user_data)
}

export const googleSignIn: utilityFunction = async ({ firestore, loginState, firebase, changeLoginState, electron_store }) => {
	const id = require('uuid').v4()
	const data = await firestore.collection('admin').doc('urls').get()
	const login_url = data.data()['login'] || 'nudge.aniketbiprojit.me'
	const oneTimeCodeRef = firebase.database().ref(`ot-auth-codes/${id}`)

	remote.shell.openExternal(`https://${login_url}/?ot-auth-code=${id}`)

	const userDetails = (resolve: any) =>
		oneTimeCodeRef.on('value', async (snapshot) => {
			const authToken = snapshot.val()
			if (authToken) {
				const credential = await firebase.auth().signInWithCustomToken(authToken)
				remote.getCurrentWindow().setAlwaysOnTop(true)
				initUser({ electron_store, changeLoginState, firebase, loginState, firestore }, credential)
				// changeLoginState({ LoginDialog: false })
				electron_store.set('auth', true)
				electron_store.set('email', credential.user.email)
				electron_store.set('name', credential.user.displayName)

				electron_store.set('profile_pic', credential.user.photoURL)
				electron_store.set('user_uid', credential.user.uid)

				remote.getCurrentWindow().show()
				remote.getCurrentWindow().focus()
				remote.getCurrentWindow().setAlwaysOnTop(true)
				remote.getCurrentWindow().setSize(120, 600)

				let user_data = {
					name: credential.user.displayName,
					email: credential.user.email,
					profile_pic: credential.user.photoURL,
				}
				await firestore.collection('users').doc(credential.user.uid).set(user_data)
				resolve()
				// return user_data
			}
		})
	return new Promise((resolve) =>
		setTimeout(() => {
			return userDetails(resolve)
		}, 1000)
	)
}
