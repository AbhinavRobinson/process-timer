import { remote } from 'electron';

export function closeHandler(textmessage: string, callback?: VoidFunction) {
	remote.dialog
		.showMessageBox(null, {
			buttons: ['Sure.', 'No.'],
			message: textmessage
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