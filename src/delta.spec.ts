import { describe, it, expect } from 'vitest'
import { $set, $delete, patch, revert, diff } from './delta'

describe('patch', () => {
	it('ignores undefined fields', () => {
		const state = {
			s: 'hello',
			n: 1,
			x: 'x',
			foo: {
				a: false,
				b: true,
				c: ['x'],
			},
		}
		expect(patch(state, {
			s: undefined,
			n: undefined,
			foo: {
				a: undefined,
				c: undefined,
			},
		})).toStrictEqual(state)
	})

	it('handles nested $set', () => {
		expect(patch({
			s: 'hello',
			n: 1,
			x: 'x',
			foo: {
				a: false,
				b: true,
				c: ['x'],
			},
		}, {
			s: $set('world'),
			n: $set(2),
			foo: {
				a: $set(true),
				c: $set(['y']),
			},
		})).toStrictEqual({
			s: 'world',
			n: 2,
			x: 'x',
			foo: {
				a: true,
				b: true,
				c: ['y'],
			},
		})
	})

	it('handles $delete', () => {
		expect(patch({
			s: 'hello',
			n: 1,
			x: 'x',
			foo: {
				a: false,
				b: true,
				c: ['x'],
			},
		} as unknown, {
			s: $delete,
			n: $set(2),
			foo: $delete,
		})).toStrictEqual({
			n: 2,
			x: 'x',
		})
	})

	it('handles top-level $delete', () => {
		expect(patch({
			s: 'hello',
			n: 1,
			x: 'x',
			foo: {
				a: false,
				b: true,
				c: ['x'],
			} as any,
		}, $delete)).toStrictEqual(undefined)
	})

	it('diffs values', () => {
		expect(diff({
			s: 'hello',
			n: [1],
			x: 'x',
			foo: {
				a: false,
				b: true,
				c: ['x'],
			},
		}, {
			s: 'hello world',
			n: [2],
			x: 'xy',
			foo: {
				d: true,
			},
		})).toStrictEqual({
			s: $set('hello world'),
			n: { 0: $set(2) },
			x: $set('xy'),
			foo: {
				a: $delete,
				b: $delete,
				c: $delete,
				d: $set(true),
			},
		})
	})

	it('gives optimal diff', () => {
		expect(diff({
			x: {y: {z: 'z', w: 'w'}},
			foo: {bar: {baz: -1}},
		}, {
			x: {y: {z: 'z', w: 'w'}},
			foo: {bar: {baz: -1}},
		})).toStrictEqual(undefined)
	})

	it('reverts diff', () => {
		expect(revert({
			x: {y: {z: 'z', w: 'w'}},
			foo: {bar: {x: 1, y: -1}},
		}, {
			x: {y: {w: $set('www')}},
			foo: {bar: $set({x: -2, y: 2})},
		})).toStrictEqual({
			x: {y: {w: $set('w')}},
			foo: {bar: $set({x: 1, y: -1})},
		})
	})

	it('diff is revertable', () => {
		const x0 = {
			s: 'hello',
			n: [1],
			x: 'x',
			foo: {
				a: false,
				b: true,
				c: ['x'],
			},
		}
		const x1 = {
			s: 'hello world',
			n: [2],
			x: 'xy',
			foo: {
				d: true,
			},
		}
		// @ts-ignore
		const dx = diff(x0, x1)
		expect(patch(x0, dx)).toStrictEqual(x1)
		// @ts-ignore
		expect(patch(x1, revert(x0, dx))).toStrictEqual(x0)
	});
})
