import { remote } from 'electron'

/** Asks user to confirm action.
 * @author Abhianv Robinson
 *
 * @param textMessage give message to be shown
 * @param callback give optional callback
 *
 * @returns [0,1] -> {yes, no} responce id
 */
export default async function MessageHandler(textMessage: string, callback?: VoidFunction, singleSelect?: boolean) {
	return remote.dialog
		.showMessageBox(null, {
			message: textMessage,
			buttons: singleSelect ? ['OK'] : ['Yes.', 'No!'],
		})
		.then(({ response }) => {
			try {
				callback()
			} catch (e) {
				var error = e
				console.error(error)
			} finally {
				return response
			}
		})
		.catch(console.error)
}
