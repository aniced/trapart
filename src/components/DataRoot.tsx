import { createMutable } from 'solid-js/store'
import { createStore2 } from '../composables'
import { Schema } from '../schema'
import { Chameleon } from './Chameleon'
import { $set, apply } from '../delta'

export function DataRoot<T>(props: {
	type: Schema<T>,
}) {
	const [value, setValue] = createStore2({ value: structuredClone(props.type.default) })
	const [selection, setSelection] = createStore2({ value: undefined })
	const state = createMutable({})
	const commits = []
	return <div class="vbox">
		<h1>DataRoot</h1>
		<Chameleon type={props.type} value={value.value} selection={selection.value} state={state} onUpdate={update => {
			let changed = false
			if (update.value) {
				setValue(value => {
					if (update.value instanceof $set && update.value === undefined) {
						value.value = structuredClone(props.type.default)
						changed = true
					} else {
						changed = apply(value, { value: update.value })
					}
				})
			}
			if (update.selection) {
				setSelection(selection => apply(selection, { value: update.selection }))
			}
			if (update.commit ?? changed) {
				commits.push(update.value)
				console.log(commits)
			}
		}} />
	</div>
}