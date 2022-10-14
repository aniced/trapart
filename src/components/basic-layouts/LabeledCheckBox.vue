<script setup lang="ts">
defineProps<{
  modelValue: boolean,
}>()

defineEmits<{
  (e: "update:modelValue", value: boolean): void,
}>()
</script>

<template>
  <label class="label">
    <input type="checkbox" :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)">
    <div>
      <slot></slot>
    </div>
  </label>
</template>

<style scoped>
.label {
  display: flex;
  align-items: center;
  /* Measured, it seems to come from QtQuick.Controls.CheckBox. */
  gap: 5px;
}

.label>div {
  flex: auto;
}

:disabled .label {
  color: var(--disabled-text);
}
</style>
