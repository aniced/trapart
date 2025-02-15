import { createMutable } from 'solid-js/store'
import { createStore2 } from '../composables'
import { Command, Schema, ViewProps } from '../schema'
import { Chameleon } from './Chameleon'
import { $set, apply, Delta } from '../delta'
import { ListView, ListViewDescriptor } from './basic-controls/ListView'
import { symbolize } from '../utilities'
import { createMemo, Show } from 'solid-js'
import { Shortcut } from './basic-controls/Shortcut'

interface CollectedCommand {
	command: Command<any>,
	type: Schema<any>,
}

const collectedCommandsView: ListViewDescriptor<CollectedCommand> = {
	getKey: symbolize,
	getPlainText: item => item.command.title,
	columns: {
		title: {
			title: 'Command',
			initialWidth: 114,
			render: props => props.item.command.title,
			compareKey: item => item.command.title,
		},
		type: {
			title: 'Applies to',
			initialWidth: 51.4,
			render: props => props.item.type.title,
			compareKey: item => item.type.title,
		},
		shortcut: {
			title: 'Shortcut key',
			initialWidth: 51.4,
			render: props => <Show when={props.item.command.shortcut}>
				<Shortcut {...props.item.command.shortcut!} />
			</Show>,
		},
	},
}

export function DataRoot<T>(props: {
	type: Schema<T>,
}) {
	const [value, setValue] = createStore2({ value: structuredClone(props.type.default) })
	const [selection, setSelection] = createStore2({ value: undefined })
	const state = createMutable({})
	const commits: { undo: Delta<T>, redo: Delta<T> }[][] = []
	const viewProps = createMemo<ViewProps<T>>(() => ({
		type: props.type,
		value: value.value,
		selection: selection.value,
		state,
		onUpdate(update) {
			if (update.selection) {
					console.log('Select:',JSON.stringify(selection.value), update.selection)
					setSelection(selection => apply(selection, { value: update.selection }))
			}
			if (update.value) {
				setValue(value => {
					if (update.value instanceof $set && update.value === undefined) {
						update.value = $set(structuredClone(props.type.default))
					}
					const [undo, redo] = apply<typeof value>(value, { value: update.value })
					if (update.transaction === 'new' || Object.isFrozen(commits.at(-1))) {
						commits.push([])
					}
					if (undo && redo) {
						commits[commits.length - 1].push({ undo: undo.value, redo: redo.value })
					}
					if (update.transaction === 'commit') {
						Object.freeze(commits.at(-1))
					}
					console.log(JSON.stringify(value.value), commits, undo, redo)
				})
			}
		},
	}))
	const collectedCommands = createMemo<CollectedCommand[]>(() => {
		const visitedCommands = new Set<Command<any>>
		const y: CollectedCommand[] = []
			; (function traverse(props) {
				if (props.selection === true) {
					for (const command of props.type.commands) {
						if (visitedCommands.has(command)) continue
						visitedCommands.add(command)
						y.push({ type: props.type, command })
					}
				}
				for (const childProps of props.type.traverse(props)) {
					if (childProps.selection) traverse(childProps)
				}
			})(viewProps())
		return y
	})
	return <div class="vbox">
		<h1>DataRoot</h1>
		<Chameleon {...viewProps()} />
		<dialog class="" style="display:grid;grid:514px/314px;" open>
			<ListView items={collectedCommands()} view={collectedCommandsView} />
		</dialog>
	</div>
}