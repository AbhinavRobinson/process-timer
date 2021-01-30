import * as React from 'react'
import { IHealth } from './App'
import { getStyle } from './utilities'

interface AppListProps {
	backend_running: boolean
	time_spent: IHealth[]
	isOnMonitor: boolean
}

const AppList: React.FC<AppListProps> = ({ backend_running, time_spent, isOnMonitor }) => {
	return (
		<ul className='app-list'>
			{backend_running &&
				time_spent.map((elem: IHealth, ind) => {
					return (
						<li
							className='itemStyle'
							style={isOnMonitor ? { animation: 'glow-green 2s ease-in-out 4' } : { animation: 'glow-red 2s ease-in-out 4' }}
							key={ind}
						>
							<span style={{ zIndex: 4 }} className='app-item'>
								<div className='text-center'>{`${elem.display_percentage}`}</div>
							</span>
							<div className='fill' style={getStyle(elem)}></div>
						</li>
					)
				})}
		</ul>
	)
}

export default AppList
