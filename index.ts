import { app, ipcMain } from 'electron'
import { BrowserWindow } from 'electron'

import Container from 'typedi'
import { AppUpdaterContainer } from './AutoUpdater'
import { MainWindowClass } from './windows/MainWindowClass'
import { SideBarClass } from './windows/SideBarClass'

export const isDevelopment = process.env.NODE_ENV !== 'production'

class Application {
	public AppContainer: MainWindowClass
	public SideBarContainer: SideBarClass
	private isSideBarOpen: boolean

	constructor() {
		this.init()
	}

	async init() {
		app.on('ready', async () => {
			this.AppContainer = new MainWindowClass()
			await this.AppContainer.init()
			this.handleEvents()
			if (process.platform === 'darwin') app.dock.hide()
		})
		this.isSideBarOpen = false
		if (process.env.NODE_ENV === 'production') {
			const sourceMapSupport = require('source-map-support')
			sourceMapSupport.install()
		}

		/** Init app updates. */
		Container.get(AppUpdaterContainer)

		//Asking for permissions on mac
		//	if (process.platform === 'darwin') {
		//		if (!hasPermissions()) hasPermissions({ ask: true })
		//		if (!hasPromptedForPermission()) hasScreenCapturePermission()
		//	}
	}

	handleEvents() {
		ipcMain.on('open_sidebar', (_) => {
			this.openSideBar()
		})

		ipcMain.on('open_timer', (_) => {
			this.openTimer()
		})

		ipcMain.on('sidebar_open_check', (e) => {
			e.returnValue = this.isSideBarOpen
		})

		ipcMain.on('control_state_change', (_, state) => {
			if (this.isSideBarOpen) this.SideBarContainer?.InnerWindow?.webContents.send('stateUpdate', state)
		})

		this.AppContainer.InnerWindow.on('closed', () => {
			this.AppContainer = null
			this.SideBarContainer = null
		})

		// TODO add a close_sidebar call: should be callable globally
	}

	openSideBar() {
		this.isSideBarOpen = true
		if (!this.SideBarContainer) {
			// AppCOntainer Updates
			const [x, y] = this.AppContainer.InnerWindow.getPosition()
			this.AppContainer.InnerWindow.setPosition(x + 75, y, true)
			this.AppContainer.InnerWindow.setOpacity(0.5)

			this.SideBarContainer = new SideBarClass({ x, y })
			this.SideBarContainer.init()

			this.SideBarContainer.InnerWindow.setPosition(x - 300, y, true)

			if (isDevelopment) {
				setInterval(() => this.SideBarContainer?.InnerWindow?.webContents.send('redirect', true), 1000)
			} else {
				const interval = setInterval(() => this.SideBarContainer?.InnerWindow?.webContents.send('redirect', true), 1000)
				setTimeout(() => {
					clearInterval(interval)
				}, 60000)
			}

			this.SideBarContainer.InnerWindow.on('closed', () => {
				this.AppContainer.InnerWindow.setPosition(x, y, true)
				this.AppContainer.InnerWindow.setOpacity(1)
				this.SideBarContainer = null
				this.isSideBarOpen = false
			})
		}
	}
	openTimer() {
		let win = null
		let [p, q] = this.AppContainer.InnerWindow.getPosition()
		win = new BrowserWindow({ width: 330, height: 450 })
		p = p - 330
		win.setPosition(p, q + 50)
		win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
		win.setAlwaysOnTop(true, 'floating')
		win.setFullScreenable(false)
		win.setMenu(null)
		win.loadURL(`file://${__static}/timer/index.html`)
		win.once('ready', () => {
			win.show()
		})
	}
}

export const application = new Application()
