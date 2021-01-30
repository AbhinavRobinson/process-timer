import { BrowserWindow } from 'electron'
import { isDevelopment } from '..'
import * as path from 'path'
export type routes = 'default' | 'game' | 'worker'

export function loadWindow(win: BrowserWindow, route: routes) {
	if (isDevelopment) {
		win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?${route}`)
	} else {
		win.loadURL(`file://${path.join(__dirname, 'index.html')}?${route}`)
	}
}
