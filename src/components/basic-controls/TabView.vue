<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
	modelValue: { type: Number, default: 0 },
	pages: { type: Array },
	tabPosition: { type: String, default: "top" },
	itemHeight: { type: Number, default: 32 },
})
defineEmits(["update:modelValue"])
const container = ref<HTMLDivElement | null>(null)

function tabStyle(index: number) {
	return {
		height: `${props.itemHeight}px`,
		backgroundImage: `linear-gradient(var(--tab1) -${index}00%, var(--tab2) ${((container.value?.clientHeight ?? 0) / props.itemHeight - index) * 100}%)`,
		lineHeight: `${props.itemHeight - 4}px`,
	}
}
</script>

<template>
	<div :class="tabPosition" ref="container">
		<div class="tab-bar">
			<div :class="{ tab: true, active: modelValue == index }" :style="tabStyle(index)" v-for="(page, index) in pages"
				@click="$emit('update:modelValue', index)" @pointerdown="$emit('update:modelValue', index)">
				<div>
					<div tabindex="0">{{ page }}</div>
				</div>
			</div>
		</div>
		<template v-for="(page, index) in pages">
			<div class="frame" v-show="modelValue == index">{{ page }} contents</div>
		</template>
	</div>
</template>

<style scoped>
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
