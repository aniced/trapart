import { JSX, Show } from 'solid-js'

export const Shortcut: (props: {
	ctrlKey?: boolean,
	shiftKey?: boolean,
	altKey?: boolean,
	metaKey?: boolean,
	key: string,
}) => JSX.Element = navigator.platform.startsWith('Mac') || navigator.platform === 'iPhone'
		? props => <kbd>
			<Show when={props.ctrlKey}><kbd>^</kbd></Show>
			<Show when={props.altKey}><kbd>⌥</kbd></Show>
			<Show when={props.shiftKey}><kbd>⇧</kbd></Show>
			<Show when={props.metaKey}><kbd>⌘</kbd></Show>
			{props.key}
		</kbd>
		: props => <kbd>
			<Show when={props.ctrlKey}><kbd>Ctrl</kbd>+</Show>
			<Show when={props.shiftKey}><kbd>Shift</kbd>+</Show>
			<Show when={props.altKey}><kbd>Alt</kbd>+</Show>
			<Show when={props.metaKey}><kbd>❖</kbd>+</Show>
			{props.key}
		</kbd>
