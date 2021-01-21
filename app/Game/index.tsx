import * as React from 'react'

import GameContainer from './GameContainer'

import { draw } from './loader'

interface GameProps {}

const Game: React.FC<GameProps> = () => {
	return <GameContainer {...{ draw }} />
}

export default Game
