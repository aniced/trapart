<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps({
  prefix: { type: String, default: "" },
  modelValue: { type: Number, default: 0 },
  minimumValue: { type: Number, default: -Infinity },
  maximumValue: { type: Number, default: Infinity },
  decimals: { type: Number, default: 0 },
  suffix: { type: String, default: "" },
})
const emit = defineEmits(["update:modelValue"])

const editable = ref<HTMLElement | null>(null)

// Roll our own input field and spinner buttons.
// It wouldn't be such a hassle if HTML <input> elements are more consistent and flexible.
// The most important feature missing is the ability to add prefixes and suffixes.
// Existing solutions (such as Bootstrap) put the string in another element, which doesn't move or scroll as the input value changes.
// In Qt, there's a reliable onCursorPositionChanged event, in which the selection is intercepted and modified before it reaches the screen, but now we're facing the infamous DOM.

const disabled = ref(false)

function selectValue() {
  if (editable.value) {
    getSelection()?.selectAllChildren(editable.value)
  }
}

const maxTextLength = computed(() =>
  Math.max(
    props.minimumValue.toFixed(props.decimals).length,
    props.maximumValue.toFixed(props.decimals).length
  )
)

// We update the DOM manually because Vue cannot easily handle the weirdness of contenteditable.
function normalize() {
  if (editable.value) {
    if (!(editable.value.childElementCount === 1 && editable.value.firstElementChild instanceof HTMLSpanElement)) {
      editable.value.replaceChildren(document.createElement("span"))
    }
    editable.value.firstElementChild!.textContent = props.modelValue.toString()
  }
}

watch(() => props.modelValue, normalize)

function onEnabledChanged() {
  if (editable.value) {
    disabled.value = editable.value.matches(":disabled *")
  }
}

onMounted(() => {
  onEnabledChanged()
  normalize()
})

function filterInput(event: Event) {
  if (event instanceof InputEvent) {
    if (event.inputType.startsWith("format")) {
      event.preventDefault()
      return
    }
  }
}

function onTextChanged() {
  let text = editable.value?.textContent ?? ""

  text = text.replace(/[^0-9\-\.]/g, "")
  if (props.minimumValue >= 0) text = text.replace(/\-/, "")
  if (props.decimals === 0) text = text.replace(/\./, "")
  if (text.length > maxTextLength.value) text = text.slice(0, maxTextLength.value)

  let newValue = +text
  if (Number.isNaN(newValue)) newValue = 0
  if (newValue < props.minimumValue) newValue = props.minimumValue;
  if (newValue > props.maximumValue) newValue = props.maximumValue;

  emit("update:modelValue", newValue)

  getSelection()?.removeAllRanges()
}

function increment(by: number) {
  if (!disabled.value) {
    emit("update:modelValue", Math.min(Math.max(props.modelValue + by, props.minimumValue), props.maximumValue))
  }
}

let timer = 0

function clickAutoRepeat(by: number) {
  // Note that clearInterval and clearTimeout are synonymous.
  clearInterval(timer)
  timer = 0
  if (by) {
    timer = setTimeout(() => {
      increment(by)
      timer = setInterval(() => {
        increment(by)
      }, 60) // measured, should be SH_SpinBox_ClickAutoRepeatRate
    }, 400) // measured, should be SH_SpinBox_ClickAutoRepeatThreshold
    addEventListener("pointerup", () => {
      clickAutoRepeat(0)
      increment(by)
      nextTick(() => editable.value?.focus())
    }, { once: true })
  }
}
</script>

<template>
  <div class="spin-box-container" @transitionrun="onEnabledChanged" @pointercancel="clickAutoRepeat(0)">
    <div ref="editable" class="input" :contenteditable="!disabled" inputmode="decimal" :data-prefix="prefix" :data-suffix="suffix"
      @beforeinput="filterInput" @focus="selectValue" @blur="onTextChanged(), $nextTick(normalize)"
      @keydown.arrow-up.prevent="increment(1), $nextTick(selectValue)"
      @keydown.arrow-down.prevent="increment(-1), $nextTick(selectValue)"
      @wheel.prevent="increment(Math.sign(-$event.deltaY))">
      <span></span>
    </div>
    <div class="up" @click="editable?.focus()" @pointerdown.left="clickAutoRepeat(1)"></div>
    <div class="down" @click="editable?.focus()" @pointerdown.left="clickAutoRepeat(-1)"></div>
  </div>
</template>

<style scoped>
.spin-box-container {
  position: relative;
  width: 80px;
  height: var(--control-height);
  font-family: var(--normal-font);
  font-size: var(--font-size);
  cursor: text;
  color: var(--normal-text);
  border: 2px solid transparent;
  background-color: var(--normal-back1);
  background-clip: padding-box;
  box-shadow: inset 0 0 0 1px var(--highlight);
  outline: 1px solid var(--control-frame);
  outline-offset: -2px;
  /* This is a hack to listen to style changes. */
  accent-color: lime;
  transition: 1s accent-color;
}

.input {
  position: absolute;
  inset: -2px;
  border: solid transparent;
  /* padding { top: 0; left: 6; right: 20; bottom: 0 } */
  border-width: 4px 20px 4px 6px;
  white-space: nowrap;
  line-height: 19px;
  overflow: hidden;
}

.input::before {
  content: attr(data-prefix);
}

.input::after {
  content: attr(data-suffix);
}

:disabled .spin-box-container {
  color: transparent;
  background-color: var(--window2);
  cursor: inherit;
  accent-color: red;
}

.up,
.down {
  position: absolute;
  right: -2px;
  width: 18px;
  cursor: default;
}

.up:active,
.down:active,
:disabled .up,
:disabled .down {
  opacity: 0.7;
}

.up {
  top: -2px;
  /* property rect upRect: Qt.rect(width - incrementControlLoader.implicitWidth, 0, incrementControlLoader.implicitWidth, height / 2 + 1) */
  height: 14px;
  background: var(--arrow-up-image) 4px 6.5px no-repeat;
}

.down {
  bottom: -2px;
  /* property rect downRect: Qt.rect(width - decrementControlLoader.implicitWidth, height / 2, decrementControlLoader.implicitWidth, height / 2) */
  height: 13px;
  background: var(--arrow-down-image) 4px 3px no-repeat;
}

/* Pretend that the input is still in focus while the spinners are held down. */
.spin-box-container:focus-within,
.spin-box-container:active:not(:disabled *) {
  outline: 2px solid var(--focus-frame);
  border-radius: 2px;
}

.spin-box-container:active:not(:disabled *)>.input:not(:focus)>* {
  color: var(--selected-ed-text);
  background-color: var(--selected-ed-back);
}

.input:focus {
  outline: none;
}
</style>
