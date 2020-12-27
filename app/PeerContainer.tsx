import Container, { Service } from 'typedi'
import Peer from 'peerjs'
import { SocketContainerClass } from './SocketContainer'

@Service()
export class PeerContainer {
	public peer: Peer
	init() {
		this.peer = new Peer(Container.get(SocketContainerClass).io.id, {
			host: `nudge.aniketbiprojit.me`,
			path: '/peer',
			secure: true,
		})
		this.peer.on('connection', (conn) => {
			conn.on('data', (data) => {
				console.log(data, 1)
			})
			console.log('connected')
		})
	}
}
