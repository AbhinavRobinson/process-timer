import * as React from 'react'
import appTracker from './appTracker'

const workers = {
	appTracker,
}

const runWorkers = (): Promise<() => any | undefined>[] => {
	const cleanUps = Object.values(workers).map((worker) => worker())
	return cleanUps
}

const Worker: React.FC = () => {
	React.useEffect(() => {
		const cleanUps = runWorkers()
		return () => {
			cleanUps.forEach((cleanPromise) => cleanPromise.then((cleanFun) => cleanFun()))
		}
	}, [])
	return <></>
}

export default Worker
