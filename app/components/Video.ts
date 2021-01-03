import '../../token.json'

import AgoraRtcEngine from 'agora-electron-sdk'

export default function Video(height?: number, width?: number) {
	// RtcEngine.initialize(appid)
	// RtcEngine.setupLocalVideo(element)
	// RtcEngine.enableVideo()
	// RtcEngine.joinChannel(token, channel, info, uid)
	// RtcEngine.setupRemoveVideo(uid, view, info, channel)
	// RtcEngine.leaveChannel()

	console.log(height, width)
	return 'video stream'
}
