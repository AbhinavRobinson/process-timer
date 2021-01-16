import { remote } from 'electron'

/** Asks user to confirm action.
 * @author Abhianv Robinson
 *
 * @param textMessage give message to be shown
 * @param callback give optional callback
 *
 * @returns [0,1] -> {yes, no} responce id
 */
export default async function MessageHandler(textMessage: string, callback?: VoidFunction) {
	remote.dialog
		.showMessageBox(null, {
			message: textMessage,
			buttons: ['Yes.', 'No!'],
		})
		.then(
			(data) => {
				try {
					callback()
				} catch (e) {
					var error = e
				} finally {
					return data.response
				}
			},
			(data) => {
				try {
					callback()
				} catch (e) {
					var error = e
				} finally {
					return data.response
				}
			}
		)
}
