import * as React from 'react'
import { drawFunction } from '../hooks/useCanvas'

import GameContainer from './GameContainer'

// This function receives 2-D context of the canvas and the frameCount
// All the drawing stuff can be performed here
const draw: drawFunction = (ctx, frameCount) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.fillStyle = '#000000'
	ctx.beginPath()
	ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
	ctx.fill()
}

interface GameProps {}

const Game: React.FC<GameProps> = () => {
	return <GameContainer {...{ draw }} />
}

export default Game
