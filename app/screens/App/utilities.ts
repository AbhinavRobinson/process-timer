import { IHealth } from './App'
import permissions from 'node-mac-permissions'

// Color grad logic
const getColorForPercentage = (percentage: number) => {
	let red = 255
	let green = 255
	if (percentage >= 0 && percentage <= 0.5) {
		green = 510 * percentage
	} else if (percentage > 0.5 && percentage <= 1) {
		red = -510 * percentage + 510
	}

	return 'rgb(' + [red, green, 0].join(',') + ')'
}

// Get color grad and fill bubble
export const getStyle = (elem: IHealth) => {
	let color = getColorForPercentage(elem.health / 100)

	const fillStyle: React.CSSProperties = {
		backgroundColor: color,
		height: `${elem.percentage}%`,
		width: '100%',
		position: 'absolute',
		bottom: 0,
		left: 0,
	}

	return fillStyle
}

export const macPermissionCheck = (type: permissions.AuthType) => {
	let response = ''
	if (process.platform !== 'darwin') return response
	const status = permissions.getAuthStatus(type)
	switch (status) {
		case 'denied':
			{
				response = `You have denied ${type} permission to the app. Please go to System preferences > Security > ${type} and grant the Nudge app permission`
			}
			break
		case 'restricted':
			{
				response = `You are not allowed to give ${type} permission to this app. Try doing the same manually in Settings > Security > ${type}`
			}
			break
		case 'not determined':
			{
				switch (type) {
					case 'screen':
						permissions.askForScreenCaptureAccess()
						break
					case 'accessibility':
						permissions.askForAccessibilityAccess()
				}
				response = 'not determined'
			}
			break
	}
	return response ? `${response}\nRestart the app by pressing cmd+q and opening again after doing the needful.\n` : response
}
