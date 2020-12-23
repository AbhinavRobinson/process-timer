// const { execFile } = require('child_process')

const { spawn } = require('child_process')
// const { join } = require('path')

// const filepath = join('C:\\Users\\Aniket\\nims\\static\\getwindow.py')

// console.log(filepath)

interface JSONdata {
	title: string
	app: string
	pid: number
}

export default function getFile(filepath, callback: (json_data: JSONdata) => void) {
	// const pyprocess = spawn('python', [filepath])
	const pyprocess = spawn(filepath, [])

	pyprocess.stdout.on('data', function (data) {
		callback(JSON.parse(data.toString()))
	})
}

// getFile('C:\\Users\\Aniket\\nims\\static\\getwindow.py', (data) => {
// 	console.log(data)
// 	console.log(JSON.parse(data))
// })
