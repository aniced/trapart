<script setup lang="ts">
import { ref } from 'vue';

// While TextEditControl covers both single- and multiline forms, its only use is to derive TextField and TextArea.

defineProps({
	modelValue: { type: String, default: '' },
	maximumLineCount: { type: Number, default: 1 },
})
const emit = defineEmits(['update:modelValue'])

const inputMethodComposing = ref(false)
function setInputMethodComposing(value: boolean) {
	// visible: textEdit.inputMethodComposing && Qt.platform.os === "windows"
	inputMethodComposing.value = value && navigator.platform === 'Win32'
}

function emitUpdateModelValue(event: Event) {
	emit('update:modelValue', (event.target as HTMLInputElement | HTMLTextAreaElement).value)
}
</script>

<template>
	<component :is="maximumLineCount === 1 ? 'input' : 'textarea'" type="text" :value="modelValue"
		@input="!inputMethodComposing && emitUpdateModelValue($event)"
		class="control" :rows="maximumLineCount" @focus="$el.select()" @compositionstart="setInputMethodComposing(true)"
		@compositionend="emitUpdateModelValue($event), setInputMethodComposing(false)" :style="{
			// readonly property bool disableScrollBars: maximumLineCount > 0
			overflow: maximumLineCount > 0 ? 'hidden' : 'auto',
			// It does not exactly work like this, but it's the best we can do without rolling our own textboxes and carets.
			caretColor: inputMethodComposing ? 'red' : '',
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
	outline: 2px solid var(--focus-frame);
	border-radius: 2px;
}
</style>
