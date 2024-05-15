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
    let x = mouseX + 2
    let y = mouseY + 16
    // if (info.cursorShape === Qt.IBeamCursor) y -= 6;
    if (cursorShape === 'text' || cursorShape === 'auto') y -= 6
    // if (info.cursorShape === Qt.ArrowCursor && Qt.platform.os === "windows") y += 4;
    if (cursorShape === 'default' && navigator.platform === 'Win32') y += 4
    return new DOMRectReadOnly(x, y, 0, 0)
  }
})), toolTip, {
  placement: 'bottom-start',
  strategy: 'fixed',
  // var screen = TkoolAPI.desktopAvailableGeometryAtPoint(Qt.point(x, y));
  middleware: [shift({ mainAxis: true, crossAxis: true })],
}).floatingStyles
let mouseX = 0
let mouseY = 0
let cursorShape = 'default'
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
  if (event.target instanceof Element) {
    cursorShape = getComputedStyle(event.target).cursor
  }
}

function onEntered(event: PointerEvent | MouseEvent) {
  updateMouse(event)
  mouseEntered = true
}

function onPositionChanged(event: PointerEvent | MouseEvent) {
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
    <div @pointerdown="hideToolTip" @pointerenter="onEntered" @pointermove="onPositionChanged"
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
