const monitor = require('.')

try {
	monitor.getActiveWindow((data) => {
		console.log(data['title'])
	})
} catch (err) {
	console.error(err)
}
