<!--
  This is a versatile component that covers controls ranging from list boxes to tree views.
-->

<script lang="ts" setup generic="T, K">
import { ref, type PropType } from 'vue'

const modelValue = defineModel<number>({ default: 0 }) // currentIndex

defineProps({
  items: { type: Object as PropType<T[]>, required: true },
  multipleSelection: Boolean,
  dragDrop: Boolean,
})

const selectionStart = ref(2)
const selectionEnd = ref(4)
</script>

<template>
  <div tabindex="0" class="list-view">
    <table>
      <thead v-if="$slots.thead">
        <tr>
          <slot name="thead" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in items" :class="{
          current: i === modelValue,
          selected: i >= selectionStart && i < selectionEnd,
        }">
          <slot name="tbody" :item="item" :index="i" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss">
.list-view {
  align-items: flex-start;
  overflow: auto;

  >table {
    width: 100%;

    >thead {
      position: sticky;
      top: 0;
    }

    >thead>tr>th,
    >tbody>tr>td {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
