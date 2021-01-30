import * as React from 'react'
import appTracker from './appTracker'

const workers = {
	appTracker,
}

const runWorkers = async () => {
	Object.values(workers).map((worker) => worker())
}

const Worker: React.FC = () => {
	React.useEffect(() => {
		runWorkers()
	}, [])
	return <></>
}

export default Worker
