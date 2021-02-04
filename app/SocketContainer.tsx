import Container, { Service } from 'typedi'
import socket from 'socket.io-client'

import Store from 'electron-store'

import firebase from 'firebase'

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

const electron_store = new Store()

@Service()
export class SocketContainerClass {
	public io: SocketIOClient.Socket
	private url = `wss://socket.nudge.aniketbiprojit.me/`

	constructor() {
		let runner = async () => {
			const data = await firestore.collection('admin').doc('urls').get()
			const data_url = data.data()['socket'] || 'socket.nudge.aniketbiprojit.me'
			this.url = `wss://${data_url}`
		}
		runner()
	}

	on_receive_update(callback) {
		try {
			this.io.on('receive_state', (state) => {
				callback(state)
			})
		} catch (err) {
			console.error(err)
		}
	}
	send_state(state) {
		try {
			this.io.emit('send_state', state)
		} catch (err) {
			console.error(err)
		}
	}

	async init(develop: boolean = false) {
		if (develop) {
			this.url = 'ws://localhost:8080'
		}
		this.io = socket(this.url)
		this.io.on('connect', () => {
			this.store_uid()
		})
		this.io.io.on('chat_response', (data) => {
			console.log(data, 1)
		})
	}

	store_uid() {
		try {
			console.log(electron_store.get('user_uid'))
			this.io.emit('store_uid', {
				user_id: electron_store.get('user_uid'),
			})

			this.io.on('chat_response', (data) => {
				console.log(data, 1)
			})
			// this.io.
		} catch (error) {
			console.error(error)
		}
	}

	get_channel({ callback }: { callback: (data) => void }) {
		this.io.on('update_channel', (e) => {
			console.log(e, 'get_channel')
			callback(e)
		})
	}

	disconnect() {
		this.io.disconnect()
	}
}
