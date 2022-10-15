<script setup lang="ts">
import { ref } from "vue"
import type { SchemaType } from "@/infer"
import LabeledCheckBox from "./basic-layouts/LabeledCheckBox.vue"
import Labeler from "./basic-layouts/Labeler.vue"
import TextEditControl from "./basic-controls/TextEditControl.vue"
import SpinBox from "./basic-controls/SpinBox.vue"

withDefaults(defineProps<{
	title?: string,
	type: SchemaType,
	value: any,
	// `key` has been taken by Vue.
	keyName: string,
}>(), {
	title: props => props.keyName,
})

defineEmits<{
	(e: "update:modelValue", value: any): void,
}>()

//TODO
const isNull = ref(false)

// assertions:
// - type.type !== "unknown" (not needed after SchemaType refactor)
// - Object.hasOwn(value, key)
</script>

<template>
	<div v-if="type.type === 'null'">
		{{ title }}: null
	</div>
	<LabeledCheckBox v-else-if="type.type === 'boolean'" v-model="value[keyName]">
		{{ title }}
	</LabeledCheckBox>
	<Labeler v-else-if="type.type === 'optional'">
		<template #title>optional</template>
		<LabeledCheckBox v-model="isNull">{{ title }}</LabeledCheckBox>
		<Chameleon :type="type.items" :value="value" :key-name="keyName" />
	</Labeler>
	<Labeler v-else>
		<template #title>{{ title }}</template>
		<div v-if="type.type === 'any'">
			{{ JSON.stringify(value[keyName]) }}
		</div>
		<TextEditControl v-else-if="type.type === 'string'" v-model="value[keyName]" />
		<SpinBox v-else-if="type.type === 'number'" v-model="value[keyName]" />
		<template v-else-if="type.type === 'array'">
			<Chameleon v-for="(_, i) in value[keyName]" :type="type.items" :value="value[keyName]" :key-name="i.toString()" />
		</template>
		<template v-else-if="type.type === 'map'">
			<Chameleon v-for="(_, i) in value[keyName]" :type="type.items" :value="value[keyName]" :key-name="i" />
		</template>
		<template v-else-if="type.type === 'object'">
			<Chameleon v-for="(_, i) in value[keyName]" :type="type.properties.get(i as unknown as string)" :value="value[keyName]" :key-name="i" />
		</template>
		<div v-else>
			unknown type {{ JSON.stringify(type.type) }} encountered
		</div>
	</Labeler>
</template>
