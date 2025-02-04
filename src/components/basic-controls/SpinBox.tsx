import { createEffect, createSignal, JSX, mergeProps, Show } from 'solid-js'
import { Update } from '../../schema'
import { useEnabled } from '../Enable'
import { $set } from '../../delta'

function parse(s: string): number | undefined {
	let x = Number(s)
	if (Number.isNaN(x)) x = parseFloat(s)
	if (s !== 'NaN' && Number.isNaN(x)) return undefined
	return x
}

export function SpinBox(propsIn: {
	value: number,
	onUpdate: (update: Update<number>) => void,
	min?: number,
	max?: number,
	step?: number,
	prefix?: JSX.Element,
	suffix?: JSX.Element,
}) {
	const props = mergeProps({
		min: -Infinity,
		max: Infinity,
		step: 1,
	}, propsIn)
	const enabled = useEnabled()
	let input!: HTMLInputElement
	const [valid, setValid] = createSignal(true)
	let changed = false
	function update(newValue: number, commit: boolean) {
		newValue = props.min <= props.max
			? Math.min(Math.max(newValue, props.min), props.max)
			: NaN
		if (Object.is(newValue, props.value)) return
		props.onUpdate({ delta: $set(newValue), commit })
	}
	function increment(steps: number) {
		changed = false
		update(props.value + steps * props.step, false)
		input.select()
	}
	let timer: ReturnType<typeof setTimeout> | undefined
	function repeat(steps: number) {
		// Note that clearInterval and clearTimeout are synonymous.
		clearTimeout(timer)
		timer = undefined
		input.focus()
		if (steps) {
			increment(steps)
			timer = setTimeout(() => {
				increment(steps)
				timer = setInterval(() => {
					increment(steps)
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
		if (document.activeElement !== input) changed = false
		if (!changed) {
			input.value = value.toString()
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
				changed = false
				const newValue = parse(event.target.value)
				if (newValue !== undefined) update(newValue, true)
				event.target.value = props.value.toString()
				setValid(true)
			}}
			onInput={event => {
				changed = true
				const newValue = parse(event.target.value)
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
