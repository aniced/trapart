<script lang="ts">
export default {
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'

const input = ref<HTMLInputElement | null>(null)
const props = defineProps({
	prefix: { type: String, default: "" },
	modelValue: { type: Number },
	minimumValue: { type: Number, default: -Infinity },
	maximumValue: { type: Number, default: Infinity },
	decimals: { type: Number, default: 0 },
	suffix: { type: String, default: "" },
})
const emit = defineEmits(["update:modelValue"])

// Roll our own input field and spinner buttons.
// It wouldn't be such a hassle if HTML <input> elements are more consistent and flexible.
// The most important feature missing is the ability to add prefixes and suffixes.
// Existing solutions (such as Bootstrap) put the string in another element, which doesn't move or scroll as the input value changes.
// In Qt, there's a reliable onCursorPositionChanged event, in which the selection is intercepted and modified before it reaches the screen, but now we're facing the infamous DOM.

function adjustCursorPosition(e: Event) {
	const el = e.target
	if (el instanceof HTMLInputElement) {
		const a = props.prefix.length
		const b = el.value.length - props.suffix.length
		if (el.selectionStart !== null) {
			const start = Math.min(Math.max(el.selectionStart, a), b)
			if (el.selectionStart != start) el.selectionStart = start
		}
		if (el.selectionEnd !== null) {
			const end = Math.min(Math.max(el.selectionEnd, a), b)
			if (el.selectionEnd != end) el.selectionEnd = end
		}
	}
}

const value = computed({
	get() {
		return props.prefix + props.modelValue?.toFixed(props.decimals) + props.suffix
	},
	set(value) {
		if (typeof value == "string") {
			let text: string = value
			if (text.slice(0, props.prefix.length) == props.prefix) {
				text = text.slice(props.prefix.length)
			}
			const suffixIndex = text.lastIndexOf(props.suffix)
			if (suffixIndex >= 0) text = text.slice(0, suffixIndex)

			const maxTextLength = Math.max(
				props.minimumValue.toFixed(props.decimals).length,
				props.maximumValue.toFixed(props.decimals).length
			)

			text = text.replace(/[^0-9\-\.]/g, "")
			if (props.minimumValue >= 0) text = text.replace(/\-/, "")
			if (props.decimals == 0) text = text.replace(/\./, "")
			if (text.length > maxTextLength) text = text.slice(0, maxTextLength)

			value = +text
			// fall through
		}
		if (typeof value == "number") {
			emit("update:modelValue", Math.min(Math.max(value, props.minimumValue), props.maximumValue))
		}
	},
})

function increment(by: number) {
	if (typeof props.modelValue == "number") {
		value.value = props.modelValue + by
	}
}

function selectValue() {
	input.value?.select()
}
</script>

<template>
	<div>
		<input ref="input" v-model="value" v-bind="$attrs" @focus="selectValue" @keydown.arrow-up="increment(1)" @keydown.arrow-down="increment(-1)"
			@keyup="adjustCursorPosition" @click="adjustCursorPosition" @dblclick="adjustCursorPosition"
			@select="adjustCursorPosition">
		<span class="up" @click="input?.focus()" @pointerdown="increment(1)"></span>
		<span class="down" @click="input?.focus()" @pointerdown="increment(-1)"></span>
		<span class="focus-frame"></span>
	</div>
</template>

<style scoped>
div {
	position: relative;
	width: 80px;
	height: var(--control-height);
}

input {
	width: 100%;
	height: 100%;
	font-family: var(--normal-font);
	font-size: var(--font-size);
	/* padding { top: 0; left: 6; right: 20; bottom: 0 } */
	padding: 0 18px 0 4px;
	color: var(--normal-text);
	border: 2px solid transparent;
	background-color: var(--normal-back1);
	background-clip: padding-box;
	box-shadow: inset 0 0 0 1px var(--highlight);
	outline: 1px solid var(--control-frame);
	outline-offset: -2px;
}

input:disabled {
	color: transparent;
	background-color: var(--window2);
}

.up,
.down {
	position: absolute;
	right: 2px;
	width: 18px;
}

.up:active,
.down:active,
:disabled~.up,
:disabled~.down {
	opacity: 0.7;
}

.up {
	top: 0;
	/* property rect upRect: Qt.rect(width - incrementControlLoader.implicitWidth, 0, incrementControlLoader.implicitWidth, height / 2 + 1) */
	height: 14px;
	background: var(--arrow-up-image) 6px 5.5px no-repeat;
}

.down {
	bottom: 0;
	/* property rect downRect: Qt.rect(width - decrementControlLoader.implicitWidth, height / 2, decrementControlLoader.implicitWidth, height / 2) */
	height: 13px;
	background: var(--arrow-down-image) 6px 3px no-repeat;
}

/* Pretend that the input is still in focus while the spinners are held down. */
.focus-frame {
	position: absolute;
	inset: 0;
	visibility: hidden;
	border-radius: 2px;
	border: 2px solid var(--focus-frame);
	pointer-events: none;
}

input:focus~.focus-frame,
.up:active~.focus-frame,
.down:active~.focus-frame {
	visibility: visible;
}
</style>
