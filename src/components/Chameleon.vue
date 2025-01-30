<script setup lang="ts" generic="T">
import type { Schema } from '../schema'

const props = defineProps<{
	type: Schema<T>,
	value: T,
}>()

const emit = defineEmits<{
	(e: 'update', value: T, commit?: boolean): void,
}>()
</script>

<template>
	<div :class="{
		chameleon: true,
	}">
		<label>
			{{ type.title }}
		</label>
		<div>
			<component :="type.view.props" :is="type.view.component" :value @update="(value: T, commit: boolean) => $emit('update', value)"
				@input="(value: T) => $emit('input', value)" />
		</div>
		<div v-if="type.description">
			<component :is="type.description" />
		</div>
	</div>
</template>

<style lang="scss">
.chameleon {
	flex-direction: column;
}
</style>
