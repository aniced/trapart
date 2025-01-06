<script setup lang="ts">
defineProps({
	value: { type: Number, default: 0 },
})
</script>

<template>
	<div :class="{
		'progress-bar': true,
		'indeterminate': !Number.isFinite(value),
	}">
		<div :style="{ flex: Number.isFinite(value) ? value : undefined }"></div>
	</div>
</template>
