import { app, ipcMain } from 'electron'
import { MainWindowClass } from './windows/MainWindowClass'
import { SideBarClass } from './windows/SideBarClass'

export const isDevelopment = process.env.NODE_ENV !== 'production'

class Application {
	public AppContainer: MainWindowClass
	public SideBarContainer: SideBarClass

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
	}

	handleEvents() {
		ipcMain.on('open_sidebar', (e) => {
			this.openSideBar()
		})

		// TODO add a close_sidebar call: should be callable globally
	}

	openSideBar() {
		if (!this.SideBarContainer) {
			this.SideBarContainer = new SideBarClass()
			this.SideBarContainer.init()

			this.AppContainer.InnerWindow.on('closed', () => {
				if (this.SideBarContainer) {
					try {
						this.SideBarContainer.close()
					} catch (err) {
						console.info('Already closed')
					}
				}
			})
		}
	}
}

export const application = new Application()
