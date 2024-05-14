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
  if (toolTip) {
    toolTip.showPopover()
  } else {
    lastFadeout = Date.now()
  }
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
    <article class="tooltip" ref="toolTip" v-if="toolTipVisible" popover :style="toolTipStyles">
      <slot name="hint"></slot>
    </article>
  </div>
</template>

<style lang="scss">
@starting-style {
  .tooltip {
    opacity: 0;
  }
}

.tooltip {
  // duration: 300; easing.type: Easing.InOutQuad
  // However, Qt 5.4 is buggy on Windows, making animations faster than they should be (QTBUG-42699). With environment variable QSG_RENDER_LOOP=basic, it is correct.
  transition: opacity 300ms cubic-bezier(0.45, 0, 0.55, 1), display allow-discrete;
}
</style>
