import * as React from 'react'

import GameContainer from './GameContainer'

import { draw } from './loader'

interface GameProps {
	local: boolean
}

const Game: React.FC<GameProps> = ({ local }) => {
	//Extract state from gamestate as required to pass to draw
	return <GameContainer {...{ draw, local }} />
}

export default Game
