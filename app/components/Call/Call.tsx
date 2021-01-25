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
	const { localVideoTrack, leave, join, joinState, remoteUsers } = useAgora(client)
	// const { leave, join, joinState, remoteUsers } = useAgora(client)
	const [loading, changeLoading] = useState<boolean>(true)

	const [gameState, changeGameConfig] = useState<IAppState | null>(null)

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
			join(agoraConfig.appID, agoraConfig.channel, agoraConfig.token)
		}
	}, [loading, agoraConfig])

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
				<div className='local-player-wrapper'>
					<MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>
				</div>
				{!remoteUsers.length && (
					<p id='info'>
						Current App:
						{gameState?.active_app}
						{'\n'}
						Channel: {agoraConfig?.channel}
						{'\n'}
						<p>Waiting for another user to join...</p>
					</p>
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
			{/**
			 *  Confirmation Text
			 */}
			{/*
			<p className='local-player-text'>{!loading && joinState && localVideoTrack ? 'Connected' : 'Disconnected'}</p>
						*/}
			<div className='button-group'>
				<button
					id='leave'
					type='button'
					className='btn btn-primary btn-sm'
					disabled={!joinState}
					onClick={() => {
						leave()
						if (document.getElementById('leave').style.background == 'red') {
							document.getElementById('leave').style.background = '#87a3ff'
						} else {
							document.getElementById('leave').style.background = 'red'
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
					onClick={() => {
						if (document.getElementById('cam').style.background == 'red') {
							document.getElementById('cam').style.background = '#87a3ff'
						} else {
							document.getElementById('cam').style.background = 'red'
						}
					}}
				>
					<FontAwesomeIcon icon={faCamera} />
				</button>
				<button
					id='mic'
					type='button'
					className='btn btn-primary btn-sm'
					// disabled={!joinState}
					onClick={() => {
						if (document.getElementById('mic').style.background == 'red') {
							document.getElementById('mic').style.background = '#87a3ff'
						} else {
							document.getElementById('mic').style.background = 'red'
						}
					}}
				>
					<FontAwesomeIcon icon={faMicrophone} />
				</button>
			</div>
			<div className='game'>
				<Game {...{ gameState }} />
				<Game {...{ gameState }} />
			</div>
			<DragRegion />
		</div>
	)
}

export default Call
