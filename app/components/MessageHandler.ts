import { remote } from 'electron'

export default async function MessageHandler(textMessage: string, callback?: VoidFunction) {
	remote.dialog
		.showMessageBox(null, {
			message: textMessage,
			buttons: ['Yes.', 'No!'],
		})
		.then(
			(data) => {
				return data.response
			},
			(data) => {
				return data.response
			}
		)
}
