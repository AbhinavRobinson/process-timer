import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import useAgora from './hooks/useAgora'
import MediaPlayer from './components/MediaPlayer'
import './Call.css'

import { API } from 'aws-amplify'

const remote = require('electron').remote

interface agoraState {
	appID: string
	token: string
	channel: string
}

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' })

async function getAgoraToken(changeLoading: React.Dispatch<React.SetStateAction<boolean>>): Promise<agoraState> {
	const { appID } = await API.get('mainApi', '/agora/appId', {})
	const { token, channel } = await API.post('mainApi', '/agora/token', {})
	changeLoading(false)
	return { appID, token, channel }
}

function Call() {
	const [agoraConfig, changeAgoraConfig] = useState<agoraState | null>(null)
	const { localVideoTrack, leave, join, joinState, remoteUsers } = useAgora(client)
	const [loading, changeLoading] = useState<boolean>(true)

	useEffect(() => {
		getAgoraToken(changeLoading).then(changeAgoraConfig).catch(console.error)
	}, [])

	useEffect(() => {
		if (!loading && agoraConfig) join(agoraConfig.appID, agoraConfig.channel, agoraConfig.token)
	}, [loading, agoraConfig])

	if (loading)
		return (
			<div className='call'>
				<p>Loading...</p>
			</div>
		)

	return (
		<div className='call'>
			<div className='player-container'>
				<div className='local-player-wrapper'>
					<MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>
				</div>
				{!remoteUsers.length && <p>Waiting for another user to join...</p>}
				{remoteUsers.map((user) => (
					<div className='remote-player-wrapper' key={user.uid}>
						<p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
						<MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
					</div>
				))}
			</div>
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
						remote.getCurrentWindow().close()
					}}
				>
					Leave
				</button>
			</div>
		</div>
	)
}

export default Call
