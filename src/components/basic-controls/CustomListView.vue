<script lang="ts" setup>
import { ref } from 'vue'

withDefaults(defineProps<{
  items: unknown[],
  itemHeight: number,
  multipleSelect?: boolean,
  lineNumber?: boolean,
  dragDrop?: boolean,
  indentWidth?: number,
}>(), {
  itemHeight: 20,
  multipleSelect: false,
  lineNumber: false,
  dragDrop: false,
  indentWidth: 8,
})

const selectionStart = ref(0)
const selectionEnd = ref(0)
</script>

<template>
  <div tabindex="0" class="custom-list-view" :style="{ '--item-height': itemHeight + 'px' }">
    <table>
      <thead v-if="$slots.thead">
        <tr class="list-box-header">
          <td v-if="lineNumber" class="line-number">{{ items.length - 1 }}</td>
          <slot name="thead" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" class="list-box-row">
          <td v-if="lineNumber" class="line-number">{{ i }}</td>
          <slot name="tbody" :item="item" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.custom-list-view {
  border: 2px solid transparent;
  overflow: auto;
  // Fill extra rows with alternate colors.
  background:
    scroll 0 -1px / 100% var(--item-height) linear-gradient(var(--list-box-row-underline) 1px, transparent 0),
    scroll repeating-linear-gradient(var(--normal-back1) 0 var(--item-height), var(--normal-back2) 0 calc(var(--item-height) * 2));
}

.custom-list-view>table {
  table-layout: fixed;
  border-spacing: 0;
  width: 100%;
}

.list-box-header {
  position: sticky;
  top: 0;
  height: 20px;
  background: linear-gradient(var(--button1), var(--button2));
  line-height: 20px;
  text-align: left;
  padding-left: 12px;
  color: var(--normal-text);
  font-family: var(--medium-font);
  font-size: var(--font-size);

  :disabled & {
    color: var(--disabled-text)
  }

  &>:deep(th) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    border: solid var(--control-frame);
    border-width: 0 1px 1px 0;
  }
}

.list-box-row {
  height: var(--item-height);
  line-height: var(--item-height);
  background: var(--normal-back1);
  box-shadow: inset 0 -1px var(--list-box-row-underline);

  &:nth-child(2n) {
    background: var(--normal-back2);
  }

  &.selected {
    background: linear-gradient(var(--selected-back-130) -20%, var(--selected-back) 140%);
  }
}

.custom-list-view:focus {
  outline: none;

  .list-box-row.current {
    outline: var(--focus-frame);
    outline-offset: -2px;
  }
}

.line-number {
  // property int lineNumberWidth: Math.max((lineNumberSizeHint.width + 10), lineNumberMinWidth)
  min-width: 20px;
  padding-left: 10px;
  color: var(--normal-text);
  background-color: var(--window1);
  text-align: right;
  line-height: var(--item-height);
  font-family: var(--fixed-font);
  font-size: calc(var(--font-size) * 0.75);

  thead & {
    color: transparent;
  }

  :disabled & {
    color: var(--disabled-text);
  }
}
</style>
