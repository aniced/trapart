import { type Component } from 'solid-js'
import { Delta } from './delta'

export interface Update<T> {
	delta: Delta<T>,
	/**
	 * false: Do not commit.
	 * true: Commit even if there is no change.
	 * undefined: Commit if there is a change.
	 */
	commit?: boolean | undefined,
}

export interface ViewDescriptor<T> {
	component: Component<{
		value: T,
		onUpdate: (update: Update<T>) => void,
	}>,
	methods: { [name: string]: (oldValue: T) => Update<T> },
	default: () => T,
}

export interface Command {
	name: string,
	title: string,
	shortcut?: {
		ctrlKey?: boolean,
		shiftKey?: boolean,
		altKey?: boolean,
		key: string,
	},
}

export interface Schema<T> {
	title: string,
	description?: Component,
	/** The default value. If not provided, view's default will be used. */
	default?: () => T,
	view: ViewDescriptor<T>,
}
