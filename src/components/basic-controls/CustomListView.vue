<script lang="ts" setup>
import { ref, type PropType } from 'vue'

const modelValue = defineModel<number>({ local: true, default: 0 }) // currentIndex

defineProps({
  // Before generic props come to Vue, fall back to no typing.
  items: { type: Array as PropType<any[]>, required: true },
  itemHeight: { type: Number, default: 20 },
  multipleSelect: Boolean,
  lineNumber: Boolean,
  dragDrop: Boolean,
  showSelectionAlways: { type: Boolean, default: true },
  selectBottomByExtraRows: Boolean,
  cancelMultiSelectOnLostFocus: Boolean,
  indentWidth: { type: Number, default: 8 },
})

const selectionStart = ref(2)
const selectionEnd = ref(4)
</script>

<template>
  <div tabindex="0" class="custom-list-view" :style="{
    '--item-height': itemHeight + 'px',
    '--header-height': $slots.thead ? '20px' : '0',
  }">
  <div v-if="lineNumber" class="line-numbers">{{
    Object.keys(items).join("\n")
  }}</div>
    <table>
      <thead v-if="$slots.thead">
        <tr class="list-box-header">
          <slot name="thead" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" class="list-box-row" :class="{
          current: i === modelValue,
          selected: showSelectionAlways && i >= selectionStart && i < selectionEnd,
        }">
          <slot name="tbody" :item="item" :index="i" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.custom-list-view {
  display: flex;
  align-items: flex-start;
  border: 2px solid transparent;
  overflow: auto;
  // Fill extra rows with alternate colors.
  background:
    content-box local 0 var(--header-height) / 100% var(--item-height) linear-gradient(to top, var(--list-box-row-underline) 1px, transparent 0),
    content-box local 0 var(--header-height) repeating-linear-gradient(var(--normal-back1) 0 var(--item-height), var(--normal-back2) 0 calc(var(--item-height) * 2));
}

.custom-list-view>table {
  table-layout: fixed;
  border-spacing: 0;
  width: 100%;
  flex: 1;
}

.list-box-header {
  position: sticky;
  top: 0;
  height: 20px;
  background: linear-gradient(var(--button1), var(--button2));
  line-height: 20px;
  text-align: left;
  color: var(--normal-text);
  font-family: var(--medium-font);
  font-size: var(--font-size);

  :disabled & {
    color: var(--disabled-text)
  }

  &>:deep(th) {
    box-shadow: inset -1px -1px var(--control-frame);
    font-weight: normal;
  }
}

.list-box-row {
  height: var(--item-height);
  line-height: var(--item-height);

  &.selected {
    background: linear-gradient(var(--selected-back-130) -20%, var(--selected-back) 140%);
    color: var(--selected-text);
  }

  :disabled & {
    visibility: hidden;
  }
}

.list-box-header>:deep(th),
.list-box-row>:deep(td){
  padding-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-list-view:focus {
  outline: none;

  .list-box-row.current {
    outline: var(--focus-frame);
    outline-offset: -2px;
    border-radius: 2px;
  }
}

.line-numbers {
  // property int lineNumberWidth: Math.max((lineNumberSizeHint.width + 10), lineNumberMinWidth)
  min-width: 20px;
  padding: var(--header-height) 4px 0 6px;
  // opacity: 0.75 * (root.enabled ? 1 : 0.5)
  // Approximated.
  color: var(--normal-text-70);
  background-color: var(--window1);
  text-align: right;
  line-height: var(--item-height);
  font-family: var(--fixed-font);
  font-size: calc(var(--font-size) * 0.75);
  white-space: pre;

  :disabled & {
    color: var(--disabled-text-38);
  }
}
</style>
