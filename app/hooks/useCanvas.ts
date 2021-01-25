import { useRef, useEffect } from 'react'

export type drawFunction = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, frameCount: number, local: boolean) => void

const useCanvas = (draw: drawFunction, local: boolean) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		let frameCount = 0
		let animationFrameId: number

		// const render = () => {
		// 	frameCount++

		draw(canvas, context, frameCount, local)
		// 	animationFrameId = window.requestAnimationFrame(render)
		// }
		// render()

		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	}, [draw])

	return canvasRef
}

export default useCanvas
