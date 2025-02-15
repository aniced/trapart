import { createEffect, createSignal, JSX, Show } from 'solid-js'
import { useEnabled } from '../Enable'

export function makeSpinBox<T>(options: Readonly<{
	add: (value: T, by: number) => T,
	parse: (s: string) => T | undefined,
	stringify: (x: T) => string,
}>) {
	return (props: {
		value: T,
		onUpdate: (newValue: T, commit: boolean) => void,
		prefix?: JSX.Element,
		suffix?: JSX.Element,
	}) => {
		const enabled = useEnabled()
		let input!: HTMLInputElement
		const [valid, setValid] = createSignal(true)
		let dirty = false
		function update(newValue: T, commit: boolean) {
			if (!commit && Object.is(newValue, props.value)) return
			props.onUpdate(newValue, commit)
		}
		function increment(by: number) {
			dirty = false
			setValid(true)
			update(options.add(props.value, by), false)
			input.select()
		}
		let timer: ReturnType<typeof setTimeout> | undefined
		function repeat(by: number) {
			// Note that clearInterval and clearTimeout are synonymous.
			clearTimeout(timer)
			timer = undefined
			input.focus()
			if (by) {
				increment(by)
				timer = setTimeout(() => {
					increment(by)
					timer = setInterval(() => {
						increment(by)
					}, 60)
				}, 400)
				document.addEventListener('mouseup', () => {
					repeat(0)
				}, { once: true })
			}
		}
		createEffect(() => {
			const value = props.value
			// In case `change` event didn't fire, fix the state.
			if (document.activeElement !== input) dirty = false
			if (!dirty) {
				input.value = options.stringify(value)
				if (document.activeElement === input) {
					input.select()
				}
			}
		})
		return <div class="spin-box" classList={{
			invalid: !valid(),
		}} onMouseDown={event => {
			if (event.button !== 0) return
			if (!enabled()) return
			if (event.target !== input) {
				event.preventDefault()
				input.focus()
			}
		}}>
			<Show when={props.prefix}>
				<div class="prefix">
					{props.prefix}
				</div>
			</Show>
			<input ref={input} type="text" inputmode="decimal"
				onFocus={event => event.target.select()}
				onChange={event => {
					dirty = false
					const newValue = options.parse(event.target.value)
					if (newValue !== undefined) update(newValue, true)
					event.target.value = options.stringify(props.value)
					setValid(true)
				}}
				onInput={event => {
					dirty = true
					const newValue = options.parse(event.target.value)
					if (newValue !== undefined) update(newValue, false)
					setValid(newValue !== undefined)
				}}
				onKeyDown={event => {
					if (event.key === 'ArrowUp') {
						event.preventDefault()
						increment(1)
					} else if (event.key === 'ArrowDown') {
						event.preventDefault()
						increment(-1)
					}
				}} onWheel={event => {
					event.preventDefault()
					event.currentTarget.focus()
					increment(Math.sign(-event.deltaY))
				}}
			/>
			<Show when={props.suffix}>
				<div class="suffix">
					{props.suffix}
				</div>
			</Show>
			<div class="up" inert={!enabled()} onMouseDown={event => {
				if (event.button !== 0) return
				repeat(1)
			}} />
			<div class="down" inert={!enabled()} onMouseDown={event => {
				if (event.button !== 0) return
				repeat(-1)
			}} />
		</div>
	}
}

export const SpinBox = makeSpinBox<number>({
	add: (x, y) => x + y,
	parse(s) {
		let x = Number(s)
		if (Number.isNaN(x)) x = parseFloat(s)
		if (s !== 'NaN' && Number.isNaN(x)) return undefined
		// newValue = props.min <= props.max
		// 	? Math.min(Math.max(newValue, props.min), props.max)
		// 	: NaN
		return x
	},
	stringify: x => x.toString(),
})

export const IntegerSpinBox = makeSpinBox<number>({
	add(a, b) {
		const y = a + b
		return Math.min(Math.max(y, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER)
	},
	parse(s) {
		const x = Number(s)
		return Number.isSafeInteger(x) ? x : undefined
	},
	stringify: x => x.toString(),
})
