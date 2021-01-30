import { screen, app, ipcMain } from 'electron'
import { BrowserWindow } from 'electron'

import Container from 'typedi'
import { AppUpdaterContainer } from './AutoUpdater'
import { MainWindowClass } from './windows/MainWindowClass'
import { SideBarClass } from './windows/SideBarClass'

import './redux/MainStore'

export const isDevelopment = process.env.NODE_ENV !== 'production'

class Application {
	public AppContainer: MainWindowClass
	public SideBarContainer: SideBarClass
	public WorkerContainer: SideBarClass
	private isSideBarOpen: boolean

	private intervalId: NodeJS.Timeout

	active_app = ''
	monitor_app = ''

	// Local Windows
	private pomoWin: BrowserWindow
	private whatsappWin: BrowserWindow

	constructor() {
		this.init()
	}

	async init() {
		app.on('ready', async () => {
			this.pomoWin = null
			this.AppContainer = new MainWindowClass()
			await this.AppContainer.init('default')
			this.handleEvents()
			if (process.platform === 'darwin') app.dock.hide()
		})
		this.isSideBarOpen = false
		if (process.env.NODE_ENV === 'production') {
			const sourceMapSupport = require('source-map-support')
			sourceMapSupport.install()
		}

		/** Init app updates. */
		Container.get(AppUpdaterContainer).init()
	}

	handleEvents() {
		ipcMain.on('open_sidebar', (_) => {
			this.openSideBar()
		})

		ipcMain.on('open_timer', (_) => {
			this.openTimer()
		})

		ipcMain.on('open_whatsapp', (_) => {
			this.openWhatsapp()
		})

		ipcMain.on('isDevelopment', (e) => {
			e.returnValue = isDevelopment
		})

		ipcMain.on('control_state_change', (_, state) => {
			if (this.isSideBarOpen) this.SideBarContainer?.InnerWindow?.webContents.send('stateUpdate', state)
		})

		ipcMain.on('startAppTracking', () => {
			console.log('RECEIVED')
			this.startAppTracking()
		})

		ipcMain.on('appUpdate', (_, appName) => {
			console.log({ appName })
			this.AppContainer?.InnerWindow?.webContents?.send('appUpdate', appName)
		})

		ipcMain.on('ping', (_, payload) => {
			console.log({ payload })
		})

		this.AppContainer.InnerWindow.on('closed', () => {
			this.AppContainer = null
			this.SideBarContainer = null
			if (this.WorkerContainer) this.WorkerContainer.InnerWindow.close()
			this.WorkerContainer = null

			!(process.platform === 'win32') && clearInterval(this.intervalId)

			app.quit()//closes all windows 

		})

		// TODO add a close_sidebar call: should be callable globally
	}

	startAppTracking() {
		// Background renderer process to execute binary
		if (!this.WorkerContainer) {
			this.WorkerContainer = new SideBarClass({}, false)
		}
		this.WorkerContainer.init('worker')
	}

	openSideBar() {
		this.isSideBarOpen = true
		if (!this.SideBarContainer) {
			// AppCOntainer Updates
			const [x, y] = this.AppContainer.InnerWindow.getPosition()
			this.AppContainer.InnerWindow.setPosition(x + 75, y, true)
			this.AppContainer.InnerWindow.setOpacity(0.5)

			this.SideBarContainer = new SideBarClass({ x, y })
			this.SideBarContainer.init('game')

			this.SideBarContainer.InnerWindow.setPosition(x - 300, y, true)

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
		this.pomoWin = new BrowserWindow({ width: 330, height: 450, skipTaskbar: true })
		p = p - 330
		this.pomoWin.setPosition(p, q + 50)
		this.pomoWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
		this.pomoWin.setAlwaysOnTop(true, 'floating')
		this.pomoWin.setFullScreenable(false)
		this.pomoWin.setMenu(null)
		this.pomoWin.loadURL(`file://${__static}/timer/index.html`)
	}
	openWhatsapp() {
		if(!this.whatsappWin) {
			const { main_width, main_height } = screen.getPrimaryDisplay().workAreaSize
			let [p, q] = this.AppContainer.InnerWindow.getPosition()
			this.whatsappWin = new BrowserWindow({ width: main_width, height: main_height })
			this.whatsappWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
			this.whatsappWin.setAlwaysOnTop(true, 'floating')
			this.whatsappWin.setFullScreenable(false)
			this.whatsappWin.setMenu(null)
			this.whatsappWin.loadURL(`https://web.whatsapp.com/`,{userAgent: 'Chrome'})
			this.whatsappWin.on('minimize',(event)=> {
			    event.preventDefault();
			    this.whatsappWin.hide();
			})

			this.whatsappWin.on('close', (event)=> {
			    event.preventDefault();
			    this.whatsappWin.hide();
			    return false;
			})
		}
		else
		{
			if(this.whatsappWin.isVisible())
				this.whatsappWin.hide()
			else
				this.whatsappWin.show()
		}
	}
}

export const application = new Application()
