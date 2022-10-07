<script setup lang="ts">
import { computePosition, shift } from '@floating-ui/dom';
import { ref, watch } from 'vue';
import ToolTip from './ToolTip.vue'

defineProps<{
  title: String,
}>()

const container = ref<HTMLDivElement | null>(null)
const toolTip = ref<HTMLDivElement | null>(null)
const toolTipVisible = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const cursorShape = ref("default")
const mouseEntered = ref(false)
let nextTime: Number

watch(toolTipVisible, async (newToolTipVisible, oldToolTipVisible) => {
  if (newToolTipVisible && !oldToolTipVisible) {
    const { x, y } = await computePosition({
      getBoundingClientRect() {
        let x = mouseX.value + 2
        let y = mouseY.value + 16
        // if (info.cursorShape === Qt.IBeamCursor) y -= 6;
        if (cursorShape.value == 'text') y -= 6
        // if (info.cursorShape === Qt.ArrowCursor && Qt.platform.os === "windows") y += 4;
        if (cursorShape.value == 'default' && navigator.platform == 'Win32') y += 4
        return {
          x,
          y,
          width: 0,
          height: 0,
          left: x,
          top: y,
          right: x,
          bottom: y,
        }
      }
    }, toolTip.value!, {
      placement: 'bottom-start',
      middleware: [shift({ mainAxis: true, crossAxis: true })],
    })
    toolTip.value!.style.left = `${x}px`
    toolTip.value!.style.top = `${y}px`
  } else if (!newToolTipVisible && oldToolTipVisible) {
    document.body.dataset.lastFadeout = Date.now().toString()
  }
})

function timer1() {
  if (Number.isNaN(nextTime)) return
  if (Date.now() >= nextTime) {
    toolTipVisible.value = true
  } else {
    setTimeout(timer1, 100)
  }
}

function updateMouse(event: PointerEvent | MouseEvent) {
  mouseX.value = event.clientX
  mouseY.value = event.clientY
  if (event.target instanceof Element) {
    cursorShape.value = getComputedStyle(event.target).cursor
  }
}

function onEntered(event: PointerEvent | MouseEvent) {
  updateMouse(event)
  mouseEntered.value = true
}

function onPositionChanged(event: PointerEvent | MouseEvent) {
  updateMouse(event)
  if (mouseEntered.value && !toolTipVisible.value) {
    const lastFadeout = +(document.body.dataset.lastFadeout ?? "0")
    nextTime = Date.now() + (Math.abs(Date.now() - lastFadeout) < 300 ? 400 : 1200)
    timer1()
  }
}

function hideToolTip(event: PointerEvent | MouseEvent) {
  updateMouse(event)
  mouseEntered.value = false
  nextTime = NaN
  toolTipVisible.value = false
}
</script>
  
<template>
  <div ref="container">
    <div @pointerdown="hideToolTip" @pointerenter="onEntered" @pointermove="onPositionChanged"
      @pointerleave="hideToolTip" @pointercancel="hideToolTip" @wheel="hideToolTip">
      <slot></slot>
    </div>
    <Transition>
      <div class="tooltip-container" ref="toolTip" v-show="toolTipVisible">
        <ToolTip :title="title">
          <slot name="hint"></slot>
        </ToolTip>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.tooltip-container {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.v-enter-active,
.v-leave-active {
  /* duration: 300; easing.type: Easing.InOutQuad */
  /* However, Qt 5.4 is buggy on Windows, making animations faster than they should be (QTBUG-42699). With environment variable QSG_RENDER_LOOP=basic, it is correct. */
  transition: opacity 300ms cubic-bezier(0.45, 0, 0.55, 1);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
