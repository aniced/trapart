<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useEnabled } from '../Enable.vue'

const modelValue = defineModel<number>({ required: true })

const props = defineProps({
  prefix: { type: String, default: '' },
  minimumValue: { type: Number, default: -Infinity },
  maximumValue: { type: Number, default: Infinity },
  decimals: { type: Number, default: 0 },
  suffix: { type: String, default: '' },
})

const editable = ref<HTMLElement | null>(null)

// Roll our own input field and spinner buttons.
// It wouldn't be such a hassle if HTML <input> elements are more consistent and flexible.
// The most important feature missing is the ability to add prefixes and suffixes.
// Existing solutions (such as Bootstrap) put the string in another element, which doesn't move or scroll as the input value changes.
// In Qt, there's a reliable onCursorPositionChanged event, in which the selection is intercepted and modified before it reaches the screen, but now we're facing the infamous DOM.
// The selectionchange event is fired for everything except <input> and <textarea>, which 

const enabled = useEnabled()

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
  if (
    editable.value
    && !(
      editable.value.childNodes.length === 1
      && editable.value.firstChild!.nodeType === Node.TEXT_NODE
      && editable.value.firstChild!.textContent === modelValue.value.toString()
    )
  ) {
    editable.value.textContent = modelValue.value.toString()
  }
}
watch(() => modelValue.value, normalize)
onMounted(normalize)

function filterInput(event: Event) {
  if (event instanceof InputEvent) {
    if (event.inputType.startsWith("format")) {
      event.preventDefault()
      return
    }
  }
}

function onTextChanged() {
  let text = editable.value?.textContent ?? ''

  text = text.replace(/[^0-9\-\.]/g, '')
  if (props.minimumValue >= 0) text = text.replace(/\-/, '')
  if (props.decimals === 0) text = text.replace(/\./, '')
  if (text.length > maxTextLength.value) text = text.slice(0, maxTextLength.value)

  let newValue = +text
  if (Number.isNaN(newValue)) newValue = 0
  if (newValue < props.minimumValue) newValue = props.minimumValue;
  if (newValue > props.maximumValue) newValue = props.maximumValue;

  modelValue.value = newValue

  getSelection()?.removeAllRanges()
}

function increment(by: number) {
  if (enabled.value) {
    modelValue.value = Math.min(Math.max(modelValue.value + by, props.minimumValue), props.maximumValue)
    nextTick(selectValue)
  }
}

let timer = 0

function clickAutoRepeat(by: number) {
  // Note that clearInterval and clearTimeout are synonymous.
  clearInterval(timer)
  timer = 0
  editable.value?.focus()
  if (by) {
    timer = setTimeout(() => {
      increment(by)
      timer = setInterval(() => {
        increment(by)
      }, 60) // measured, should be SH_SpinBox_ClickAutoRepeatRate
    }, 400) // measured, should be SH_SpinBox_ClickAutoRepeatThreshold
    addEventListener('pointerup', () => {
      clickAutoRepeat(0)
      increment(by)
    }, { once: true })
  }
}
</script>

<template>
  <div class="spin-box" @pointercancel="clickAutoRepeat(0)">
    <div ref="editable" class="input" :contenteditable="enabled" inputmode="decimal" :data-prefix="prefix"
      :data-suffix="suffix" @beforeinput="filterInput" @focus="selectValue"
      @blur="onTextChanged(), $nextTick(normalize)" @keydown.arrow-up.prevent="increment(1)"
      @keydown.arrow-down.prevent="increment(-1)" @wheel.prevent="increment(Math.sign(-$event.deltaY))">
    </div>
    <!-- preventDefault so that the editable does not lose focus. -->
    <div class="up" @pointerdown.left.prevent="clickAutoRepeat(1)"></div>
    <div class="down" @pointerdown.left.prevent="clickAutoRepeat(-1)"></div>
  </div>
</template>

<style lang="scss">
.spin-box {
  >.input {
    white-space: nowrap;
    cursor: text;

    &::before {
      content: attr(data-prefix);
    }

    &::after {
      content: attr(data-suffix);
    }

    :disabled & {
      cursor: inherit;
    }
  }
}
</style>
