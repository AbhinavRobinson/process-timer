import { spawn } from 'child_process'

/*
* Sample data returned by active-win binary 'main'
	{
		title: 'Unicorns - Google Search',
		id: 5762,
		bounds: {
			x: 0,
			y: 0,
			height: 900,
			width: 1440
		},
		owner: {
			name: 'Google Chrome',
			processId: 310,
			bundleId: 'com.google.Chrome',
			path: '/Applications/Google Chrome.app'
		},
		url: 'https://sindresorhus.com/unicorn',
		memoryUsage: 11015432
	}
	*/

interface JSONdata {
	title: string
	app: string
	pid: number
	id: number
	owner?: {
		name: string
		processId: number
		bundleId: string
		path: string
	}
	url?: string
}

export default function getFile(filepath: string, callback: (json_data: JSONdata) => void) {
	const pyprocess = spawn(filepath, [])

	pyprocess.stdout.on('data', function (data) {
		callback(JSON.parse(data.toString()))
	})
}
