import { BrowserWindow, screen } from 'electron'
import path from 'path'
import { isDevelopment } from '..'
import { format as formatUrl } from 'url'

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
			height: 420,
			...position,
			alwaysOnTop: true,
			frame: false,
			transparent: !isDevelopment ? true : process.platform === 'linux' ? false : true,
			icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
		})
		this.InnerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
		this.InnerWindow.setAlwaysOnTop(true, 'floating')
		this.InnerWindow.setFullScreenable(false)
	}

	init() {
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
