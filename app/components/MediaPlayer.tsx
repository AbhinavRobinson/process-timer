import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng'
import React, { useRef, useEffect } from 'react'

export interface VideoPlayerProps {
	videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined
	audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined
}

/**
 * Internal Agora Handler Function
 * @returns window with video
 */
const MediaPlayer = (props: VideoPlayerProps) => {
	const container = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (!container.current) return null
		props.videoTrack?.play(container.current)
		return () => {
			props.videoTrack?.stop()
		}
	}, [container, props.videoTrack])
	useEffect(() => {
		props.audioTrack?.play()
		return () => {
			props.audioTrack?.stop()
		}
	}, [props.audioTrack])
	useEffect(() => {
		try {
			const divi = container.current.children[0] as HTMLDivElement
			divi.style.background = '#eeeeee'
			divi.style.borderRadius = '20px'
		} catch (err) {}
	})
	return <div ref={container} className='video-player' style={{ width: '200px', height: '150px' }}></div>
}

export default MediaPlayer
