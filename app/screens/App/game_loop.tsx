import { ipcRenderer } from 'electron'
import { join } from 'path'
import getFile from '../../../run'
import { App } from './App'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const ignoreApp = isDevelopment ? 'Electron' : 'Nudge'
const executableName = process.platform === 'win32' ? 'getwindow.exe' : 'main'
const executableLocation = join(__static, 'dist', executableName)

export const browsers = ['Safari', 'Chrome', 'Edge', 'Brave ']

export async function game_loop(obj: App) {
	obj.active_app_interval_timeout = setInterval(async () => {
		// For Windows
		getFile(executableLocation, (data) => {
			if (data['title'] !== ignoreApp) {
				if (data['app'] === 'chrome.exe') {
					if (data['title'] !== obj.active_app) obj.active_app = data['title']
				} else obj.active_app = data['app']
			}
		})
		ipcRenderer.emit('time_data', obj.state.time_spent)
	}, 2000)
}
