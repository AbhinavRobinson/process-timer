const { execFile } = require('child_process')

const { spawn } = require('child_process')
const { join } = require('path')

// const filepath = join('C:\\Users\\Aniket\\nims\\static\\getwindow.py')

// console.log(filepath)

export default function getFile(filepath, callback: (string) => void) {
	// const pyprocess = spawn('python', [filepath])
	const pyprocess = spawn(filepath, [])

	pyprocess.stdout.on('data', function (data) {
		callback(data.toString())
	})
}

// getFile('C:\\Users\\Aniket\\nims\\static\\dist\\getwindow.exe', (data) => {
// 	console.log(data)
// })
