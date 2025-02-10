import { Dynamic, Show } from 'solid-js/web'
import type { ViewProps } from '../schema'

export function Chameleon<T>(props: ViewProps<T>) {
	return <div class="chameleon vbox">
		<div class="title">{props.type.title}</div>
		<Dynamic component={props.type.component} {...props} />
		<Show when={props.type.description}>
			<div class="description">
				<Dynamic component={props.type.description} />
			</div>
		</Show>
	</div>
}
