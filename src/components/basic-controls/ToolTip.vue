<script lang="ts">
let lastFadeout = 0
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFloating, shift } from '@floating-ui/vue'
import { useEnabled } from '../Enable.vue'

const enabled = useEnabled()
const toolTip = ref<HTMLDivElement | null>(null)
const toolTipVisible = ref(false)
const toolTipStyles = useFloating(computed(() => ({
  getBoundingClientRect() {
    return new DOMRectReadOnly(mouseX + 2, mouseY, 0, 16)
  }
})), toolTip, {
  placement: 'bottom-start',
  strategy: 'fixed',
  middleware: [shift({ mainAxis: true, crossAxis: true })],
}).floatingStyles
let mouseX = 0
let mouseY = 0
let mouseEntered = false
let nextTime = NaN

watch(toolTip, async toolTip => {
  if (!toolTip) lastFadeout = Date.now()
})

function timer1() {
  if (Number.isNaN(nextTime)) return
  if (Date.now() >= nextTime) {
    if (enabled.value) {
      toolTipVisible.value = true
    }
  } else {
    setTimeout(timer1, 100)
  }
}

function updateMouse(event: PointerEvent | MouseEvent) {
  mouseX = event.clientX
  mouseY = event.clientY
}

function onEnter(event: PointerEvent | MouseEvent) {
  updateMouse(event)
  mouseEntered = true
}

function onMove(event: PointerEvent | MouseEvent) {
  updateMouse(event)
  if (mouseEntered && !toolTipVisible.value) {
    nextTime = Date.now() + (Math.abs(Date.now() - lastFadeout) < 300 ? 400 : 1200)
    timer1()
  }
}

function hideToolTip(event: PointerEvent | MouseEvent) {
  updateMouse(event)
  mouseEntered = false
  nextTime = NaN
  toolTipVisible.value = false
}
</script>

<template>
  <div style="display: contents;">
    <div @pointerdown="hideToolTip" @pointerenter="onEnter" @pointermove="onMove"
      @pointerleave="hideToolTip" @pointercancel="hideToolTip" @wheel="hideToolTip">
      <slot></slot>
    </div>
    <Teleport to="body">
      <!--
        CSS @starting-style is for entering exclusively.
        It's impossible to control both enter and leave transitions in pure CSS.
        Vue <Transition> to the rescue.
      -->
      <Transition>
        <article class="tooltip" ref="toolTip" v-if="toolTipVisible" :style="toolTipStyles">
          <slot name="hint"></slot>
        </article>
      </Transition>
    </Teleport>
  </div>
</template>
