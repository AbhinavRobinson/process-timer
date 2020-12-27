import { remote } from 'electron';

export function CloseHandler(textmessage: string, callback?: VoidFunction) {
	remote.dialog
		.showMessageBox(null, {
			buttons: ['Sure.', 'No.'],
			message: textmessage,
			cancelId: 1
		})
		.then((data) => {
			if (data.response === 0) {
				window.close();
			}
			if (data.response) {
				callback();
			}
		});
}