import { useState, useEffect } from 'react'
import AgoraRTC, {
	IAgoraRTCClient,
	IAgoraRTCRemoteUser,
	MicrophoneAudioTrackInitConfig,
	CameraVideoTrackInitConfig,
	IMicrophoneAudioTrack,
	ICameraVideoTrack,
	ILocalVideoTrack,
	ILocalAudioTrack,
} from 'agora-rtc-sdk-ng'

interface AVState {
	audio: boolean
	video: boolean
}

/**
 * Internal Agora Service Handler
 * @param client
 */
export default function useAgora(
	client: IAgoraRTCClient | undefined
): {
	localAudioTrack: ILocalAudioTrack | undefined
	localVideoTrack: ILocalVideoTrack | undefined
	joinState: boolean
	leave: Function
	join: Function
	remoteUsers: IAgoraRTCRemoteUser[]
	avState: AVState
	changeAV: React.Dispatch<React.SetStateAction<AVState>>
} {
	const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined)
	const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined)

	const [joinState, setJoinState] = useState(false)

	const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([])

	const [avState, changeAV] = useState<AVState>({ video: true, audio: true })

	async function createLocalTracks(
		audioConfig?: MicrophoneAudioTrackInitConfig,
		videoConfig?: CameraVideoTrackInitConfig
	): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
		const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig)
		setLocalAudioTrack(microphoneTrack)
		setLocalVideoTrack(cameraTrack)
		return [microphoneTrack, cameraTrack]
	}

	async function join(appid: string, channel: string, token?: string, uid?: string | number | null) {
		if (!client) return null

		// still sets state true even if mic or camera not connected
		setJoinState(true)

		const [microphoneTrack, cameraTrack] = await createLocalTracks()

		await client.join(appid, channel, token || null)
		await client.publish([microphoneTrack, cameraTrack])
		;(window as any).client = client
		;(window as any).videoTrack = cameraTrack
	}

	async function leave() {
		if (localAudioTrack) {
			localAudioTrack.stop()
			localAudioTrack.close()
		}
		if (localVideoTrack) {
			localVideoTrack.stop()
			localVideoTrack.close()
		}
		setRemoteUsers([])
		setJoinState(false)
		await client?.leave()
	}

	useEffect(() => {
		if (!client) {
			return null
		} else {
			setRemoteUsers(client.remoteUsers)

			const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
				await client.subscribe(user, mediaType)
				// toggle rerender while state of remoteUsers changed.
				setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers))
			}
			const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
				setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers))
			}
			const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
				setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers))
			}
			const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
				setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers))
			}
			client.on('user-published', handleUserPublished)
			client.on('user-unpublished', handleUserUnpublished)
			client.on('user-joined', handleUserJoined)
			client.on('user-left', handleUserLeft)

			return () => {
				client.off('user-published', handleUserPublished)
				client.off('user-unpublished', handleUserUnpublished)
				client.off('user-joined', handleUserJoined)
				client.off('user-left', handleUserLeft)
			}
		}
	}, [client])

	useEffect(() => {
		if (joinState) {
			if (!avState.video) {
				client.unpublish(localVideoTrack)
			} else {
				client.publish(localVideoTrack)
			}
			if (!avState.audio) {
				client.unpublish(localAudioTrack)
			} else {
				client.publish(localAudioTrack)
			}
		}
	}, [avState])

	return {
		localAudioTrack,
		localVideoTrack,
		joinState,
		leave,
		join,
		remoteUsers,
		avState,
		changeAV,
	}
}
