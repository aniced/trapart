import {
  ref,
  shallowRef,
  shallowReactive,
  computed,
  watch,
  watchEffect,
  onMounted,
  onUnmounted,
  toRef,
  toValue,
  isProxy,
  type Ref,
  type ShallowRef,
  type MaybeRef,
} from 'vue'

/**
 * Create a ref for a property on a shallow object ref.
 * It works similarly to the 2-argument form of Vue's built-in `toRef`, but for refs instead of reactives.
 * The function treats objects shallowly referenced as immutable, and creates a new object for the source ref every time the created ref is written to.
 */
export function useLens<T extends object, K extends keyof T>(object: Ref<T>, key: K): Ref<T[K]> {
  return !isProxy(object.value)
    ? toRef(object.value, key)
    : computed({
      get: () => object.value[key],
      set: x => object.value = { ...object.value, [key]: x },
    })
}

export function useLocalStorage<T>(key: string, initialValue: T): ShallowRef<T> {
  try {
    initialValue = JSON.parse(localStorage.getItem(key)!)
  } catch {
  }
  const state = shallowRef<T>(initialValue)
  watch(state, newValue => localStorage.setItem(key, JSON.stringify(newValue)))
  const listener = (event: StorageEvent) => {
    if (event.storageArea === localStorage && event.key === key && event.newValue) {
      state.value = JSON.parse(event.newValue)
    }
  }
  onMounted(() => addEventListener('storage', listener))
  onUnmounted(() => removeEventListener('storage', listener))
  return state
}

export function useHistoryState<T>(initialValue: T) {
  const history = shallowReactive([initialValue])
  const head = ref(0)
  return {
    state: computed({
      get: () => history[head.value],
      // https://github.com/zaboople/klonk/blob/master/TheGURQ.md
      set: x => history.push(...history.slice(head.value, -1).reverse(), x),
    }),
    canUndo: computed(() => head.value > 0),
    undo: () => { head.value = Math.max(0, head.value - 1) },
    canRedo: computed(() => head.value < history.length - 1),
    redo: () => { head.value = Math.min(head.value + 1, history.length - 1) },
  }
}

/**
 * Add global constructed style sheets.
 */
export function useStyleSheets(styleSheets: MaybeRef<string[]>) {
  watchEffect(() => {
    document.adoptedStyleSheets = toValue(styleSheets).map(source => {
      const sheet = new CSSStyleSheet
      sheet.replaceSync(source)
      return sheet
    })
  })
}
