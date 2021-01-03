import { remote } from 'electron'

export default function MessageHandler(textMessage: string, callback?: VoidFunction) {
	// TODO: open new window and ask for message?

	remote.dialog.showMessageBox(null, {
		message: 'Message Handler is not implemented yet.',
		buttons: ['Okay.'],
	})
}
