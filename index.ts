import { API } from 'aws-amplify'
import { app, ipcMain } from 'electron'
import { MainWindowClass } from './windows/MainWindowClass'
import { SideBarClass } from './windows/SideBarClass'
import Amplify from 'aws-amplify'
import config from './app/aws-exports.js'

Amplify.configure(config)

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
			app.dock.hide()
		})
		this.isSideBarOpen = false
		if (process.env.NODE_ENV === 'production') {
			const sourceMapSupport = require('source-map-support')
			sourceMapSupport.install()
		}
	}

	handleEvents() {
		ipcMain.on('open_sidebar', (_) => {
			this.openSideBar()
			const [x, y] = this.AppContainer.InnerWindow.getPosition()
			this.AppContainer.InnerWindow.setPosition(x + 100, y, true)
			this.AppContainer.InnerWindow.setOpacity(0.5)
		})
		ipcMain.on('sidebar_open_check', (e) => {
			e.returnValue = this.isSideBarOpen
		})

		this.AppContainer.InnerWindow.on('closed', () => {
			this.AppContainer = null
		})

		// TODO add a close_sidebar call: should be callable globally
	}

	openSideBar() {
		this.isSideBarOpen = true
		if (!this.SideBarContainer) {
			const [x, y] = this.AppContainer.InnerWindow.getPosition()

			this.SideBarContainer = new SideBarClass({ x, y })
			this.SideBarContainer.init()
			this.SideBarContainer.InnerWindow.setParentWindow(this.AppContainer.InnerWindow)

			this.SideBarContainer.InnerWindow.setPosition(x - 130, y - 250, true)

			this.SideBarContainer.InnerWindow.on('closed', () => {
				this.AppContainer.InnerWindow.setPosition(x, y, true)
				this.AppContainer.InnerWindow.setOpacity(1)
				this.SideBarContainer = null
				this.isSideBarOpen = false
				leaveAgora()
			})
		}
	}
}

const leaveAgora = async () => {
	await API.post('mainApi', '/agora/leave', {}).catch(console.error)
}

export const application = new Application()
