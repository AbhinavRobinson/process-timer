import React, { useEffect, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import useAgora from './hooks/useAgora'
import MediaPlayer from './components/MediaPlayer'
import './Call.css'

import Token from '../token.json'

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' })

function Call() {
	const [appid, setAppid] = useState('')
	// USE DYNAMIC TOKEN INSTEAD
	const [token, setToken] = useState('')
	// const [token] = useState('')
	const [channel, setChannel] = useState('')
	const { localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers } = useAgora(client)

	// GET APP ID << TEST APP ID
	useEffect(() => {
		setAppid(Token.Agora.APP_ID)
	}, [])

	// USE DYNAMIC TOKEN INSTEAD
	// setToken(Token.Agora.Token)

	return (
		<div className='call'>
			<form className='call-form'>
				<label>
					AppID:
					<input
						type='text'
						name='appid'
						onChange={(event) => {
							setAppid(event.target.value)
						}}
					/>
				</label>
				<label>
					Token(Optional):
					<input
						type='text'
						name='token'
						onChange={(event) => {
							setToken(event.target.value)
						}}
					/>
				</label>
				<label>
					Channel:
					<input
						type='text'
						name='channel'
						onChange={(event) => {
							setChannel(event.target.value)
						}}
					/>
				</label>
				<div className='button-group'>
					<button
						id='join'
						type='button'
						className='btn btn-primary btn-sm'
						disabled={joinState}
						onClick={() => {
							join(appid, channel, token)
						}}
					>
						Join
					</button>
					<button
						id='leave'
						type='button'
						className='btn btn-primary btn-sm'
						disabled={!joinState}
						onClick={() => {
							leave()
						}}
					>
						Leave
					</button>
				</div>
			</form>
			<div className='player-container'>
				<div className='local-player-wrapper'>
					<p className='local-player-text'>
						{localVideoTrack && `localTrack`}
						{joinState && localVideoTrack ? `(${client.uid})` : ''}
					</p>
					<MediaPlayer videoTrack={localVideoTrack} audioTrack={undefined}></MediaPlayer>
				</div>
				{remoteUsers.map((user) => (
					<div className='remote-player-wrapper' key={user.uid}>
						<p className='remote-player-text'>{`remoteVideo(${user.uid})`}</p>
						<MediaPlayer videoTrack={user.videoTrack} audioTrack={user.audioTrack}></MediaPlayer>
					</div>
				))}
			</div>
		</div>
	)
}

export default Call
