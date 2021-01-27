import { ipcRenderer } from 'electron'
import { join } from 'path'
import getFile from '../../../run'
import activeWin from 'active-win'
import { App } from './App'

const isDevelopment = process.env.NODE_ENV !== 'production'
const ignoreApp = isDevelopment ? 'Electron' : 'Nudge'

export function game_loop(obj: App) {
	obj.active_app_interval_timeout = setInterval(() => {
		// For Windows
		if (process.platform === 'win32') {
			getFile(join(__static, 'dist', 'getwindow.exe'), (data) => {
				if (data['title'] !== ignoreApp) {
					if (data['app'] === 'chrome.exe') {
						if (data['title'] !== obj.state.active_app) obj.setState({ active_app: data['title'] })
					} else obj.setState({ active_app: data['app'] })
				}
			})
		} else {
			// For MacOS and Linux
			if (process.platform === 'darwin') {
				;(async () => {
					const data = await activeWin()
					const appName: string = data?.owner?.name
					if (!appName) return null
					if (appName.toUpperCase() !== ignoreApp.toUpperCase() && obj.state.active_app.toUpperCase() !== data.owner?.name.toUpperCase())
						obj.setState({ active_app: data.owner?.name.toUpperCase() })
				})()
			} else {
				;(async () => {
					const data = await activeWin()
					const appName: string = data?.owner?.name
					if (!appName) return null
					if (appName.toUpperCase() !== ignoreApp.toUpperCase()) {
						if (appName.toUpperCase() === 'GOOGLE-CHROME') {
							obj.setState({ active_app: data.title.toUpperCase() })
						} else if (obj.state.active_app.toUpperCase() !== data.owner?.name.toUpperCase())
							obj.setState({ active_app: data.owner?.name.toUpperCase() })
					}
				})()
			}
		}
		ipcRenderer.emit('time_data', obj.state.time_spent)
	}, 2000)
}
