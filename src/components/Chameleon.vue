<script setup lang="ts">
import type { SchemaType } from "@/infer"
import LabeledCheckBox from "./basic-layouts/LabeledCheckBox.vue"
import Labeler from "./basic-layouts/Labeler.vue"
import TextEditControl from "./basic-controls/TextEditControl.vue"
import SpinBox from "./basic-controls/SpinBox.vue"

withDefaults(defineProps<{
	title?: string,
	type: SchemaType,
	value: any,
	key: string,
}>(), {
	title: props => props.key,
})

defineEmits<{
	(e: "update:modelValue", value: any): void,
}>()

// assertions:
// - type.type !== "unknown" (not needed after SchemaType refactor)
// - Object.hasOwn(value, key)
</script>

<template>
	<div v-if="type.type === 'null'">
		{{ title }}: null
	</div>
	<LabeledCheckBox v-else-if="type.type === 'boolean'" v-model="value[key]">
		{{ title }}
	</LabeledCheckBox>
	<Labeler v-else>
		<template #title>{{ title }}</template>
		<div v-if="type.type === 'any'">
			{{ JSON.stringify(value[key]) }}
		</div>
		<TextEditControl v-else-if="type.type === 'string'" v-model="value[key]" />
		<SpinBox v-else-if="type.type === 'number'" v-model="value[key]" />
		<template v-else-if="type.type === 'array'">
			<Chameleon v-for="(_, i) in value[key]" :type="type.items" :value="value[key]" :key="i.toString()" />
		</template>
		<template v-else-if="type.type === 'map'">
			<Chameleon v-for="(_, i) in value[key]" :type="type.items" :value="value[key]" :key="i" />
		</template>
		<template v-else-if="type.type === 'optional'">
			TBD
		</template>
		<template v-else-if="type.type === 'object'">
			<Chameleon v-for="(_, i) in value[key]" :type="type.properties.get(i)" :value="value[key]" :key="i" />
		</template>
	</Labeler>
</template>
