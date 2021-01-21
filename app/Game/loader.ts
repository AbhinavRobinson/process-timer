import { drawFunction } from '../hooks/useCanvas'

function loader(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
	// let Cycles = 0

	// bg color
	canvas.style.backgroundColor = '#04293F'
	ctx.save()

	let time = 10 * 100
	const FRAMES_PER_SECOND = 50

	const FRAME_MIN_TIME = (1000 / 60) * (60 / FRAMES_PER_SECOND) - (1000 / 60) * 0.5
	let lastFrameTime = 0

	let width = canvas.width
	let height = canvas.height

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

	// Render the game
	function render(t) {
		// Draw the frame
		let cmp = (t / time) * 100 * 175

		Balloon(250, 50 + cmp)
		drawSpikes(0, 500 - cmp)

		ctx.beginPath()
		ctx.moveTo(0, 500)
		ctx.lineTo(0, 499 - cmp)
		ctx.lineTo(500, 499 - cmp)
		ctx.lineTo(500, 500)
		ctx.fillStyle = '#111D23'
		ctx.fill()

		ctx.beginPath()
		ctx.moveTo(0, 515 - cmp)
		ctx.lineTo(0, 499 - cmp)
		ctx.lineTo(500, 499 - cmp)
		ctx.lineTo(500, 515 - cmp)
		ctx.fillStyle = '#64768C'
		ctx.fill()
	}

	function drawSpikes(x, y) {
		spikes(x, y)
		spikes(x + 50, y)
		spikes(x + 100, y)
		spikes(x + 150, y)
		spikes(x + 200, y)
		spikes(x + 250, y)
		spikes(x + 300, y)
		spikes(x + 350, y)
		spikes(x + 400, y)
		spikes(x + 450, y)
	}

	function spikes(x, y) {
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + 25, y - 50)
		ctx.lineTo(x + 50, y)
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
export const draw: drawFunction = (canvas, ctx, frameCount) => {
	loader(canvas, ctx)
	// ctx.fill()
}
