import { remote } from 'electron'
import Container from 'typedi'
export const isDevelopment = process.env.NODE_ENV !== 'production'
import { AppUpdaterContainer } from '../../AutoUpdater'

/** Confirms to close the App.
 *
 * @param textMessage give message to be shown
 * @param callback give optional callback
 *
 * @returns null
 */
export function CloseHandler(type: string, textmessage: string, callback?: VoidFunction) {
	remote.dialog
		.showMessageBox(null, {
			type: type,
			buttons: ['Sure.', 'No.'],
			message: textmessage,
			cancelId: 1,
		})
		.then((data) => {
			if (data.response === 0) {
				if (isDevelopment) window.close()
				else {
					// TODO: Testing exit.
					if (process.platform === 'darwin') {
						try {
							Container.get(AppUpdaterContainer).install()
						} catch (error) {
							console.log(error)
						}
						setTimeout(() => {
							if (window) {
								window.close()
							}
						}, 2000)
					} else {
						window.close()
					}
				}
			}
			if (data.response) {
				callback()
			}
		})
}
