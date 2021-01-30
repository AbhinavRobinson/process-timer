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
					// TODO: Handle exit.
					Container.get(AppUpdaterContainer).install()
				}
			}
			if (data.response) {
				callback()
			}
		})
}
