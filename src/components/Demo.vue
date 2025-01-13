<script setup lang="ts">
import { ref } from 'vue'
import SpinBox from './basic-controls/SpinBox.vue'
import ProgressBar from './basic-controls/ProgressBar.vue'
import TabView from './basic-controls/TabView.vue'
import ToolTip from './basic-controls/ToolTip.vue'
import TextBox from './basic-controls/TextBox.vue'
import ListView, { type ListViewDescriptor } from './basic-controls/ListView.vue'
import Enable from './Enable.vue'

const disabled = ref(false)
const number = ref(114514)
const currentIndex = ref(0)
const string = ref('Hello, world!')
const array = ref<{ text: string, children?: { text: string }[] }[]>(new Array(114).fill(0xc0).map((x, i) => ({
	text: 'Item ' + String.fromCodePoint(x + i),
	children: [{ text: `Child A of ${i}` }, { text: `Child B of ${i}` }],
})))
const view: ListViewDescriptor<(typeof array)['value'][number]> = {
	getKey: (item) => item.text,
	getChildren: (item) => item.children ?? [],
	getPlainText: (item) => item.text,
	columns: {
		str: {
			render: ({ item }) => item.text,
			name: 'Original case',
			compareKey: (item) => item.text,
		},
		upperStr: {
			render: ({ item }) => item.text.toUpperCase(),
			name: 'Upper case',
			compareKey: (item) => item.text,
		},
	},
}
</script>

<template>
	<div class="fill vbox">
		<label>
			<input type="checkbox" v-model="disabled">
			Disable everything
		</label>
		<Enable :if="!disabled">
			<fieldset>
				<legend>Actions</legend>
				<button class="ellipsis">0001 Select</button>
				<button>Cancel</button>
			</fieldset>
			<fieldset>
				<legend>Primitives</legend>{{ string }}
				<TextBox v-model="string" />
				<TextBox v-model="string" />
				<label>
					<input type="radio" v-model="string" value="data">
					The first
				</label>
				<label>
					<input type="radio" v-model="string" value="changed">
					The second
				</label>
				<label>
					<input type="checkbox" v-model="disabled">
					Start disabled inside
				</label>
				<SpinBox prefix="$[" v-model="number" suffix="]%" :minimum-value="-9" :maximum-value="500" />
				<label>
					Labeled text field
					<TextBox single-line v-model="string" />
				</label>
				<ProgressBar :value="42 / 100" />
			</fieldset>
			<fieldset class="vbox">
				<legend>Lists</legend>
				<ListView style="width: 320px; height: 240px;" :items="array" :view v-model="currentIndex">
				</ListView>
				<ListView style="width: 120px; height: 240px;" :items="array" :view v-model="currentIndex">
				</ListView>
				<ListView style="width: 320px; height: 240px;" :items="array" :view v-model="currentIndex">
				</ListView>
				<TabView :pages="['Pa', 'Pb', 'Pc']" v-model="currentIndex" tab-position="left">
					<div style="height: 514px;">
						114514
					</div>
				</TabView>
			</fieldset>
			<fieldset>
				<legend>Complex components</legend>
				<button>&lt;dialog&gt;</button>
				<dialog>
					<form method="dialog">
						What is this?
						<button>Close?</button>
					</form>
				</dialog>
			</fieldset>
			<fieldset>
				<legend>Static components</legend>
				<ToolTip>
					<div class="deluxe-label">标题</div>
					<template #hint>
						<h1>哼哼</h1>
						这是关于标题的说明。
						<hr>
						这在分割线以下。
					</template>
				</ToolTip>
				<div style="width:164px;height:100px;overflow:scroll;border:1px solid green">
					Ea aliqua amet nostrud occaecat tempor est.
					Dolor excepteur commodo do sunt do non nulla nisi nisi fugiat.
					Aute ipsum velit nostrud fugiat esse ipsum ut elit.
					Ex reprehenderit ea amet incididunt dolore occaecat est cupidatat.
					Consequat eu cupidatat et esse proident incididunt qui cillum ex fugiat in consectetur commodo.
					Sint et ipsum anim esse veniam mollit tempor tempor nostrud quis quis nulla occaecat.
				</div>
			</fieldset>
		</Enable>
	</div>
</template>
