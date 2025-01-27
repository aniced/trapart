// Building blocks defined in this file enables interoperability between windows, and between the browser and other native applications, including other browsers.
// They are copy & paste and drag & drop.


import {
  ref,
  toRef,
  type MaybeRefOrGetter,
  watchPostEffect,
  onWatcherCleanup,
} from 'vue'
import { windowID } from './utilities'

/**
 * `Metadata` is the only data available when determining whether pasting or dropping is allowed.
 * `Metadata` can be distinguished because it is not lowercase.
 */
function serialize(x: any): string {
  return JSON.stringify(x)
}

function deserialize(x: string): any {
  return JSON.parse(x)
}

function b(data: any) {
  const span = document.createElement('span')
  span.dataset.data = serialize(data)
  return span.outerHTML
}

function a(html: string) {
  const data = new DOMParser().parseFromString(html, 'text/html').querySelector('span[data-data]')?.getAttribute('data-data')
  return data ? deserialize(data) : {}
}

/**
 * The newer Clipboard API is worse than the deprecated execCommand in every aspect.
 * The Clipboard API supports custom data types in Chrome only, as of Jan 2025.
 * The Clipboard API is asynchronous, even though the clipboard is not I/O bound.
 * The Clipboard API has inconsistent permission models between browsers, invariably stricter than execCommand.
 * The Clipboard API requires a secure context.
 * The Clipboard API does not reuse DataTransfer, which has been designed for drag and drop, a same operation in essence.
 * The Clipboard API is overengineered, with features like multiple clipboard items that no browser supports.
 * The venerable execCommand, due to its popularity and irreplaceability, is unlikely to be removed from the standard.
 * The only advantage of the Clipboard API is that it can paste in events other than `paste`, which is necessary on touch screens where the `paste` event is hard to trigger.
 */
function isEditable(x: HTMLElement): boolean {
  return x instanceof HTMLInputElement && ['text', 'search', 'tel', 'url', 'email', 'password', 'number'].includes(x.type)
    || x instanceof HTMLTextAreaElement
    || x.isContentEditable
}


/**
 * HTML5 drag and drop API encapsulated, with peculiar uses in mind.
 *
 * These are supported:
 * - nested draggables and drop targets
 * - D&D between multiple windows
 * - custom type checking
 *
 * These are NOT supported:
 * - direct access to DOM drag and drop events
 * - read multiple types of data on drop
 */
// The HTML5 drag and drop API is a horribly designed, untamable beast.
// https://html.spec.whatwg.org/multipage/dnd.html
// It is evil to expose user code to DOM dragxxx and drop events; it is impossible to get them right.
// The interface here is inspired by React DnD.
// Although usage of React DnD falls due to React being a moving target, it is still a good example of abstraction layer.
// These are composables instead of custom directives, for the extra options and return values, also as a result of translation from React.
export function useDraggable<T>(options: {
  /** The element from which a drag can start. */
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  /**
   * Generate a plain object of the data being dragged.
   * If the function returns undefined, a drag cannot start.
   * The item is serialized when a drag begins and deserialized when dropped.
   * This is the only information available to drop targets about the drag source.
   */
  onDragStart: () => {
    items: T | undefined,
    phantom?: HTMLElement | null,
  },
  getItems: () => T | undefined,
  getDragImage: () => HTMLElement | null | undefined,
  onDragEnd: (effect: 'none' | 'copy' | 'link' | 'move') => void,
}) {
  const el = toRef(options.target)
  const isDragging = ref(false)
  watchPostEffect(() => {
    if (!el.value) return
    el.value.draggable = true
    const controller = new AbortController
    el.value.addEventListener('dragstart', event => {
      // Stop if a descendant element is the drag source.
      if (event.defaultPrevented || event.target !== event.currentTarget) return
      // It is impossible for browsers to emit a DragEvent with null dataTransfer.
      // It is impossible for scripts to construct a DataTransfer object.
      // Synthesized drag events are thus useless, but TypeScript insists that we check for event.dataTransfer for its theoretical nullability.
      const items = options.getItems()
      if (!items) {
        event.preventDefault()
        return
      }
      for (const type in items) if (Object.hasOwn(items, type)) {
        event.dataTransfer!.items.add(JSON.stringify(items[type]), type)
      }
      // It is possible that a drag source is removed from the document while being dragged.
      // `drag` and `dragend` events are still dispatched for detached nodes.
      // They should not be rebound if the draggable element ref changes when a drag is in process.
      (event.target as HTMLElement).addEventListener('dragend', event => {
        // Stop if a descendant element is the drag source.
        // This should not happen in theory.
        if (event.target !== event.currentTarget) throw new Error('Why has this happened?')

      }, { once: true })
    }, { signal: controller.signal })
    // el.value is already updated in onWatcherCleanup callback.
    // Therefore, el.value.removeEventListener does not work.
    onWatcherCleanup(() => controller.abort())
  })
  return { isDragging }
}

export function useDropZone(options: {
  /** The element to which items can be dropped. */
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  /**
   * Determine whether something dragged over can be dropped, and if so, which type of data to read.
   */
  accept: (types: string[]) => string | undefined,
}) {
  const el = toRef(options.target)
  const isDragOver = ref(false)
  watchPostEffect(() => {
    if (!el.value) return
    const controller = new AbortController
    el.value.addEventListener('drop', event => {
      event.dataTransfer!.items
    }, { signal: controller.signal })
    onWatcherCleanup(() => controller.abort())
  })
  return { isDragOver }
}

enum DropEffectMask {
  none, copy, link, copyLink,
  move, copyMove, linkMove, uninitialized,
  // For custom draggables, `uninitialized` behaves the same as `all`.
  all = 7,
}

// Note that DragEvent inherits MouseEvent.
const mouseEventToPreferredDropEffect: (event: MouseEvent) => DropEffectMask =
  navigator.platform.startsWith('Mac') || navigator.platform === 'iPhone'
    ? ({ altKey, metaKey }) => // ⌥⇧⌘V = Paste and Match Style
      altKey && metaKey
        ? DropEffectMask.link
        : altKey
          ? DropEffectMask.copy
          : metaKey
            ? DropEffectMask.move
            : DropEffectMask.none
    : ({ ctrlKey, shiftKey, altKey }) => // Ctrl+Shift+Alt+Win+L = LinkedIn
      ctrlKey === shiftKey && ctrlKey !== altKey
        ? DropEffectMask.link
        : ctrlKey && !shiftKey && !altKey
          ? DropEffectMask.copy
          : !ctrlKey && shiftKey && !altKey
            ? DropEffectMask.move
            : DropEffectMask.none

const dragenter = (event: DragEvent) => {
  event.preventDefault()
}

const dragEventToDropEffect = (event: DragEvent): DropEffectMask => {
  // A new DataTransfer is created for every DragEvent, so caching is impossible.
  let sameWindow = false
  for (const item of event.dataTransfer!.items) {
    if (item.kind === 'string' && item.type === windowID) {
      sameWindow = true
      break
    }
  }
  // While a default dropEffect is determined by the browser, it lacks customizability.
  // There is no way to priortize move over copy, for example.
  // It is also extremely buggy on Chrome, so it is better to be explicit and careful.
  const allowed = DropEffectMask[event.dataTransfer!.effectAllowed]
  let preferred = mouseEventToPreferredDropEffect(event)
  if (!(allowed & preferred)) preferred = sameWindow ? DropEffectMask.move : DropEffectMask.copy
  if (!(allowed & preferred)) preferred = allowed
  preferred &= allowed
  preferred &= -preferred
  return preferred
}

const dragover = (event: DragEvent) => {
  // Stop if a descendant element has already claimed the drop.
  if (event.defaultPrevented && event.dataTransfer!.dropEffect !== 'none') return
  const effect = dragEventToDropEffect(event)
  if (effect) {
    event.preventDefault()
    event.dataTransfer!.dropEffect = DropEffectMask[effect] as 'copy' | 'link' | 'move'
  }
}

const drop = (event: DragEvent) => {
  // Stop if a descendant element has already claimed the drop.
  if (event.defaultPrevented) return
  // `drop` event on Chrome is buggy and always has a dropEffect of `none`.
  // But it is possible to recompute the dropEffect from the event.
  const effect = dragEventToDropEffect(event)
}

const metadataPrefix = 'application/x-trapart-metadata;data='

metadataPrefix + JSON.stringify({ '...': '...' })
  // All uppercase letters must occur in strings.
  // Exponential `e` and other singleton values (null, false, true) are specified to be lowercase in JSON.stringify output.
  .replace(/[A-Z]/g, c => '\\u00' + c.charCodeAt(0).toString(16))

const type = '...'
if (type.startsWith(metadataPrefix)) {
  JSON.parse(type.slice(metadataPrefix.length))
}
