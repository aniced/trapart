<template>
	<fieldset>
    <slot></slot>
  </fieldset>
</template>

<style scoped>
fieldset {
  position: relative;
}

fieldset::before{
  content: "";
  position: absolute;
  inset: 0;
  border: 2px solid var(--control-frame);
  border-radius: 8px;
  opacity: 0.8;
}
</style>
