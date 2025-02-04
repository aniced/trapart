import { type Ref } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { UpdateHandler } from '../../schema'
import { $set } from '../../delta'

const composing = Symbol('composing')

export function TextBox(props: {
	value: string,
	onUpdate?: UpdateHandler<string>,
	multiline?: boolean,
	ref?: Ref<HTMLInputElement> | Ref<HTMLTextAreaElement>,
}) {
	return <Dynamic
		component={props.multiline ? 'textarea' : 'input'}
		ref={props.ref as any}
		type="text"
		value={props.value}
		onCompositionStart={(event: CompositionEvent) => {
			const target = event.target as any
			target[composing] = true
		}}
		onCompositionEnd={(event: CompositionEvent) => {
			const target = event.target as any
			if (target[composing]) {
				target[composing] = false
				target.dispatchEvent(new Event('input'))
			}
		}}
		onInput={(event: InputEvent) => {
			const target = event.target as any
			if (target[composing]) return
			props.onUpdate?.($set(target.value), false)
		}}
		onChange={(event: Event) => {
			const target = event.target as any
			target[composing] = false
			props.onUpdate?.($set(target.value), true)
		}}
		onFocus={(event: FocusEvent) => {
			const target = event.target as any
			target.select()
		}}
	/>
}
