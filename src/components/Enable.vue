<script lang="ts">
import { ref, readonly, type InjectionKey, type Ref } from 'vue'
const ENABLED = Symbol() as InjectionKey<Readonly<Ref<boolean>>>
const trueRef = readonly(ref(true))
/**
 * Use <Enable> to provide containers.
 * Inject as `const enabled = useEnabled()` for templates and scripts.
 * In CSS, use `&:disabled` for form controls and `:disabled &` for others.
 */
export function useEnabled() {
  return inject(ENABLED, trueRef)
}
</script>

<script setup lang="ts">
import { computed, inject, provide } from 'vue'
const props = defineProps({
	if: { type: Boolean, default: true },
})
const parentEnabled = useEnabled()
const enabled = computed(() => parentEnabled.value && props.if)
provide(ENABLED, enabled)
</script>

<template>
	<fieldset :disabled="!enabled" style="display: contents;">
		<slot></slot>
	</fieldset>
</template>
