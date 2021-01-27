import { remote } from 'electron'

export function set_up_window() {
	remote.getCurrentWindow().setAlwaysOnTop(true)
	// remote.getCurrentWindow().setBounds({
	// 	x: remote.screen.getPrimaryDisplay().bounds.width - 120,
	// 	// y: ,
	// })
	remote.getCurrentWindow().setSize(90, 600)
	remote
		.getCurrentWindow()
		.setPosition(
			remote.screen.getPrimaryDisplay().bounds.width - 120,
			remote.screen.getPrimaryDisplay().bounds.height / 2 - document.getElementById('outer').clientHeight
		)
}
