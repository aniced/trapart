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
	const pointermove = (event: PointerEvent) => {
		emit(
			event.type === 'pointermove' ? 'input' : 'update',
			Math.min(Math.max(event.clientX - initialX, props.minX), props.maxX),
			Math.min(Math.max(event.clientY - initialY, props.minY), props.maxY),
		)
	}
	const pointerup = (event: PointerEvent) => {
		if (event.button !== 0) return
		pointermove(event)
		document.removeEventListener('pointermove', pointermove)
		document.removeEventListener('pointerup', pointerup)
	}
	document.addEventListener('pointermove', pointermove, { passive: true })
	document.addEventListener('pointerup', pointerup, { passive: true })
}
</script>

<template>
	<div class="grip" @pointerdown.passive="pointerdown" />
</template>
