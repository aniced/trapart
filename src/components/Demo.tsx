import { createSignal } from 'solid-js'
import { createStore2 } from '../composables'
import { SpinBox } from './basic-controls/SpinBox'
import { ProgressBar } from './basic-controls/ProgressBar'
// import {TabView} from './basic-controls/TabView'
// import {ToolTip} from './basic-controls/ToolTip'
import { TextBox } from './basic-controls/TextBox'
import { ListView, type ListViewDescriptor } from './basic-controls/ListView'
import { Enable } from './Enable'
import { patch } from '../delta'
import { Chameleon } from './Chameleon'
import { integer } from '../basic-views'

function ControlDemo() {
	const [disabled, setDisabled] = createSignal(false)
	const [number, setNumber] = createSignal(114514)
	const [currentIndex, setCurrentIndex] = createSignal(0)
	const [string, setString] = createSignal('Hello, world!')
	const [array, setArray] = createStore2<{ text: string, children?: { text: string }[] }[]>(new Array(114).fill(0xc0).map((x, i) => ({
		text: `Item ${Math.floor(Math.random() * 100)} ${String.fromCodePoint(x + i)}`,
		children: [{ text: `Child A of ${i}` }, { text: `Child B of ${i}` }],
	})))
	const view: ListViewDescriptor<(typeof array)[number]> = {
		getKey: (item) => item.text,
		getChildren: (item) => item.children ?? [],
		getPlainText: (item) => item.text,
		columns: {
			str: {
				render: ({ item }) => item.text,
				name: 'Original case',
				compareKey: (item) => item.text,
				initialWidth: 100,
			},
			upperStr: {
				render: ({ item }) => item.text.toUpperCase(),
				name: 'Upper case',
				compareKey: (item) => item.text,
				initialWidth: 100,
			},
			length: {
				render: ({ item }) => item.text.length.toString(),
				name: 'Length',
				compareKey: (item) => item.text.length,
				initialWidth: 50,
			},
		},
	}


	return <div class="fill vbox">
		<label>
			<input type="checkbox" checked={disabled()} onChange={event => setDisabled(event.target.checked)} />
			Disable everything
		</label>
		<Enable if={!disabled()}>
			<fieldset>
				<legend>Actions</legend>
				<button class="ellipsis">0001 Select</button>
				<button>Cancel</button>
			</fieldset>
			<fieldset class="vbox">
				<legend>Primitives</legend>{string()}
				<TextBox value={string()} onUpdate={setString} />
				<TextBox value={string()} onUpdate={setString} multiline />
				<label>
					<input type="radio" checked={string() === 'data'} />
					The first
				</label>
				<label>
					<input type="radio" checked={string() === 'changed'} />
					The second
				</label>
				<label>
					<input type="checkbox" checked={disabled()} onChange={event => setDisabled(event.target.checked)} />
					Start disabled inside
				</label>
				<SpinBox prefix={<><b>$</b>[</>} value={number()} onUpdate={u => setNumber(x => patch(x, u.delta))} suffix="]%" />
				<label>
					Labeled text field
					<TextBox value={string()} onUpdate={setString} />
				</label>
				<ProgressBar value={42 / 100} />
			</fieldset>
			<fieldset class="vbox">
				<legend>Lists</legend>
				<div style="display: grid; grid: repeat(3, 240px) / 320px;">
					<ListView items={array} view={view} />
					<ListView items={array} view={view} />
					<ListView items={array} view={view} />
				</div>
				{/* <TabView pages="['Pa', 'Pb', 'Pc']" v-model="currentIndex" tab-position="left">
					<div style="height: 514px;">
						114514
					</div>
				</TabView> */}
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
				{/* <ToolTip>
					<div class="deluxe-label">标题</div>
					<template #hint>
						<h1>哼哼</h1>
						这是关于标题的说明。
						<hr>
						这在分割线以下。
					</template>
				</ToolTip> */}
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
}

function ChameleonDemo() {
	const [x, setX] = createSignal(114514)
	setInterval(() => {
		setX(x => x + 1)
	}, 500)
	return <div class="vbox">
		<h1>{x()}</h1>
		<Chameleon type={{
			title: 'Number',
			view: integer,
			description: () => 'A spin box control.',
		}} value={x()} onUpdate={u => setX(x => patch(x, u.delta))} />
	</div>
}

export const Demo = ChameleonDemo
