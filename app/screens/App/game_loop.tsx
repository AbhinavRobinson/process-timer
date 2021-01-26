import { ipcRenderer } from 'electron'
import { join } from 'path'
import getFile from '../../../run'
import activeWin from '../../lib/active-win'
import { App } from './App'

export function game_loop(obj: App) {
	obj.active_app_interval_timeout = setInterval(() => {
		// For Windows
		if (process.platform === 'win32') {
			getFile(join(__static, 'dist', 'getwindow.exe'), (data) => {
				if (data['title'] !== 'Electron') {
					if (data['app'] === 'chrome.exe') obj.setState({ active_app: data['title'] })
					else obj.setState({ active_app: data['app'] })
				}
			})
		} else {
			// For MacOS and Linux
			// const monitor = require('./active-window')
			;(async () => {
				const data = await activeWin()
				const appName: string = data?.owner?.name
				if (!appName) return null
				const ignoreApp = 'Electron'
				if (appName.toUpperCase() !== ignoreApp.toUpperCase()) obj.setState({ active_app: data.owner?.name.toUpperCase() })
			})()
		}
		ipcRenderer.emit('time_data', obj.state.time_spent)
	}, 2000)
}
