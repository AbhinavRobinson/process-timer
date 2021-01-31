import { IHealth } from './App'

// Color grad logic
const getColorForPercentage = (percentage: number) => {
	let red = 255
	let green = 255
	if (percentage >= 0 && percentage <= 0.5) {
		// decreases green
		green = 510 * percentage
	} else if (percentage > 0.5 && percentage <= 1) {
		// increases red
		red = -510 * percentage + 510
	}

	// red below 50%
	if (percentage < 0.5 && percentage != 0) {
		green = 0
		red = 255
		// document.getElementById('itemStyle').style.color = 'white'
	}

	// at Zero
	if (percentage == 0) {
		green = 0
		red = 255
	}

	return 'rgb(' + [red, green, 0].join(',') + ')'
}

// Get color grad and fill bubble
export const getStyle = (elem: IHealth) => {
	let color = getColorForPercentage(elem.display_percentage / 100)

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

// TODO:
export let macPermissionCheck
if (process.platform === 'darwin') {
	let permissions
	if (process.platform === 'darwin') {
		permissions = require('node-mac-permissions')
	}
	macPermissionCheck = (type: any) => {
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
}
