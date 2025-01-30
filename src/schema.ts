import { type Component } from 'vue'

export interface ViewDescriptor<T> {
	component: Component<{ value: T }>,
	props: object,
	methods: { [name: string]: (oldValue: T) => T },
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
	view: ViewDescriptor<T>,
}
