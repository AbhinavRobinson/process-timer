import { useRef, useEffect } from 'react'

export type drawFunction = (ctx: CanvasRenderingContext2D, frameCount: number) => void

const useCanvas = (draw: drawFunction) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')
		let frameCount = 0
		let animationFrameId: number

		const render = () => {
			frameCount++
			draw(context, frameCount)
			animationFrameId = window.requestAnimationFrame(render)
		}
		render()

		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	}, [draw])

	return canvasRef
}

export default useCanvas
