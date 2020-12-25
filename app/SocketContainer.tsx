import { Service } from 'typedi'
import socket from 'socket.io-client'

import Store from 'electron-store'
const electron_store = new Store()

@Service()
export class SocketContainerClass {
	public io: SocketIOClient.Socket
	constructor() {
		this.init()
	}

	private init() {
		this.io = socket('ws://3.7.127.192:8080/')
		this.io.on('connect', () => {
			try {
				this.io.emit('store_uid', {
					user_id: electron_store.get('user_uid'),
				})
			} catch (error) {}
		})
	}
}
