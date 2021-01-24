import { BrowserWindow, screen } from 'electron'
import { format as formatUrl } from 'url'
import * as path from 'path'
import { isDevelopment } from '../index'

import Store from 'electron-store'
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
			width: 90,
			height: 470,
			x: display.bounds.width - 200,
			alwaysOnTop: true,
			frame: false,
			transparent: !isDevelopment ? true : process.platform === 'linux' ? false : true,
			icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
		})
		this.InnerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
		this.InnerWindow.setAlwaysOnTop(true, 'floating')
		this.InnerWindow.setFullScreenable(false)
	}

	async init() {
		electron_store.set('socket', false)
		if (isDevelopment) {
			this.InnerWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
		} else {
			this.InnerWindow.loadURL(
				formatUrl({
					pathname: path.join(__dirname, 'index.html'),
					protocol: 'file',
					slashes: true,
				})
			)
		}

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
			x: screen.getPrimaryDisplay().bounds.width - 120,
		})
		return this.InnerWindow
	}
}
