<script setup lang="ts">
import { ref, computed } from 'vue'

const red = ref(255), green = ref(255), blue = ref(255)

const lightColor = computed(() => `rgb(${red.value}, ${green.value}, ${blue.value})`)
const darkColor = computed(() => {
	return `rgb(${
		(red.value - 0.138 * 255 - Math.min(Math.max(0, 0.888 * 255 - red.value), 0.112 * 255))
	}, ${
		(green.value - 0.138 * 255 - Math.min(Math.max(0, 0.888 * 255 - green.value), 0.112 * 255))
	}, ${
		(blue.value - 0.138 * 255 - Math.min(Math.max(0, 0.888 * 255 - blue.value), 0.112 * 255))
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
