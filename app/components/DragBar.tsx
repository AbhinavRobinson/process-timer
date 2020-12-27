import React from 'react'
import { CloseHandler } from './CloseHandler'

/**
 * Font Awesome Imports
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const DragBar = (): JSX.Element => (
	<div
		className='topbar grid draggable'
		style={{
			minWidth: '100%',
			margin: 0,
			backgroundColor: 'black',
			gridTemplateColumns: '9fr 1fr',
			gap: 0
		}}
	>
		<div
			className='text-center'
			style={{
				height: '100%',
				color: 'white',
				padding: '0 10px',
				placeSelf: 'start center'
			}}
		>Connect with Buddy</div>
		<div
			className='close-button rg text-center'
			style={{
				backgroundColor: 'orange',
				color: 'white',
				placeSelf: 'center stretch',
				height: '100%',
			}}
			onClick={() => {
				CloseHandler("question",'Do you want to close this window?')
			}}
		>
			<FontAwesomeIcon icon={faTimes} />
		</div>
	</div>
)

export default DragBar
