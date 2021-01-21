import * as React from 'react'
import { drawFunction } from '../hooks/useCanvas'

import GameContainer from './GameContainer'

// This function receives 2-D context of the canvas and the frameCount
// All the drawing stuff can be performed here
const draw: drawFunction = (ctx, frameCount) => {
	// HERE
}

interface GameProps {}

const Game: React.FC<GameProps> = () => {
	return <GameContainer {...{ draw }} />
}

export default Game
