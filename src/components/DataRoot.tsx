import { createMutable } from 'solid-js/store'
import { createStore2 } from '../composables'
import { Schema } from '../schema'
import { Chameleon } from './Chameleon'
import { $set, apply, Delta } from '../delta'

export function DataRoot<T>(props: {
	type: Schema<T>,
}) {
	const [value, setValue] = createStore2({ value: structuredClone(props.type.default) })
	const [selection, setSelection] = createStore2({ value: undefined })
	const state = createMutable({})
	const commits: { undo: Delta<T>, redo: Delta<T> }[][] = []
	return <div class="vbox">
		<h1>DataRoot</h1>
		<Chameleon type={props.type} value={value.value} selection={selection.value} state={state} onUpdate={update => {
			if (update.value) {
				if (update.selection) {
					setSelection(selection => apply(selection, { value: update.selection }))
				}
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
					console.log(commits, undo, redo)
				})
			}
		}} />
	</div>
}