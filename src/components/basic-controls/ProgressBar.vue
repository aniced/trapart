<script setup lang="ts">
defineProps({
	value: { type: Number },
	max: { type: Number },
})
</script>

<template>
	<div class="container">
		<div class="background">
		<div class="value" :style="{ width: (value ?? 0) / (max ?? 1) * 100 + '%' }"></div>
		</div>
	</div>
</template>

<style scoped>
.container {
	width: 200px;
	height: 24px;
	padding: 1px;
}

.background {
	height: 100%;
	background-color: var(--normal-back1);
	box-shadow: inset 0 0 0 1px var(--control-frame);
	overflow: hidden;
}

.value{
	border-radius: 2px;
	height: 100%;
	background-image: linear-gradient(var(--progress-bar1), var(--progress-bar) 140%);
	border: 1px solid var(--progress-bar-frame);
	/* Not sure about what it's for, but this thin line does show up. */
	box-shadow: inset -4px 0 0 -3px rgb(255 255 255 / 0.1);
}
</style>
