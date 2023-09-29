<script setup lang="ts">
// LabeledRadioButton is mostly copied from LabeledCheckBox.

const modelValue = defineModel<string>({ required: true })

defineProps<{
  value: string,
}>()
</script>

<template>
  <label class="label">
    <input type="radio" :value="value" v-model="modelValue">
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
