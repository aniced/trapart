<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
	modelValue: { type: Number, default: 0 },
	pages: { type: Array },
	tabPosition: { type: String, default: "top" },
	itemHeight: { type: Number, default: 32 },
})
const emit = defineEmits(["update:modelValue"])
const container = ref<HTMLDivElement | null>(null)
const containerHeight = ref(0)

function tabStyle(index: number) {
	return {
		height: `${props.itemHeight}px`,
		backgroundImage: `linear-gradient(var(--tab1) -${index}00%, var(--tab2) ${(containerHeight.value / props.itemHeight - index) * 100}%)`,
		lineHeight: `${props.itemHeight - 4}px`,
	}
}

const resizeObserver = new ResizeObserver(entries => {
	containerHeight.value = entries[0].contentRect.height
})

onMounted(() => {
	resizeObserver.observe(container.value!)
})

function increment(by: number) {
	if (props.pages === undefined) return
	by += props.modelValue
	if (by >= 0 && by < props.pages.length) {
		emit("update:modelValue", by)
	}
}

// Frequent page changes in the database dialog are suppressed by the following function in RPG Maker MV to avoid crashes. We don't crash.
// function canChangePage() { return Math.abs(Date.now() - lastChangedTime) > 400; }
</script>

<template>
	<div :class="tabPosition" ref="container" @keydown.ctrl.page-up.stop.prevent="increment(-1)"
		@keydown.ctrl.page-down.stop.prevent="increment(1)" @keydown.alt.page-up.stop.prevent="increment(-1)"
		@keydown.alt.page-down.stop.prevent="increment(1)">
		<div class="tab-bar">
			<div :class="{ tab: true, active: modelValue == index }" :style="tabStyle(index)" v-for="(page, index) in pages"
				@pointerdown="$emit('update:modelValue', index)">
				<div>
					<div tabindex="0" @click="$emit('update:modelValue', index)" @keydown.arrow-up.prevent="increment(-1)"
						@keydown.arrow-down.prevent="increment(1)">{{ page }}</div>
				</div>
			</div>
		</div>
		<div class="frame">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
.top,
.left {
	position: relative;
}

.left {
	.tab-bar {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 120px;
	}

	.tab {
		width: 117px;
		margin-left: 1px;
		font-family: var(--medium-font);
		font-size: var(--font-size);
		color: var(--normal-text);
		padding: 1px 0 1px 1px;
		border-radius: 2px 0 0 2px;
		text-align: center;
		--tab1: var(--inactive-tab1);
		--tab2: var(--inactive-tab2);
		background-clip: content-box;
	}

	.tab.active {
		width: 120px;
		margin-left: 0px;
		--tab1: var(--window1);
		--tab2: var(--window2);
	}

	.tab>* {
		height: 100%;
		border: 1px solid var(--highlight);
		border-right-style: none;
		border-radius: 2px 0 0 2px;
		box-shadow: 0 -1px var(--control-frame), 0 1px var(--control-frame), -1px -1px var(--control-frame),
			-1px 1px var(--control-frame);
	}

	.tab.active>* {
		margin-right: 1px;
	}

	.tab.active>*>* {
		/* The radius is set so that the focus ring appears with rounded corners but pratically with a rectangle inside. */
		border-radius: 0.1px;
	}

	.frame {
		margin-left: 118px;
		height: 100%;
		border: 1px solid var(--control-frame);
		box-shadow: inset 0 0 0 1px var(--highlight);
		background-image: linear-gradient(var(--window1), var(--window2));
	}
}
</style>
