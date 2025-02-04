import { mergeProps } from 'solid-js'

/**
 * A generic drag handle for moving or resizing.
 */
export function Grip(propsIn: {
	/** Pass in absolute initial values to enjoy value clamping, or keep the default to receive relative measurements in `update` event. */
	x?: number,
	minX?: number,
	maxX?: number,
	y?: number,
	minY?: number,
	maxY?: number,
	onUpdate?: (x: number, y: number, commit: boolean) => void,
}) {
	const props = mergeProps({
		x: 0,
		minX: -Infinity,
		maxX: Infinity,
		y: 0,
		minY: -Infinity,
		maxY: Infinity,
	}, propsIn)
	const pointerdown = (event: PointerEvent) => {
		if (event.button !== 0) return
		const initialX = event.clientX - props.x
		const initialY = event.clientY - props.y
		// `pointerup` is fired when the last depressed button is released, unlike `mouseup` which is fired for each release.
		// For a specific button, `pointermove` should be listened.
		// https://w3c.github.io/pointerevents/#chorded-button-interactions
		const handler = (event: PointerEvent) => {
			const x = Math.min(Math.max(event.clientX - initialX, props.minX), props.maxX)
			const y = Math.min(Math.max(event.clientY - initialY, props.minY), props.maxY)
			props.onUpdate?.(x, y, false)
			if (!(event.buttons & 1)) {
				props.onUpdate?.(x, y, true)
				document.removeEventListener('pointermove', handler)
				document.removeEventListener('pointerup', handler)
			}
		}
		document.addEventListener('pointermove', handler, { passive: true })
		document.addEventListener('pointerup', handler, { passive: true })
	}

	return <div class="grip" onPointerDown={pointerdown} />
}
