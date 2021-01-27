import { ipcRenderer } from 'electron'
import { join } from 'path'
import getFile from '../../../run'
import { App } from './App'
import activeWin from 'active-win'

const isDevelopment = process.env.NODE_ENV !== 'production'

const ignoreApp = isDevelopment ? 'Electron' : 'Nudge'
const executableName = process.platform === 'win32' ? 'getwindow.exe' : 'main'
const executableLocation = join(__static, 'dist', executableName)

const browsers = ['Safari', 'Chrome', 'Edge', 'Brave ']

export async function game_loop(obj: App) {
	obj.active_app_interval_timeout = setInterval(async () => {
		// For Windows
		if (process.platform === 'win32') {
			getFile(executableLocation, (data) => {
				if (data['title'] !== ignoreApp) {
					if (data['app'] === 'chrome.exe') {
						if (data['title'] !== obj.state.active_app) obj.setState({ active_app: data['title'] })
					} else obj.setState({ active_app: data['app'] })
				}
			})
		} else {
			// For MacOS and Linux

			const data = await activeWin()
			const appName: string = data?.owner?.name

			if (!appName || appName.toUpperCase() === ignoreApp.toUpperCase()) return null

			if (browsers.some((browser) => appName.toUpperCase().includes(browser.toUpperCase()))) {
				if (obj.state.active_app.toUpperCase() !== data.title.toUpperCase()) obj.setState({ active_app: data.title.toUpperCase() })
			} else if (obj.state.active_app.toUpperCase() !== data.owner?.name.toUpperCase())
				obj.setState({ active_app: data.owner?.name.toUpperCase() })
		}

		ipcRenderer.emit('time_data', obj.state.time_spent)
	}, 2000)
}
