import { AppUpdater, autoUpdater } from 'electron-updater'
import { Service } from 'typedi'

// For file based logging in prodcution
import log from 'electron-log'
@Service()
export class AppUpdaterContainer {
	autoUpdater: AppUpdater
	constructor() {
		const log = require('electron-log')
		log.transports.file.level = 'debug'
		this.autoUpdater = autoUpdater
		autoUpdater.logger = log
		this.init()
	}

	// Logs left for debugging purposes.
	async init() {
		this.autoUpdater.checkForUpdatesAndNotify()
		autoUpdater.autoInstallOnAppQuit = true

		autoUpdater.on('checking-for-update', () => {
			log.info('checking for updates')
			console.log('checking for updates')
		})

		autoUpdater.on('update-available', (info) => {
			log.info('update-available', info)
			console.log('update-available', info)
			// TODO: Show alert. Downloading updates.
			autoUpdater.downloadUpdate()
		})

		autoUpdater.on('update-not-available', (info: any) => {
			log.info('updates not available', info)
			console.log('updates not available', info)
		})

		autoUpdater.on('download-progress', (progressObj: any) => {
			log.info('downloading updates')
			let log_message = 'Download speed: ' + progressObj.bytesPerSecond
			log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
			log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
			log.info(log_message)
			// TODO: Send updates to frontend for display.
		})

		autoUpdater.on('error', (err) => {
			console.error(err)
			log.error(err)
		})
	}
}
