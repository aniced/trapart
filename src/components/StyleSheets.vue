<script setup lang="ts">
defineProps<{
  sources: string[],
}>()
</script>

<template>
  <Teleport to="head">
    <component is="style" v-for="source in sources">{{ source }}</component>
  </Teleport>
</template>
