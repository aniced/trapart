<script setup lang="ts">
const modelValue = defineModel<string>({ required: true })
defineProps({
	singleLine: Boolean,
})
</script>

<template>
	<component :is="singleLine ? 'textarea' : 'input'" type="text" :value="modelValue" @input="
		// `v-model` is expanded to `:modelValue` and `@update:modelValue` on a <component> tag.
		// Therefore, it is infeasible to use `v-model` on a native element directly.
		// https://vuejs.org/api/built-in-special-elements.html#component
		$emit('update:modelValue', $event.target.value)
		" @focus="$el.select()"></component>
</template>

<style>
input[type="text" i],
textarea {
	cursor: auto;
	resize: none;
}
</style>
