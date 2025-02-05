import { makeSpinBox, SpinBox } from './components/basic-controls/SpinBox'
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

export const float: ViewDescriptor<number> = {
	component: SpinBox,
	default: () => 0,
	methods: {
		increment: x => ({ delta: $set(x + 1) }),
		decrement: x => ({ delta: $set(x - 1) }),
	},
}

export const integer: ViewDescriptor<number> = {
	...float,
	component: makeSpinBox({
		add(a, b) {
			const y = a + b
			return Math.min(Math.max(y, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER)
		},
		parse(s) {
			const x = Number(s)
			return Number.isSafeInteger(x) ? x : undefined
		},
		stringify: x => x.toString(),
	}),
}
