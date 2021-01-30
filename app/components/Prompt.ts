import { remote } from 'electron'
export function Prompt(type: string, textmessage: string) {
	remote.dialog
		.showMessageBox(null, {
			type: type,
			buttons: ['Cool.'],
			message: textmessage,
			cancelId: 1,
		})
}
