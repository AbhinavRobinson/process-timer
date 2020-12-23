import { app, ipcMain } from 'electron'
import { MainWindowClass } from './windows/MainWindowClass'

export const isDevelopment = process.env.NODE_ENV !== 'production'

class Application {
	public AppContainer: MainWindowClass
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
		console.log('emit received')
	}
}

export const application = new Application()
