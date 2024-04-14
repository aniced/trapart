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

<style>
@layer base {
  *,
  ::before,
  ::after {
    box-sizing: border-box;
    margin: 0;
    border: 0;
    padding: 0;
    min-width: 0;
    min-height: 0;
    flex-shrink: 0;
    cursor: inherit;
  }

  :root {
    user-select: none;
    cursor: default;
    text-decoration-skip-ink: none;
  }

  html {
    height: 100%;
  }

  body {
    min-height: 100%;
  }
}
</style>
