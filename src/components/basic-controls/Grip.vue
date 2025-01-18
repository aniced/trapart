<!--
	A generic drag handle for moving or resizing.
-->

<script setup lang="ts">
const props = defineProps({
	/** Pass in absolute initial values to enjoy value clamping, or keep the default to receive relative measurements in `update` event. */
	x: { type: Number, default: 0 },
	minX: { type: Number, default: -Infinity },
	maxX: { type: Number, default: Infinity },
	y: { type: Number, default: 0 },
	minY: { type: Number, default: -Infinity },
	maxY: { type: Number, default: Infinity },
})

const emit = defineEmits<{
	(e: 'update' | 'input', x: number, y: number): void,
}>()

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
		emit('input', x, y)
		if (!(event.buttons & 1)) {
			emit('update', x, y)
			document.removeEventListener('pointermove', handler)
			document.removeEventListener('pointerup', handler)
		}
	}
	document.addEventListener('pointermove', handler, { passive: true })
	document.addEventListener('pointerup', handler, { passive: true })
}
</script>

<template>
	<div class="grip" @pointerdown.passive="pointerdown" />
</template>
