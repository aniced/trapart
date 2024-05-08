<script setup lang="ts">
import { ref } from "vue"
import type { Schema } from "../infer"
import TextEditControl from "./basic-controls/TextEditControl.vue"
import SpinBox from "./basic-controls/SpinBox.vue"

withDefaults(defineProps<{
	title?: string,
	type: Schema,
	value: any,
	// `key` has been taken by Vue.
	keyName: string | number | symbol,
}>(), {
	title: props => props.keyName.toString(),
})

defineEmits<{
	(e: "update:modelValue", value: any): void,
}>()

//TODO
const isNull = ref(false)

// assertions:
// - Object.hasOwn(value, key)
</script>

<template>
	<label v-if="type.type === 'boolean'">
		<input type="checkbox" v-model="value[keyName]">
		{{ title }}
	</label>
	<label v-else-if="type.type === 'optional'" class="vbox">
		optional
		<label>
			<input type="checkbox" v-model="isNull">
			{{ title }}
		</label>
		<div class="indent">
			<Chameleon :type="type.items" :value="value" :key-name="keyName" />
		</div>
	</label>
	<label v-else class="vbox">
		{{ title }}
		<div v-if="type.type === 'any'">
			{{ JSON.stringify(value[keyName]) }}
		</div>
		<TextEditControl v-else-if="type.type === 'string'" v-model="value[keyName]" :maximum-line-count="type.multiline ? 0 : 1" />
		<SpinBox v-else-if="type.type === 'number'" v-model="value[keyName]" />
		<template v-else-if="type.type === 'array'">
			<Chameleon v-for="(_, i) in value[keyName]" :type="type.items" :value="value[keyName]" :key-name="i.toString()" />
		</template>
		<template v-else-if="type.type === 'map'">
			<Chameleon v-for="(_, i) in value[keyName]" :type="type.items" :value="value[keyName]" :key-name="i" />
		</template>
		<template v-else-if="type.type === 'object'">
			<Chameleon v-for="(_, i) in value[keyName]" :type="type.properties[i]" :value="value[keyName]" :key-name="i" />
		</template>
		<div v-else>
			unknown type {{ JSON.stringify(type.type) }} encountered
		</div>
	</label>
</template>
