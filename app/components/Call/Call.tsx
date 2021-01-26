// React-Electron
import React, { useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

// Agora
import AgoraRTC from 'agora-rtc-sdk-ng'
import useAgora from '../../hooks/useAgora'
import MediaPlayer from '../MediaPlayer'

// AWS
//import { API } from 'aws-amplify'

// LOCAL IMPORTS
import Game from '../Game'
import { IAppState } from '../../App'
import DragRegion from '../DragRegion'
import './Call.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faCloudDownloadAlt, faMicrophone, faPhoneSlash } from '@fortawesome/free-solid-svg-icons'
// *** END OF IMPORTS ***

const remote = require('electron').remote

/**
 * @interface agoraState local agora state
 */
interface agoraState {
	appID: string
	token: string
	channel: string
	users?: number
	error?: string
}

interface AVState {
	audio: boolean
	video: boolean
}

/**
 * Agora Config
 */
const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' })

interface CallProps {
	channel: string
	token: string
	error?: string
}

const appID = 'cbc3098a370649a09784656a887ffd96'
/**
 * @returns Agora Token and Channels
 * @param changeLoading provide loading confirm
 */
//async function getAgoraToken(changeLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<agoraState> {
//	const { token, channel, appID, users } = await API.post('mainApi', '/agora/token', {})
//	changeLoading(false)
//	return { appID, token, channel, users }
//}

/**
 * @returns Agora Call and Game Component
 */
const Call: React.FC<CallProps> = ({ channel, token, error }) => {
	const [agoraConfig, changeAgoraConfig] = useState<agoraState | null>(null)

	/**
	 * @see localVideoTrack enables you to view local video feed
	 */
	const { localVideoTrack, localAudioTrack, leave, join, joinState, remoteUsers } = useAgora(client)

	const [loading, changeLoading] = useState<boolean>(true)

	const [gameState, changeGameConfig] = useState<IAppState | null>(null)

	const [avState, changeAV] = useState<AVState>({ video: true, audio: true })

	useEffect(() => {
		//	getAgoraToken(changeLoading)
		//		.then((state) => changeAgoraConfig({ ...state, channel, token }))
		//		.catch(console.error)
		ipcRenderer.on('stateUpdate', (_, state) => {
			// console.log(state)
			changeGameConfig(state)
		})
	}, [])

	useEffect(() => {
		if (channel && token && !error) {
			changeAgoraConfig({ channel, token, appID })
			changeLoading(false)
		} else if (error) {
		}
	}, [token, channel, error])

	useEffect(() => {
		if (!loading && agoraConfig) {
			console.log({ joinedConfig: agoraConfig })
			joinState && leave()
			join(agoraConfig.appID, agoraConfig.channel, agoraConfig.token)
		}
	}, [loading, agoraConfig])

	useEffect(() => {
		if (joinState) {
			if (!avState.video) client.unpublish(localVideoTrack)
			else client.publish(localVideoTrack)
			if (!avState.audio) client.unpublish(localAudioTrack)
			else client.publish(localAudioTrack)
		}
	}, [avState])

	if (loading || error)
		return (
			<div className='loading'>
				{loading ? (
					<>
						<FontAwesomeIcon icon={faCloudDownloadAlt} />
						<h3>Engines warming up...</h3>
					</>
				) : (
					<h3>Error: {agoraConfig.error}</h3>
				)}
			</div>
		)

	return (
		<div className='call'>
			<div className='player-container'>
				{/**
				 * @see local-player-wrapper enables you to see local video feed (Call.tsx:53)
				 */}
				{avState.video && <MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>}
				{!remoteUsers.length && (
					<>
						{/* <div className='local-player-wrapper'>
							
						</div> */}
						{'\n'}
						<p id='info'>
							<p>Waiting for another user to join...</p>
						</p>
					</>
				)}
				{remoteUsers.map((user) => (
					<div className='remote-player-wrapper' key={user.uid}>
						{/**
						 * local player UID (debug)
						 */}
						{/*
						<p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
							*/}
						<MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
					</div>
				))}
			</div>

			<div className='button-group'>
				<button
					id='leave'
					type='button'
					className='btn btn-primary btn-sm'
					disabled={!joinState}
					onClick={() => {
						leave()
						if (document.getElementById('leave').style.background == '#f25') {
							document.getElementById('leave').style.background = '#fff'
							document.getElementById('leave').style.color = '#333'
						} else {
							document.getElementById('leave').style.background = '#f25'
							document.getElementById('leave').style.color = '#fff'
						}
						remote.getCurrentWindow().close()
					}}
				>
					<FontAwesomeIcon icon={faPhoneSlash} />
				</button>
				<button
					id='cam'
					type='button'
					className='btn btn-primary btn-sm'
					// disabled={!joinState}
					style={{ background: avState.video ? '#fff' : '#f25', color: avState.video ? '#333' : '#fff' }}
					onClick={() => changeAV({ ...avState, video: !avState.video })}
				>
					<FontAwesomeIcon icon={faCamera} />
				</button>
				<button
					id='mic'
					type='button'
					className='btn btn-primary btn-sm'
					// disabled={!joinState}
					style={{ background: avState.audio ? '#fff' : '#f25', color: avState.audio ? '#333' : '#fff' }}
					onClick={() => changeAV({ ...avState, audio: !avState.audio })}
				>
					<FontAwesomeIcon icon={faMicrophone} />
				</button>
			</div>
			<div className='game'>
				<Game {...{ gameState }} local={true} />
				<Game {...{ gameState }} local={false} />
			</div>
			<DragRegion />
		</div>
	)
}

export default Call
