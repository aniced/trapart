<script setup lang="ts">
// While TextEditControl covers both single- and multiline forms, its only use is to derive TextField and TextArea.

defineProps({
	maximumLineCount: { type: Number, default: 1 },
})
const modelValue = defineModel<string>({ required: true })
</script>

<template>
	<component :is="maximumLineCount === 1 ? 'input' : 'textarea'" type="text" v-model="modelValue"
		:rows="maximumLineCount" @focus="$el.select()"
		class="control" :style="{
			// readonly property bool disableScrollBars: maximumLineCount > 0
			overflow: maximumLineCount > 0 ? 'hidden' : 'auto',
		}"></component>
</template>

<style>
.control {
	/* We cannot blindly copy cursorShape: Qt.IBeamCursor as cursor: text bleeds into the scrollbars. */
	cursor: auto;
	width: 100px;
	padding: 2px 4px 3px;
	font-family: var(--fixed-font);
	font-size: var(--font-size);
	color: var(--normal-text);
	border: 2px solid transparent;
	background: padding-box var(--normal-back1);
	box-shadow: inset 0 0 0 1px var(--highlight);
	outline: 1px solid var(--control-frame);
	outline-offset: -2px;
	resize: none;
}

input.control {
	height: var(--control-height);
	padding-top: 4px;
}

.control:disabled {
	color: transparent;
	background-color: var(--window2);
}

.control:focus {
	outline: var(--focus-frame);
	border-radius: 2px;
}
</style>
