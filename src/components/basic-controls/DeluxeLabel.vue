<template>
	<h1 class="hint-area">
		<slot></slot>
	</h1>
</template>

<style scoped>
.hint-area {
  width: 200px;
  height: 37px;
  overflow: hidden;
  background: linear-gradient(var(--deluxe-label1), var(--deluxe-label2));
  border: 1px solid var(--deluxe-label2);
  border-radius: 2px;
  text-align: center;
  /* verticalAlignment: Text.AlignVCenter */
  line-height: 35px;
  color: var(--deluxe-label-text);
  font-family: var(--heavy-font);
  font-weight:bold;
  font-size: 22px;
}

:disabled .hint-area {
  /* Subtlety. The background and the text are in separate alpha groups. I have never seen a DeluxeLabel disabled anyway… */
  opacity: 0.5;
}
</style>
