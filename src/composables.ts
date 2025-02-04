import { createStore, type Store, produce } from 'solid-js/store'

/**
 * Create a reactive object that can be read and written through a proxy.
 *
 * While standard createStore encourages an ad-hoc path syntax, this one forces you to use the proxy-based setter.
 */
export function createStore2<T extends object>(store: T | Store<T>):
  [get: Store<T>, set: (fn: (state: T) => void) => void] {
  const [get, set] = createStore(store)
  return [get, fn => set(produce(fn))]
}
