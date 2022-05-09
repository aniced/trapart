<template>
	<fieldset>
    <legend>
      <slot name="title"></slot>
    </legend>
    <slot></slot>
  </fieldset>
</template>

<style scoped>
fieldset {
  position: relative;
  padding: 26px 10px 8px;
  border-radius: 6px;
  border: 1px solid var(--group-box-frame);
  background-image: linear-gradient(var(--group-box1), var(--group-box2));
}

legend {
  /* fieldset>legend is special-cased in styling and cannot be overridden. Our best bet is to throw the legend out of the flow. */
  position: absolute;
  /* Set the padding so that tooltips are shown even if the cursor was a bit off. */
  /* width: text.paintedWidth + 12 */
  padding-right: 12px;
  /* height: text.paintedHeight + 6 */
  padding-bottom: 6px;
  /* anchors.topMargin: 4 */
  top: 3px;
  /* anchors.leftMargin: 6 */
  left: 5px;
  color: var(--normal-text);
  font-family: var(--heavy-font);
  font-weight: bold;
  font-size: var(--font-size);
}

:disabled legend {
  color: var(--disabled-text);
}
</style>
