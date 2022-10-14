<script setup lang="ts">
// LabeledRadioButton is mostly copied from LabeledCheckBox.

defineProps<{
  value: string,
  modelValue: string,
}>()

defineEmits<{
  (e: "update:modelValue", value: string): void,
}>()
</script>

<template>
  <label class="label">
    <input type="radio" :checked="modelValue == value" @click="$emit('update:modelValue', value)">
    <div>
      <slot></slot>
    </div>
  </label>
</template>

<style scoped>
.label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.label>div {
  flex: auto;
}

:disabled .label {
  color: var(--disabled-text);
}
</style>
