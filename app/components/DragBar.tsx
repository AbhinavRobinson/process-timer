import React from 'react'

/**
 * Font Awesome Imports
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const DragBar = (): JSX.Element => (
	<div className="topbar grid grid-5" style={{
		minWidth: '100%',
		minHeight: '30px',
		margin: 0,
		backgroundColor: 'black',
		alignItems: 'center'
	}}>
		<div className='draggable xxs text-center' style={{height: '100%', width:'80%', gridColumn:'1/5'}}></div>
		<div className="close-button text-center" style={{backgroundColor:'orange',color: 'white', placeSelf: "center stretch", height:'100%'}}><FontAwesomeIcon icon={faTimes} /></div>
	</div>
)

export default DragBar
