const { execFile } = require('child_process')

const { spawn } = require('child_process')
const { join } = require('path')

const filepath = join('C:\\Users\\Aniket\\nims\\static\\getwindow.py')

console.log(filepath)

export default function getFile(callback: (string) => void) {
	const pyprocess = spawn('python', ['./static/getwindow.py'])

	pyprocess.stdout.on('data', function (data) {
		// console.log(data.toString())
		callback(data.toString())
	})
}
