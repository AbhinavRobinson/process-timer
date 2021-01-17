import { app, ipcMain, screen } from 'electron'
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
			app.dock.hide()
		})
		this.isSideBarOpen = false
	}

	handleEvents() {
		ipcMain.on('open_sidebar', (_) => {
			this.openSideBar()
			// const { width, height } = screen.getPrimaryDisplay().workAreaSize
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
			this.SideBarContainer = new SideBarClass()
			this.SideBarContainer.init()

			const [x, y] = this.AppContainer.InnerWindow.getPosition()
			this.SideBarContainer.InnerWindow.setPosition(x - 200, y - 300, true)

			this.SideBarContainer.InnerWindow.on('closed', () => {
				this.AppContainer.InnerWindow.setPosition(x, y, true)
				this.AppContainer.InnerWindow.setOpacity(1)
				this.SideBarContainer = null
				this.isSideBarOpen = false
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
