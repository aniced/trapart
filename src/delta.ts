// @ts-nocheck
// Inspired by @use-gpu/state.
// https://gitlab.com/unconed/use.gpu/-/blob/v0.12.0-rc.1/packages/state/src/patch.ts

/** Mutation-as-value */
export type Delta<T> =
	| undefined
	| $set<T>
	| (T extends (infer E)[]
		? { [key: number]: Delta<E> }
		: { [K in keyof T]?: Delta<T[K]> })

declare class $set<T> {
	readonly value: T
}
export function $set<T>(value: T): $set<T> {
	const y = Object.create($set.prototype)
	y.value = value
	return y
}
/** Shorthand to $set(undefined). */
export const $delete = $set(undefined)

/**
 * a + b
 * 
 * Operands are not mutated. If no changes are made, a is returned.
 */
export function patch<T>(a: T, b: Delta<T>): T {
	if (b === undefined) return a
	if (b instanceof $set) return b.value
	let y = a
	for (const key in b) if (Object.hasOwn(b, key)) {
		const value = patch(y[key], b[key])
		if (Object.is(value, y[key])) continue
		if (y === a) y = Array.isArray(a) ? a.slice() : { ...a }
		if (value === undefined) {
			delete y[key]
		} else {
			y[key] = value
		}
	}
	return y
}

/** y such that a + b + y = a */
export function revert<T>(a: T, b: Delta<T>): Delta<T> {
	if (b === undefined) return undefined
	if (b instanceof $set) return $set(a)
	const y = {}
	for (const key in b) if (Object.hasOwn(b, key)) {
		y[key] = revert(a[key], b[key])
	}
	return y
}

/** y such that a + y = b */
export function diff<T>(a: T, b: T): Delta<T> {
	if (a === b) return undefined
	if (!a || typeof a !== 'object' || !b || typeof b !== 'object') return $set(b)
	const y = {}
	let different = false
	for (const key in a) if (Object.hasOwn(a, key) && !Object.hasOwn(b, key)) {
		y[key] = $delete
		different = true
	}
	for (const key in b) if (Object.hasOwn(b, key)) {
		const delta = diff(a[key], b[key])
		if (delta) {
			y[key] = delta
			different = true
		}
	}
	if (different) return y
}
