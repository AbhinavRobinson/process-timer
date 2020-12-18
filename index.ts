import { app, BrowserWindow, globalShortcut, screen } from 'electron'
import { format as formatUrl } from 'url'
import * as path from 'path'
import getFile from './run'

const log = require('electron-log')
const { autoUpdater } = require('electron-updater')
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

let mainWindow: null | BrowserWindow

const isDevelopment = process.env.NODE_ENV !== 'production'

function createMainWindow() {
	// console.log(__static, '45tyui')
	let display = screen.getPrimaryDisplay()

	const window = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false,
		},
		width: 120,
		height: 280,
		x: display.bounds.width - 60,
		// minHeight: 675,
		// minWidth: 1080,
		alwaysOnTop: true,
		frame: false,
		transparent: true,
		icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
	})

	// if (isDevelopment) {
	// 	window.webContents.openDevTools()
	// }

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
const monitor = require('active-window')

app.on('ready', () => {
	createMainWindow()
	// setInterval(() => {
	// 	getFile('',(data)=>{

	// 	})
	// }, 5000)
})
