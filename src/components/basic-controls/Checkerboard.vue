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
	background-color: var(--light-color);
	background-image:
		linear-gradient(45deg, var(--dark-color) 25%, transparent 25%),
		linear-gradient(-45deg, var(--dark-color) 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, var(--dark-color) 75%),
		linear-gradient(-45deg, transparent 75%, var(--dark-color) 75%);
	background-size: 32px 32px;
	background-position: 0 0, 0 16px, 16px -16px, -16px 0px;
}
</style>
