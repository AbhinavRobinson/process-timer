import { BrowserWindow } from 'electron'
import path from 'path'
import { isDevelopment } from '..'

export class SideBarClass {
	public InnerWindow
	constructor() {
		this.InnerWindow = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true,
				webSecurity: false,
			},
			width: 300,
			height: 500,
			alwaysOnTop: true,
			frame: false,
			transparent: !isDevelopment ? true : process.platform === 'linux' ? false : true,
			icon: isDevelopment ? './app/logo.png' : path.join(__dirname, '/icon/Icon-512x512.png'),
		})
    }
    
    init(){
        
    }
}
