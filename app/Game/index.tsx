import * as React from 'react'
import { IAppState } from '../App'

import GameContainer from './GameContainer'

import { draw } from './loader'

interface GameProps {
	gameState: IAppState
}

const Game: React.FC<GameProps> = ({ gameState }) => {
	//Extract state from gamestate as required to pass to draw
	return <GameContainer {...{ draw }} />
}

export default Game
