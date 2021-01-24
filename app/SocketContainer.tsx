import Container, { Service } from 'typedi'
import socket from 'socket.io-client'

import Store from 'electron-store'

const electron_store = new Store()

@Service()
export class SocketContainerClass {
	public io: SocketIOClient.Socket
	private url = `wss://${Container.get('url')}/`

	// constructor() {
	// 	this.init()
	// }

	init(develop: boolean = false) {
		if (develop) {
			this.url = 'ws://localhost:8080'
		}
		this.io = socket(this.url)
		this.io.on('connect', () => {
			try {
				console.log(electron_store.get('user_uid'))
				this.io.emit('store_uid', {
					user_id: electron_store.get('user_uid'),
				})

				this.io.on('chat_response', (data) => {
					console.log(data, 1)
				})
				// this.io.
			} catch (error) {}
		})
		this.io.io.on('chat_response', (data) => {
			console.log(data, 1)
		})
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
