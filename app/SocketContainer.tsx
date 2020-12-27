import Container, { Service } from 'typedi'
import socket from 'socket.io-client'

import Store from 'electron-store'

const electron_store = new Store()

@Service()
export class SocketContainerClass {
	public io: SocketIOClient.Socket
	private readonly url = `ws://${Container.get('url')}/`

	// constructor() {
	// 	this.init()
	// }

	init() {
		this.io = socket(this.url)
		this.io.on('connect', () => {
			try {
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
}
