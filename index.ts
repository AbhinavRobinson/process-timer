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

		// TODO add a close_sidebar call: should be callable globally

	}

	openSideBar() {
		if (!this.SideBarConainer) {
			this.SideBarConainer = new SideBarClass()
			this.SideBarConainer.init()

			this.AppContainer.InnerWindow.on('closed', () => {
				if (this.SideBarConainer) {
					try {
						this.SideBarConainer.close()
					} catch (err) {
						console.info('Already closed')
					}
				}
			})
		}
	}
}

export const application = new Application()
