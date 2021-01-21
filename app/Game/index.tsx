import * as React from 'react'
import { drawFunction } from '../hooks/useCanvas'

import GameContainer from './GameContainer'

function Balloon(ctx: CanvasRenderingContext2D, x: number, y: number) {
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.arc(x, y, 50, 0, Math.PI * 2, true)
	ctx.fillStyle = '#4AC97F'
	ctx.fill()

	ctx.beginPath()
	ctx.moveTo(x, y + 50)
	ctx.lineTo(x + 10, y + 65)
	ctx.lineTo(x - 10, y + 65)
	ctx.fillStyle = '#4AC97F'
	ctx.fill()

	if (y < 125) {
		ctx.beginPath()
		ctx.moveTo(x - 30, y - 5)
		ctx.lineTo(x - 10, y)
		ctx.moveTo(x + 30, y - 5)
		ctx.lineTo(x + 10, y)
		ctx.moveTo(x - 4.5, y + 33)
		ctx.arc(x, y + 25, 10, 8.5, Math.PI * 2, true)
		ctx.strokeStyle = '#444'
		ctx.lineWidth = 3
		ctx.stroke()
	} else if (y > 125 && y < 175) {
		ctx.beginPath()
		ctx.moveTo(x - 30, y - 2.5)
		ctx.lineTo(x - 10, y - 2.5)
		ctx.moveTo(x + 30, y - 2.5)
		ctx.lineTo(x + 10, y - 2.5)
		ctx.moveTo(x - 7.5, y + 25)
		ctx.lineTo(x + 7.5, y + 25)
		ctx.strokeStyle = '#444'
		ctx.lineWidth = 3
		ctx.stroke()
	} else {
		ctx.beginPath()
		ctx.moveTo(x - 30, y)
		ctx.lineTo(x - 10, y - 5)
		ctx.moveTo(x + 30, y)
		ctx.lineTo(x + 10, y - 5)
		ctx.moveTo(x + 2.5, y + 30)
		ctx.arc(x, y + 25, 5, 0, Math.PI * 2, true)
		ctx.strokeStyle = '#444'
		ctx.lineWidth = 3
		ctx.stroke()
	}

	ctx.beginPath()
	ctx.moveTo(x, y + 65)
	ctx.lineTo(x, y + 200)
	ctx.strokeStyle = '#407E92'
	ctx.lineWidth = 2
	ctx.stroke()
}

// This function receives 2-D context of the canvas and the frameCount
// All the drawing stuff can be performed here
const draw: drawFunction = (canvas, ctx, frameCount) => {
	Balloon(ctx, canvas.width, canvas.height)
	// ctx.fill()
}

interface GameProps {}

const Game: React.FC<GameProps> = () => {
	return <GameContainer {...{ draw }} />
}

export default Game
