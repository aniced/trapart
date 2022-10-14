<script setup lang="ts">
import Labeler from "./Labeler.vue"
import TextEditControl from "../basic-controls/TextEditControl.vue"

defineProps<{
  title: string,
  modelValue: string,
}>()

defineEmits<{
  (e: "update:modelValue", value: string): void,
}>()
</script>

<template>
  <Labeler>
    <template #title>
      {{ title }}
    </template>
    <TextEditControl :maximum-line-count="1" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
  </Labeler>
</template>
