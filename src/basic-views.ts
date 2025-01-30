import SpinBox from './components/basic-controls/SpinBox.vue'
import TextBox from './components/basic-controls/TextBox.vue'
import type { ViewDescriptor } from './schema'

export const string: ViewDescriptor<string> = {
	component: TextBox,
	props: {},
	methods: {
		clear: () => '',
	},
}

export const integer = (min = -Infinity, max = Infinity): ViewDescriptor<number> => ({
	component: SpinBox,
	props: { min, max },
	methods: {
		increment: x => x + 1,
		decrement: x => x - 1,
	},
})

