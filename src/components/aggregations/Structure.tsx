import { For } from 'solid-js'
import type { Schema, Update } from '../../schema'
import { Chameleon } from '../Chameleon'
import { Delta } from '../../delta'

export function Structure<T>(props: {
	value: T,
	fields: Record<string, Schema<T>>,
	onUpdate: (update: Update<T>) => void,
}) {
	return <div class="vbox">
		<For each={Object.keys(props.fields)}>{key => <Chameleon
			type={props.fields[key]}
			value={(props.value as any)[key]}
			onUpdate={update => props.onUpdate({
				...update,
				delta: { [key]: update.delta } as Delta<T>,
			})}
		/>}</For>
	</div>
}
