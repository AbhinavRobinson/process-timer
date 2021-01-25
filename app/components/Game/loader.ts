import { ipcRenderer } from 'electron'
import Container from 'typedi'
import { drawFunction } from '../../hooks/useCanvas'
import { SocketContainerClass } from '../../SocketContainer'

function loader(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, local: boolean) {
	// Receive state from our App.
	const socket = Container.get(SocketContainerClass)
	var opponent_state: any
	var our_state: any

	ipcRenderer.on('stateUpdate', (_, state) => {
		console.log(state, 'game_container')
		// Send Our State Update to Socket
		our_state = state
		socket.send_state(state)
	})

	// Receive opponent state from Socket.
	socket.on_receive_update((data) => {
		opponent_state = data
	})
	// bg color
	canvas.style.backgroundColor = '#04293F'
	ctx.save()

	let time = 10 * 100
	const FRAMES_PER_SECOND = 50

	const FRAME_MIN_TIME = (1000 / 60) * (60 / FRAMES_PER_SECOND) - (1000 / 60) * 0.5
	let lastFrameTime = 0

	let width = canvas.width
	let height = canvas.height

	// define one unit as 1/500 of canvas, then we multiply all calc with this unit
	let x_unit = width / 500
	let y_unit = height / 500

	let t
	// Initialize the game
	function init() {
		// Add mouse events
		canvas.addEventListener('click', onClick)
		t = 0

		main(0)
	}

	// Main loop
	function main(ft) {
		if (ft - lastFrameTime < FRAME_MIN_TIME) {
			requestAnimationFrame(main)
			return
		}
		lastFrameTime = ft
		clear()

		render(t)
		// render(t);
		// document.getElementById('TIME').innerHTML = 'Score : ' + Cycles + ' | Time : ' + parseInt(t)

		if ((t / time) * 100 > 1) {
			t = 0
			// Cycles += 1
		} else {
			t += 1 / 50
		}

		requestAnimationFrame(main)
	}
	function Balloon(x, y) {
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.arc(x, y, 50 * y_unit, 0, Math.PI * 2, true)
		ctx.fillStyle = '#4AC97F'
		ctx.fill()

		ctx.beginPath()
		ctx.moveTo(x, y + 50 * y_unit)
		ctx.lineTo(x + 10 * x_unit, y + 65 * y_unit)
		ctx.lineTo(x - 10 * x_unit, y + 65 * y_unit)
		ctx.fillStyle = '#4AC97F'
		ctx.fill()

		if (y < 125 * y_unit) {
			ctx.beginPath()
			ctx.moveTo(x - 30 * x_unit, y - 5 * y_unit)
			ctx.lineTo(x - 10 * x_unit, y)
			ctx.moveTo(x + 30 * x_unit, y - 5 * y_unit)
			ctx.lineTo(x + 10 * x_unit, y)
			ctx.moveTo(x - 4.5 * x_unit, y + 33 * y_unit)
			ctx.arc(x, y + 25 * y_unit, 10 * x_unit, 8.5, Math.PI * 2, true)
			ctx.strokeStyle = '#444'
			ctx.lineWidth = 2
			ctx.stroke()
		} else if (y > 125 * y_unit && y < 175 * y_unit) {
			ctx.beginPath()
			ctx.moveTo(x - 30 * x_unit, y - 2.5 * y_unit)
			ctx.lineTo(x - 10 * x_unit, y - 2.5 * y_unit)
			ctx.moveTo(x + 30 * x_unit, y - 2.5 * y_unit)
			ctx.lineTo(x + 10 * x_unit, y - 2.5 * y_unit)
			ctx.moveTo(x - 7.5 * x_unit, y + 25 * y_unit)
			ctx.lineTo(x + 7.5 * x_unit, y + 25 * y_unit)
			ctx.strokeStyle = '#444'
			ctx.lineWidth = 2
			ctx.stroke()
		} else {
			ctx.beginPath()
			ctx.moveTo(x - 30 * x_unit, y)
			ctx.lineTo(x - 10 * x_unit, y - 5 * y_unit)
			ctx.moveTo(x + 30 * x_unit, y)
			ctx.lineTo(x + 10 * x_unit, y - 5 * y_unit)
			ctx.moveTo(x + 2.5 * x_unit, y + 30 * y_unit)
			ctx.arc(x, y + 25 * y_unit, 5 * x_unit, 0, Math.PI * 2, true)
			ctx.strokeStyle = '#444'
			ctx.lineWidth = 2
			ctx.stroke()
		}

		ctx.beginPath()
		ctx.moveTo(x, y + 65 * y_unit)
		ctx.lineTo(x, y + 200 * y_unit)
		ctx.strokeStyle = '#407E92'
		ctx.lineWidth = 2
		ctx.stroke()
	}

	// Render the game
	function render(t) {
		// Draw the frame
		let cmp = (t / time) * 100 * 175

		Balloon(250 * x_unit, (50 + cmp) * y_unit)
		drawSpikes(0, (500 - cmp) * y_unit)

		ctx.beginPath()
		ctx.moveTo(0, 500 * y_unit)
		ctx.lineTo(0, (499 - cmp) * y_unit)
		ctx.lineTo(500 * x_unit, (499 - cmp) * y_unit)
		ctx.lineTo(500 * x_unit, 500 * y_unit)
		ctx.fillStyle = '#111D23'
		ctx.fill()

		ctx.beginPath()
		ctx.moveTo(0, (515 - cmp) * y_unit)
		ctx.lineTo(0, (499 - cmp) * y_unit)
		ctx.lineTo(500 * x_unit, (499 - cmp) * y_unit)
		ctx.lineTo(500 * x_unit, (515 - cmp) * y_unit)
		ctx.fillStyle = '#64768C'
		ctx.fill()
	}

	function drawSpikes(x, y) {
		spikes(x, y)
		spikes(x + 50 * x_unit, y)
		spikes(x + 100 * x_unit, y)
		spikes(x + 150 * x_unit, y)
		spikes(x + 200 * x_unit, y)
		spikes(x + 250 * x_unit, y)
		spikes(x + 300 * x_unit, y)
		spikes(x + 350 * x_unit, y)
		spikes(x + 400 * x_unit, y)
		spikes(x + 450 * x_unit, y)
	}

	function spikes(x, y) {
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + 25 * x_unit, y - 50 * y_unit)
		ctx.lineTo(x + 50 * x_unit, y)
		ctx.fillStyle = '#F5F5F5'
		ctx.fill()
	}

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
	}

	// add mouse events
	function onClick(e) {}

	// init
	init()
}
// This function receives 2-D context of the canvas and the frameCount
// All the drawing stuff can be performed here
export const draw: drawFunction = (canvas, ctx, frameCount, local) => {
	loader(canvas, ctx, local)
	// ctx.fill()
}
