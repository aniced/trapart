<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
	red: { type: Number, default: 255 },
	green: { type: Number, default: 255 },
	blue: { type: Number, default: 255 },
})

const lightColor = computed(() => `rgb(${props.red}, ${props.green}, ${props.blue})`)
const darkColor = computed(() => {
	return `rgb(${(props.red - 0.138 * 255 - Math.min(Math.max(0, 0.888 * 255 - props.red), 0.112 * 255))
		}, ${(props.green - 0.138 * 255 - Math.min(Math.max(0, 0.888 * 255 - props.green), 0.112 * 255))
		}, ${(props.blue - 0.138 * 255 - Math.min(Math.max(0, 0.888 * 255 - props.blue), 0.112 * 255))
		})`
})
</script>

<template>
	<div class="checkerboard" :style="{ '--light-color': lightColor, '--dark-color': darkColor }">
		<slot></slot>
	</div>
</template>

<style scoped>
.checkerboard {
	display: flex;
	justify-content: center;
	align-items: center;
	background:
		linear-gradient(135deg, var(--dark-color) 25%, transparent 0 75%, var(--dark-color) 0) 0 0 / 32px 32px,
		linear-gradient(135deg, var(--dark-color) 25%, transparent 0 75%, var(--dark-color) 0) 16px 16px / 32px 32px,
		var(--light-color);
}
</style>
