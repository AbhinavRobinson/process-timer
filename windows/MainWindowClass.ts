import { BrowserWindow, screen } from 'electron'
import * as path from 'path'
import { isDevelopment } from '../index'

import { routes } from './utilities'

import Store from 'electron-store'
import { loadWindow } from './utilities'
const electron_store = new Store()

export class MainWindowClass {
	public InnerWindow: BrowserWindow
	constructor() {
		let display = screen.getPrimaryDisplay()

		this.InnerWindow = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				enableRemoteModule: true,
				webSecurity: false,
				devTools: isDevelopment,
			},
			// @important any changes here also need to be made in set_up_window.tsx, or it will override this.
			width: 120,
			height: 600,
			x: display.bounds.width - 200,
			alwaysOnTop: true,
			frame: false,
			transparent: process.platform === 'linux' ? false : true,
			icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
		})
		this.InnerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
		this.InnerWindow.setAlwaysOnTop(true, 'floating')
		this.InnerWindow.setFullScreenable(false)
	}

	async init(route: routes) {
		electron_store.set('socket', false)
		loadWindow(this.InnerWindow, route)

		this.InnerWindow.on('closed', () => {
			this.InnerWindow = null
		})

		this.InnerWindow.webContents.on('devtools-opened', () => {
			this.InnerWindow.focus()
			setImmediate(() => {
				this.InnerWindow.focus()
			})
		})

		this.InnerWindow.setBounds({
			x: screen.getPrimaryDisplay().bounds.width - 130,
		})
		return this.InnerWindow
	}
}
