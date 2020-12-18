import { app, BrowserWindow, globalShortcut } from 'electron'
import { format as formatUrl } from 'url'
import * as path from 'path'

const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

let mainWindow: null | BrowserWindow

const isDevelopment = process.env.NODE_ENV !== 'production'

function createMainWindow() {
	// console.log(__static, '45tyui')
	const window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false,
		},
		width: 1440,
		height: 900,
		minHeight: 675,
		minWidth: 1080,
		icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
	})

	if (isDevelopment) {
		window.webContents.openDevTools()
	}

	if (isDevelopment) {
		// noinspection JSIgnoredPromiseFromCall
		window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
	} else {
		// noinspection JSIgnoredPromiseFromCall
		window.loadURL(
			formatUrl({
				pathname: path.join(__dirname, 'index.html'),
				protocol: 'file',
				slashes: true,
			})
		)
	}

	window.on('closed', () => {
		mainWindow = null
	})

	window.webContents.on('devtools-opened', () => {
		window.focus()
		setImmediate(() => {
			window.focus()
		})
	})

	return window
}

app.on('ready', () => {
	createMainWindow()
})
