import { SpinBox } from './components/basic-controls/SpinBox'
import { TextBox } from './components/basic-controls/TextBox'
import { $set } from './delta'
import type { ViewDescriptor } from './schema'

export const string: ViewDescriptor<string> = {
	component: TextBox,
	default: () => '',
	methods: {
		clear: () => ({ delta: $set('') }),
	},
}

export const integer: ViewDescriptor<number> = {
	component: SpinBox,
	default: () => 0,
	methods: {
		increment: x => ({ delta: $set(x + 1) }),
		decrement: x => ({ delta: $set(x - 1) }),
	},
}
