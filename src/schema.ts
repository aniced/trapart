import { type Component } from 'solid-js'
import { Delta } from './delta'

export type Selection<T> = true | undefined | { [K in keyof T]: Selection<T[K]> }

export interface ViewProps<T> {
	type: Schema<T>,
	value: T,
	selection: Selection<T>,
	/**
	 * Mutable state of the view that persists, but not part of the value.
	 * Examples include the viewport of a canvas and expanded nodes in a tree.
	 */
	state: any,
	onUpdate: (update: {
		value?: Delta<T>,
		/**
		 * Start ('new') or end ('commit') a transaction.
		 */
		transaction?: 'new' | 'commit',
		selection?: Delta<Selection<T>>,
		/** Replace (instead of adding to) the selection. */
		deselect?: boolean,
	}) => void,
}

export interface Command<T> {
	run: (props: ViewProps<T>) => void,
	title: string,
	shortcut?: {
		ctrlKey?: boolean,
		shiftKey?: boolean,
		altKey?: boolean,
		key: string,
		preventDefault?: boolean,
	},
}

export interface Schema<T> {
	title: string,
	description?: Component,
	default: T,
	component: Component<ViewProps<T>>,
	traverse: (props: ViewProps<T>) => ViewProps<any>[],
	commands: Command<T>[],
}
