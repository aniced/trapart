<script setup lang="ts">
import { ref } from 'vue'
import Demo from './components/Demo.vue'
import Sandbox from './Sandbox.vue'

import initialStyleSheets from './styles'
import StyleSheets from './components/StyleSheets.vue'
const styleSheets = ref(initialStyleSheets)
</script>

<template>
  <Sandbox />
  <Demo />
  <StyleSheets :sources="styleSheets" />
</template>
