import { JSX, mergeProps, Show } from 'solid-js'
import { Update } from '../../schema'
import { useEnabled } from '../Enable'
import { $set } from '../../delta'

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
	function update(newValue: number, commit: boolean) {
		newValue = props.min <= props.max
			? Math.min(Math.max(newValue, props.min), props.max)
			: NaN
		if (Object.is(newValue, props.value)) return
		props.onUpdate({ delta: $set(newValue), commit })
	}
	function increment(steps: number) {
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
	function parse(commit: boolean): boolean {
		let newValue = parseFloat(input.value)
		if (Number.isNaN(newValue)) newValue = Number(input.value)
		if (input.value !== 'NaN' && Number.isNaN(newValue)) return false
		update(newValue, commit)
		return true
	}
	return <div class="spin-box" onMouseDown={event => {
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
			value={props.value}
			onFocus={event => event.target.select()}
			onChange={() => parse(true)}
			onInput={() => parse(false)}
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
