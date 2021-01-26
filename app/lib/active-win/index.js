const activeWin = () => {
	if (process.platform === 'darwin') {
		return require('./lib/macos')()
	}

	if (process.platform === 'linux') {
		return require('./lib/linux')()
	}

	return Promise.reject(new Error('macOS and Linux only'))
}

export default activeWin
