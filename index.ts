import { app, BrowserWindow, globalShortcut, screen } from 'electron'
import { format as formatUrl } from 'url'
import * as path from 'path'

const isDevelopment = process.env.NODE_ENV !== 'production'

class MainWindowClass {
	private mainWindow: BrowserWindow
	constructor() {
		let display = screen.getPrimaryDisplay()

		this.mainWindow = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
				webSecurity: false,
			},
			width: 300,
			height: 500,
			x: display.bounds.width - 200,
			alwaysOnTop: true,
			frame: false,
			transparent: true,
			icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
		})

		if (isDevelopment) {
			this.mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
		} else {
			this.mainWindow.loadURL(
				formatUrl({
					pathname: path.join(__dirname, 'index.html'),
					protocol: 'file',
					slashes: true,
				})
			)
		}

		this.mainWindow.on('closed', () => {
			this.mainWindow = null
		})

		this.mainWindow.webContents.on('devtools-opened', () => {
			this.mainWindow.focus()
			setImmediate(() => {
				this.mainWindow.focus()
			})
		})
	}

	init() {
		return this.mainWindow
	}
}

class Application {
	private AppContainer: MainWindowClass
	constructor() {
		app.on('ready', () => {
			this.AppContainer = new MainWindowClass()
		})
	}
}

export const application = new Application()
