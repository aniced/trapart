<script setup lang="ts">
import { ref, type Component } from 'vue'
import Demo from './components/Demo.vue'
import Sandbox from './Sandbox.vue'
const runningApplications: { id: number, name: string, component: Component }[] = [
	{ id: 0, name: 'Demo 1', component: Demo },
	{ id: 1, name: 'Demo 2', component: Demo },
	{ id: 2, name: 'Sandbox', component: Sandbox },
]
const activeApplication = ref(0)
</script>

<template>
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
		<KeepAlive v-for="(application, index) in runningApplications" :key="application.id" :max="1">
			<component v-if="index === activeApplication" :is="application.component" />
		</KeepAlive>
	</div>
</template>

<style lang="scss">
// Layout-related, theme-agnostic styles should be defined here.
@layer base {

	// Resetting by `all: unset` breaks a lot.
	// Rather, reset only those offending with no taste.
	// Refer to user agent style sheet sources to determine the impact.
	// Chrome:
	// https://chromium.googlesource.com/chromium/src/third_party/+/master/blink/renderer/core/html/resources/html.css
	// Firefox:
	// https://searchfox.org/mozilla-central/source/layout/style/res/html.css
	// https://searchfox.org/mozilla-central/source/layout/style/res/forms.css
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
		// Reset properties that needs a reset every time they are used in user agent style sheets.
		appearance: none;
		background: none;
		color: inherit;
		cursor: inherit;
		font: inherit;
	}

	:root {
		user-select: none;
		cursor: default;
		text-decoration-skip-ink: none;
		// In a web app where all elements are generated in JavaScript, there is no point collapsing white space, which is mainly for HTML authors' convenience.
		white-space: pre-wrap;
	}

	// Very radical: `display: flow` should not even exist, except for articles.
	aside,
	button,
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
	input,
	label,
	li,
	main,
	menu,
	nav,
	ol,
	search,
	section,
	ul {
		display: flex;
	}

	ul,
	ol,
	menu {
		list-style: none;
	}

	table {
		table-layout: fixed;
  	border-spacing: 0;
	}

	caption,
	th {
		text-align: inherit;
	}

	input[type="text" i],
	textarea {
		cursor: auto;
		resize: none;
	}

	// Ban the use of PITA elements.
	input[type="search" i],
	meter,
	progress,
	select {
		background: repeating-linear-gradient(-45deg, red 0 .5em, lightcoral 0 1em), red;
		color: pink;
		accent-color: pink;

		&::before,
		&::after {
			content: "😾";
		}
	}

	html,
	body,
	[data-v-app] {
		width: 100%;
		height: 100%;
	}

	dialog[open],
	.vbox {
		display: flex;
		flex-direction: column;
	}

	.fill {
		flex: 1e6 0 0;
	}

	.scroll {
		overflow: auto;
	}
}
</style>
