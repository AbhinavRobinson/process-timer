import { app, ipcMain } from 'electron'
import { BrowserWindow } from 'electron'

import Container from 'typedi'
import { AppUpdaterContainer } from './AutoUpdater'
import { MainWindowClass } from './windows/MainWindowClass'
import { SideBarClass } from './windows/SideBarClass'

import './redux/MainStore'

import activeWin from 'active-win'
let permissions
if (process.platform === 'darwin') permissions = require('node-mac-permissions')

export const isDevelopment = process.env.NODE_ENV !== 'production'

const ignoreApp = isDevelopment ? 'Electron' : 'Nudge'
const browsers = ['Safari', 'Chrome', 'Edge', 'Brave ']

class Application {
	public AppContainer: MainWindowClass
	public SideBarContainer: SideBarClass
	private isSideBarOpen: boolean

	private intervalId: NodeJS.Timeout

	active_app = ''
	monitor_app = ''

	private win: BrowserWindow
	constructor() {
		this.init()
	}

	async init() {
		app.on('ready', async () => {
			this.win = null
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
	}

	handleEvents() {
		ipcMain.on('open_sidebar', (_) => {
			this.openSideBar()
		})

		ipcMain.on('loggedIn', (_) => {
			//do something here equivalent to refresh..................
			//this.MainWindowClass?.InnerWindow?.webContents.send('LoggedIn', state)
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

		// App tracking every 2 seconds
		if (process.platform !== 'win32')
			this.intervalId = setInterval(async () => {
				if (process.platform === 'darwin') {
					if (permissions.getAuthStatus('accessibility') !== 'authorized' || permissions.getAuthStatus('screen') !== 'authorized') {
						return
					}
				}
				const data = await activeWin()
				const appName: string = data?.owner?.name
				let currentActive: string
				if (!appName || appName.toUpperCase() === ignoreApp.toUpperCase()) return null
				if (browsers.some((browser) => appName.toUpperCase().includes(browser.toUpperCase()))) {
					if (this.active_app.toUpperCase() !== data.title.toUpperCase()) currentActive = data.title.toUpperCase()
				} else if (this.active_app.toUpperCase() !== data.owner?.name.toUpperCase()) currentActive = data.owner?.name.toUpperCase()

				if (currentActive && currentActive !== this.active_app) {
					this.active_app = currentActive
					this.AppContainer?.InnerWindow?.webContents?.send('appUpdate', currentActive)
				}
			}, 2000)

		this.AppContainer.InnerWindow.on('closed', () => {
			this.AppContainer = null
			this.SideBarContainer = null

			!(process.platform === 'win32') && clearInterval(this.intervalId)

			if (this.win) this.win.close()
			this.win = null
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
		let [p, q] = this.AppContainer.InnerWindow.getPosition()
		this.win = new BrowserWindow({ width: 330, height: 450 })
		p = p - 330
		this.win.setPosition(p, q + 50)
		this.win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
		this.win.setAlwaysOnTop(true, 'floating')
		this.win.setFullScreenable(false)
		this.win.setMenu(null)
		this.win.loadURL(`file://${__static}/timer/index.html`)
		this.win.once('ready', () => {
			this.win.show()
		})
	}
}

export const application = new Application()
