import activeWin from 'active-win'
import { ipcRenderer } from 'electron'
let permissions
if (process.platform === 'darwin') permissions = require('node-mac-permissions')

const isDevelopment: boolean = ipcRenderer.sendSync('isDevelopment')
const ignoreApp = isDevelopment ? 'Electron' : 'Nudge'
const browsers = ['Safari', 'Chrome', 'Edge', 'Brave ']

let active_app: string = ''
let intervalId: NodeJS.Timeout

export default async function appTracker() {
	if (process.platform !== 'win32')
		intervalId = setInterval(async () => {
			if (process.platform === 'darwin') {
				if (permissions.getAuthStatus('accessibility') !== 'authorized' || permissions.getAuthStatus('screen') !== 'authorized') {
					return
				}
			}
			const data = await activeWin()
			const appName: string = data?.owner?.name
			let currentActive: string
			if (!appName || appName.toUpperCase() === ignoreApp.toUpperCase()) return null
			if (browsers.some((browser) => appName.toUpperCase().includes(browser.toUpperCase()))) {
				if (active_app.toUpperCase() !== data.title.toUpperCase()) currentActive = data.title.toUpperCase()
			} else if (active_app.toUpperCase() !== data.owner?.name.toUpperCase()) currentActive = data.owner?.name.toUpperCase()

			if (currentActive && currentActive !== active_app) {
				active_app = currentActive
				ipcRenderer.send('appUpdate', currentActive)
			}
		}, 2000)

	return () => clearInterval(intervalId)
}
