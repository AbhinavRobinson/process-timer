import Container, { Service } from 'typedi'
import Peer from 'peerjs'
import { SocketContainerClass } from './SocketContainer'

@Service()
export class PeerContainer {
	private peer: Peer
	init() {
		this.peer = new Peer(Container.get(SocketContainerClass).io.id, {
			host: `https://nudge.aniketbiprojit.me/peer`,
			secure: true,
		})
		this.peer.on('connection', () => {
			console.log('connected')
		})
	}
}
