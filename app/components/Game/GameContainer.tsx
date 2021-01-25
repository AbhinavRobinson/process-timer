import * as React from 'react'

import useCanvas, { drawFunction } from '../../hooks/useCanvas'

interface GameProps {
	draw: drawFunction
	local: boolean
}

const GameContainer: React.FC<GameProps> = ({ draw, local }) => {
	const canvasRef = useCanvas(draw, local)
	return <canvas ref={canvasRef} height='120' width='100'></canvas>
}

export default GameContainer
