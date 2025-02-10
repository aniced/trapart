import { For } from 'solid-js'
import { IntegerSpinBox, makeSpinBox, SpinBox } from './components/basic-controls/SpinBox'
import { TextBox } from './components/basic-controls/TextBox'
import { $set, Delta } from './delta'
import type { Selection, Schema, ViewProps } from './schema'
import { Chameleon } from './components/Chameleon'

export const string: Schema<string> = {
	title: '',
	default: '',
	component: props => <TextBox
		value={props.value}
		onUpdate={(newValue, commit) => props.onUpdate({
			value: $set(newValue),
			commit: commit ? undefined : false,
		})}
	/>,
	traverse: () => [],
	commands: [
		{
			title: 'Clear',
			run({ onUpdate }) { onUpdate({ value: $set('') }) },
		}
	],
}

export const float: Schema<number> = {
	title: '',
	default: 0,
	component: props => <SpinBox
		value={props.value}
		onUpdate={(newValue, commit) => props.onUpdate({ value: $set(newValue), commit })}
	/>,
	traverse: () => [],
	commands: [
		{
			title: 'Add 1',
			run({ value, onUpdate }) { onUpdate({ value: $set(value + 1) }) },
		},
		{
			title: 'Subtract 1',
			run({ value, onUpdate }) { onUpdate({ value: $set(value - 1) }) },
		},
	],
}

export const integer: Schema<number> = {
	...float,
	component: props => <IntegerSpinBox
		value={props.value}
		onUpdate={(newValue, commit) => props.onUpdate({ value: $set(newValue), commit })}
	/>,
}

export function makeStructure<T>(fields: { [K in keyof T]: Schema<T[K]> }): Schema<T> {
	const keys = Object.keys(fields) as (keyof T)[]
	return {
		title: '',
		default: Object.fromEntries(keys.map(key => [key, fields[key].default])) as T,
		component: props => <div class="vbox">
			<For each={props.type.traverse(props)}>{props => <Chameleon {...props} />}</For>
		</div>,
		traverse: props => keys.map(key => ({
			type: fields[key],
			value: props.value[key],
			selection: typeof props.selection === 'object' ? props.selection[key] : props.selection,
			state: props.state[key] ??= {},
			onUpdate: update => props.onUpdate({
				...update,
				value: {
					[key]: update.value instanceof $set && update.value.value === undefined
						? $set(structuredClone(props.type.default))
						: update.value
				} as Delta<T>,
				selection: (update.deselect && update.selection instanceof $set
					? $set({ [key]: update.selection.value })
					: { [key]: update.selection }) as Delta<Selection<T>>,
			}),
		})),
		commands: [],
	}
}
