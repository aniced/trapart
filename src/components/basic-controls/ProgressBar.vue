<script setup lang="ts">
defineProps({
	value: { type: Number, default: 0 },
	max: { type: Number, default: 1 },
})
</script>

<template>
	<div class="progress-bar">
		<div :style="{ flex: value / max }"></div>
	</div>
</template>
