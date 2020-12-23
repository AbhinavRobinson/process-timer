import { app, ipcMain } from 'electron'
import { MainWindowClass } from './windows/MainWindowClass'
import { SideBarClass } from './windows/SideBarClass'

export const isDevelopment = process.env.NODE_ENV !== 'production'

class Application {
	public AppContainer: MainWindowClass
	public SideBarConainer: SideBarClass

	constructor() {
		this.init()
	}

	async init() {
		app.on('ready', async () => {
			this.AppContainer = new MainWindowClass()
			await this.AppContainer.init()
			this.handleEvents()
		})
	}

	handleEvents() {
		ipcMain.on('open_sidebar', (e) => {
			this.openSideBar()
		})
	}

	openSideBar() {
		if (!this.SideBarConainer) {
			this.SideBarConainer = new SideBarClass()
			this.SideBarConainer.init()
		}
	}
}

export const application = new Application()
