import { AppUpdater, autoUpdater } from 'electron-updater'
import { Service } from 'typedi'

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
	async init() {
		return await this.autoUpdater.checkForUpdates()
	}
}
