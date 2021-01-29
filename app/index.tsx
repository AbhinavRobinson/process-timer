import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, RouteProps } from 'react-router-dom'

import Redirect from './screens/Redirect'
import { SideBar } from './screens/SideBar/SideBar'

import { ipcRenderer } from 'electron'

import './css/index.css'
import './css/utilities.css'
import Container from 'typedi'

import { Provider } from 'react-redux'

import Store from 'electron-store'
const electron_store = new Store()

import { useDispatch } from 'react-redux'
import store, { AppDispatch } from './redux/store'

import { MetaApplicationActions } from './redux/states/MetaApplicationSlice'

interface IMainState {
	sidebar: boolean
	loggedin: boolean
}

const TestStore: React.FC = () => {
	const dispatch: AppDispatch = useDispatch()

	dispatch(MetaApplicationActions.setLogin(true))
	React.useEffect(() => {
		setImmediate(() => {
			console.log('loggedIn:', store.getState().MetaApplicationReducer.loggedIn)
		})
		return () => {}
	}, [])
	return <></>
}

const getViews = () => ({
	default: <Redirect />,
	game: <SideBar />,
})

const HandleRoute: React.FC<RouteProps> = ({ location }) => {
	const name = location.search.substr(1)
	const view = getViews()[name]
	if (!view)
		throw new Error(
			`Given view: ${name} is not defined in the map.\nPlease go into app/index.tsx and edit getViews returned object with your path and component added.`
		)
	return view
}

class Main extends React.Component<{}, IMainState> {
	state = {
		sidebar: false,
		loggedin: false,
	}
	constructor(props: any) {
		super(props)
		Container.set('url', 'socket.nudge.aniketbiprojit.me')
	}

	componentDidMount() {
		ipcRenderer.on('redirect', () => {
			this.setState({ sidebar: true })
		})
		if (electron_store.has('fire_login') && electron_store.get('fire_login') === false) {
			electron_store.clear()
			return
		}
		if (electron_store.get('auth')) {
			this.setState({
				loggedin: true,
			})
		}
	}

	render() {
		return (
			<Provider store={store}>
				<TestStore />
				<Router>
					<Route path='/' component={HandleRoute} />
				</Router>
			</Provider>
		)
	}
}

ReactDOM.render(<Main />, document.getElementById('app'))
