<script setup lang="ts">
defineProps<{
	title: String,
}>()
</script>

<template>
	<div class="tooltip">
		<h1 class="title">{{ title }}</h1>
		<slot></slot>
	</div>
</template>

<style scoped>
.tooltip {
	padding: 7px;
	padding-top: 0;
	/* Qt for Linux does not support transparent windows, but our platform do. */
	border-radius: 6px;
	max-width: 316px;
	border: 1px solid var(--control-frame);
	background-color: var(--normal-back1);
	overflow: hidden;
	color: var(--normal-text);
	font-size: calc(var(--font-size) - 1px);
}

.title {
	font-family: var(--heavy-font);
	font-weight: bold;
	font-size: inherit;
	padding: 7px 7px 4px;
	margin: 0 -7px 4px;
	background-color: var(--normal-back2);
}
</style>
