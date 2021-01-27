import { App, IHealth } from './App'

export function ext_run_backend(obj: App) {
	const { total_time } = obj.state

	let health_array: IHealth[] = obj.state.time_spent
	health_array.push({
		health: 100,
		percentage: 0,
		display_percentage: 0,
	})

	obj.setState({ time_spent: health_array })

	const interval = setInterval(() => {
		let { running_time, active_app, monitor_app, active_time } = obj.state
		running_time += 1
		if (active_app === monitor_app) {
			active_time += 1
		}

		health_array[health_array.length - 1].health = Math.ceil((1 - (running_time - active_time) / total_time) * 100)
		health_array[health_array.length - 1].percentage = Math.floor((running_time / total_time) * 100)
		health_array[health_array.length - 1].display_percentage = Math.floor((active_time / running_time) * 100)

		obj.setState({ running_time: running_time, time_spent: health_array, active_time }, () => {
			// console.log(running_time, health_array[health_array.length - 1].health, health_array[health_array.length - 1].percentage, active_time)
		})
	}, 1000)

	obj.global_interval_timeout = interval

	obj.backend_timeout = setTimeout(() => {
		clearInterval(interval)
		if (health_array.length === 4) {
			health_array.splice(0, 1)
		}
		if (obj.state.backend_running) {
			obj.setState({ running_time: 0, time_spent: health_array, active_time: 0 })
			obj.run_backend()
		} else obj.setState({ running_time: 0, time_spent: [], active_time: 0, backend_running: false })
	}, total_time * 1000)
}
