<script setup lang="ts">
import type { Schema } from '../../schema'
import Chameleon from '../Chameleon.vue'

const props = defineProps<{
	value: any,
	fields: Record<string, Schema<any>>,
}>()
</script>

<template>
	<Chameleon v-for="(field, key) in fields" :type="field" :value="value[key]" @update="$emit('update', ...$event)" />
</template>

<style lang="scss">
.chameleon {
	flex-direction: column;
}
</style>
