import { Dynamic, Show } from 'solid-js/web'
import type { ViewProps } from '../schema'
import { $set } from '../delta'

export function Chameleon<T>(props: ViewProps<T>) {
	return <div class="chameleon vbox" classList={{
		selected: props.selection === true,
	}} onMouseDown={event => {
		if (event.target.closest('.chameleon') !== event.currentTarget) return
		if (event.button !== 0) return
		props.onUpdate({
			selection: $set(true),
			deselect: !event.ctrlKey && !event.metaKey,
		})
	}}>
		<div class="title">{props.type.title}</div>
		<Dynamic component={props.type.component} {...props} />
		<Show when={props.type.description}>
			<div class="description">
				<Dynamic component={props.type.description} />
			</div>
		</Show>
	</div>
}
