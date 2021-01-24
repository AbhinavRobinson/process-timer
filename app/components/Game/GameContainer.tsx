import * as React from 'react'
import useCanvas, { drawFunction } from '../../hooks/useCanvas'

interface GameProps {
	draw: drawFunction
}

const GameContainer: React.FC<GameProps> = ({ draw }) => {
	const canvasRef = useCanvas(draw)
	return <canvas ref={canvasRef} height='100' width='100'></canvas>
}

export default GameContainer
