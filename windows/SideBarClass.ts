import { BrowserWindow, screen } from 'electron'
import path from 'path'
import { isDevelopment } from '..'

interface BrowserWindowPosition {
	x?: number
	y?: number
}
export class SideBarClass {
	public InnerWindow: BrowserWindow

	constructor(position: BrowserWindowPosition) {
		this.InnerWindow = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				enableRemoteModule: true,
				webSecurity: false,
			},
			width: 300,
			height: 625,
			...position,
			alwaysOnTop: true,
			frame: false,
			transparent: process.platform === 'linux' ? false : true,
			icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
		})
		this.InnerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
		this.InnerWindow.setAlwaysOnTop(true, 'floating')
		this.InnerWindow.setFullScreenable(false)
	}

	init() {
		if (isDevelopment) {
			this.InnerWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?game`)
		} else {
			this.InnerWindow.loadURL(`file://${path.join(__dirname, 'index.html?game')}`)
		}
		this.InnerWindow.setBounds({
			x: screen.getPrimaryDisplay().bounds.width - 150,
		})
	}

	close() {
		if (this.InnerWindow !== null) {
			this.InnerWindow.close()
			this.InnerWindow = null
		}
	}
}
