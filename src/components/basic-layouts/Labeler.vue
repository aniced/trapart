<script setup lang="ts">
defineProps({
	// Properties `horizontal` and `labelOnTop` seem redundant. `horizontal` is omitted.
	labelOnTop: { type: Boolean, default: true },
	minimumLabelWidth: { type: Number, default: 0 },
})
</script>

<template>
	<div class="labeler" :class="labelOnTop ? 'top' : 'left'">
		<label :style="{ minWidth: minimumLabelWidth + 'px' }">
			<slot name="title" />:
		</label>
		<div>
			<slot />
		</div>
	</div>
</template>

<style scoped>
.labeler {
	display: flex;
}

.labeler.left {
	gap: 16px;
	align-items: center;
}

.labeler.top {
	flex-direction: column;
}
</style>
