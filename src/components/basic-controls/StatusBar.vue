<template>
	<div class="toolbar">
		<slot></slot>
	</div>
</template>

<style scoped>
.toolbar {
	height: 16px;
	background: linear-gradient(var(--window1), var(--window2));
	color: var(--normal-text);
	font-family: var(--fixed-font);
	font-size: var(--font-size);
	display: flex;
	line-height: 16px;
	/* The padding is measured; not sure where it comes from. */
	padding: 0 3px;
}

.toolbar :deep(hr) {
	flex: 0;
	margin: 2px 5px;
	border: 0;
	border-left: 1px solid var(--toolbar2-150);
	border-right: 1px solid var(--toolbar1-150);
}
</style>
