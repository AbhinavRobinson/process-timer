import * as React from 'react'
import useCanvas, { drawFunction } from '../hooks/useCanvas'

interface GameProps {
	draw: drawFunction
}

const GameContainer: React.FC<GameProps> = ({ draw }) => {
	const canvasRef = useCanvas(draw)
	return <canvas ref={canvasRef}></canvas>
}

export default GameContainer
