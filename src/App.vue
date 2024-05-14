<script setup lang="ts">
import { ref, type Component } from 'vue'
import { symbolize } from './utilities'
import Demo from './components/Demo.vue'
import Sandbox from './Sandbox.vue'
const runningApplications: { name: string, component: Component }[] = [
	{ name: 'Demo 1', component: Demo },
	{ name: 'Demo 2', component: Demo },
	{ name: 'Sandbox', component: Sandbox },
]
const activeApplication = ref(0)

import initialStyleSheets from './styles'
import StyleSheets from './components/StyleSheets.vue'
const styleSheets = ref(initialStyleSheets)
</script>

<template>
	<StyleSheets :sources="styleSheets" />
	<div class="vbox" style="width: 200px;">
		<menu class="menu-bar">menu bar</menu>
		<div class="fill">
			<label v-for="({ name }, index) in runningApplications">
				<input type="radio" name="application" :value="index" v-model.number="activeApplication">
				{{ name }}
			</label>
		</div>
		<ul class="status-bar">
			<li>Ready.</li>
			<hr>
			<li>Hi!</li>
		</ul>
	</div>
	<div id="workingArea" class="fill scroll">
		<!--
			Through :key on <component>, multiple instances of the same component can be cached.
			However, in this case, it is currently (Vue 3.4) impossible to destroy a specific instance.
			https://github.com/vuejs/rfcs/pull/284
			I put each component in a separate <KeepAlive> and destroy the container instead.
		-->
		<KeepAlive v-for="(application, index) in runningApplications" :key="symbolize(application)" :max="1">
			<component v-if="index === activeApplication" :is="application.component" />
		</KeepAlive>
	</div>
</template>

<style lang="scss">
// Layout-related, theme-agnostic styles should be defined here.
@layer base {

	*,
	::before,
	::after {
		// Sane defaults that many CSS resets include.
		box-sizing: border-box;
		margin: 0;
		border: 0;
		padding: 0;
		// Allow nested scroll containers to have an impact on parent sizing.
		min-width: 0;
		min-height: 0;
		// Avoid the default flex-shrink: 1 as it is almost always undesirable.
		flex-shrink: 0;
		cursor: inherit;
	}

	:root {
		user-select: none;
		cursor: default;
		text-decoration-skip-ink: none;
	}

	aside,
	center,
	details,
	div,
	dl,
	fieldset,
	figure,
	footer,
	form,
	header,
	hgroup,
	label,
	main,
	menu,
	nav,
	ol,
	search,
	section,
	ul {
		display: flex;
	}

	th {
		font-weight: inherit;
	}

	ul,
	ol,
	menu {
		list-style: none;
	}

	html,
	body,
	[data-v-app] {
		width: 100%;
		height: 100%;
	}

	dialog,
	.vbox {
		display: flex;
		flex-direction: column;
	}

	.fill {
		flex: 1e6;
	}

	.scroll {
		overflow: auto;
	}
}
</style>
