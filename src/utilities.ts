export class DefaultMap<K, V> extends Map<K, V> {
	constructor(public factory: () => V) {
		super()
	}
	get(key: K): V {
		if (this.has(key)) {
			return super.get(key)!
		} else {
			const value = this.factory()
			this.set(key, value)
			return value
		}
	}
}

export class DefaultWeakMap<K extends WeakKey, V> extends WeakMap<K, V> {
	constructor(public factory: () => V) {
		super()
	}
	get(key: K): V {
		if (this.has(key)) {
			return super.get(key)!
		} else {
			const value = this.factory()
			this.set(key, value)
			return value
		}
	}
}

const symbolForUndefined = Symbol('undefined symbolized')
const symbolForNull = Symbol('null symbolized')
const symbolForFalse = Symbol('false symbolized')
const symbolForTrue = Symbol('true symbolized')
const symbolRegistry = new DefaultWeakMap<object, symbol>(Symbol)
type Symbolize<T> = T extends string | number | symbol
	? T
	: T extends bigint
	? string
	: symbol
/**
 * Turn objects into symbols, so that they can be used as keys for ordinary JavaScript objects.
 *
 * Note that symbols are garbage-collectable.
 * As long as a symbol is used as a property key, it is referenced, and can't be garbage-collected, even if the original object that generated it doesn't exist anymore.
 */
export function symbolize<T>(x: T): Symbolize<T> {
	switch (typeof x) {
		case 'string':
		case 'number':
		case 'symbol':
			// @ts-ignore
			return x
		case 'object':
		case 'function':
			// @ts-ignore
			return x ? symbolRegistry.get(x) : symbolForNull
		case 'bigint':
			// @ts-ignore
			return x.toString()
		case 'boolean':
			// @ts-ignore
			return x ? symbolForTrue : symbolForFalse
		case 'undefined':
			// @ts-ignore
			return symbolForUndefined
		default:
			throw new Error('JavaScript has evolved')
	}
}
