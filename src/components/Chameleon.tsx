import { Dynamic, Show } from 'solid-js/web'
import type { Schema, Update } from '../schema'

export function Chameleon<T>(props: {
	type: Schema<T>,
	value: T,
	onUpdate: (update: Update<T>) => void,
}) {
	return <div class="chameleon vbox">
		<label>{props.type.title}</label>
		<div>
			<Dynamic component={props.type.view.component} value={props.value} onUpdate={props.onUpdate} />
		</div>
		<Show when={props.type.description}>
			<div>
				<Dynamic component={props.type.description} />
			</div>
		</Show>
	</div>
}
