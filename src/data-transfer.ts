// Building blocks defined in this file enables interoperability between windows, and between the browser and other native applications, including other browsers.
// They are copy & paste and drag & drop.

import { type ObjectDirective } from 'vue'
import { windowID } from './utilities'

/**
 * Shared between copy & paste and drag & drop.
 */
type Items = {
	/**
	 * `Metadata` is the only data available when determining whether pasting or dropping is allowed.
	 * `Metadata` can be distinguished because it is not lowercase.
	 */
	Metadata?: any
	/**
	 * Additional data formats for use in other applications, with lowercase MIME types as keys.
	 * Browsers mangle uncommon formats.
	 * Often, the only one that survives is 'text/plain'.
	 */
	[key: string]: string | undefined
}

function b(data: any) {
	const span = document.createElement('span')
	span.dataset.data = JSON.stringify(data)
	return span.outerHTML
}

document.addEventListener('copy', event => {
	event.preventDefault()
	const items: Items = {'...':'...'}
	for (const type in items) {
		if (type === 'Metadata') {
			type
		}
	}
	event.clipboardData!.items.add('', 'text/html')
})

function clipboardHTMLToItems(html: string): Items {
	const data = new DOMParser().parseFromString(html, 'text/html').querySelector('span[data-data]')?.getAttribute('data-data')
	if (!data) return {}
	const items = JSON.parse(data)
	for (const type in items) {
		if (type !== 'Metadata' && typeof items[type] !== 'string') {
			delete items[type]
		}
	}
	return items
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


//============================================================================
// HTML5 drag and drop API encapsulated, opinionatedly
//============================================================================

// The HTML5 drag and drop API is a horribly designed, untamable beast.
// https://html.spec.whatwg.org/multipage/dnd.html
// It is evil to expose user code to DOM dragxxx and drop events; it is impossible to get them right.

// Although usage of React DnD falls due to React being a moving target, it is still a good example of abstraction layer.
// Vue libraries are often designed following the React way, but in this case where what a hook does is to set up event listeners on an element, Vue provides a more ergonomic way: custom directives.

//----------------------------------------------------------------------------
// Draggable

export enum DropEffectMask {
	none, copy, link, copyLink,
	move, copyMove, linkMove, uninitialized,
	// For custom draggables, `uninitialized` behaves the same as `all`.
	all = 7,
}

const metadataTypePrefix = 'application/x-trapart-metadata;data='

/**
 * Generate a plain object of the data being dragged, along with information for this drag.
 * If the function returns undefined, a drag cannot start.
 *
 * The items are serialized when a drag begins and deserialized when dropped.
 * They are the only information available to drop targets about the drag source.
 */
export type VDraggableCallback = () => {
	items: Items,
	effect: DropEffectMask,
	phantom?: HTMLElement | null,
	onDragEnd: (effect: 'none' | 'copy' | 'link' | 'move') => void,
} | undefined

const vDraggableCallbackKey = Symbol('v-draggable')
type VDraggableElement = HTMLElement & { [vDraggableCallbackKey]: VDraggableCallback }

/**
 * Make the element draggable.
 *
 * Draggable elements can be nested.
 * Only the innermost element will respond to the drag.
 */
export const vDraggable: ObjectDirective<VDraggableElement, VDraggableCallback> = {
	created(el, { value }) {
		el.draggable = true
		el[vDraggableCallbackKey] = value
		el.addEventListener('dragstart', event => {
			// Stop if a descendant element is the drag source.
			if (event.target !== event.currentTarget) return
			// Collect information for the drag to be initiated.
			const el = event.target as VDraggableElement
			const dragData = el[vDraggableCallbackKey]()
			// Stop if the callback does not permit the drag.
			if (!dragData) {
				event.preventDefault()
				return
			}
			const { items, effect, phantom, onDragEnd } = dragData
			// It is impossible for browsers to emit a DragEvent with null dataTransfer.
			// It is impossible for scripts to construct a DataTransfer object.
			// Synthesized drag events are thus useless, but TypeScript insists that we check for event.dataTransfer for its theoretical nullability.
			event.dataTransfer!.items.add('', windowID)
			for (const type in items) if (Object.hasOwn(items, type)) {
				if (type === 'Metadata') {
					event.dataTransfer!.items.add('', metadataTypePrefix + JSON.stringify(items[type])
						// All uppercase letters must occur in strings.
						// Exponential `e` and other singleton values (null, false, true) are specified to be lowercase in JSON.stringify output.
						.replace(/[A-Z]/g, c => '\\u00' + c.charCodeAt(0).toString(16)))
				} else {
					event.dataTransfer!.items.add(items[type]!, type)
				}
			}
			// @ts-expect-error Why is this an error?
			event.dataTransfer!.effectAllowed = DropEffectMask[effect]
			if (phantom) {
				event.dataTransfer!.setDragImage(phantom, -32, -32)
			}
			// It is possible that a drag source is removed from the document while being dragged.
			// `drag` and `dragend` events are still dispatched for detached nodes.
			// They should not be rebound if the draggable element ref changes when a drag is in process.
			el.addEventListener('dragend', event => {
				// Stop if a descendant element is the drag source.
				// This should not happen in theory, because we've already checked it.
				if (event.target !== event.currentTarget) throw new Error('Why has this happened?')
				onDragEnd(event.dataTransfer!.dropEffect)
			}, { once: true })
		})
	},
	updated(el, { value }) {
		el.draggable = true
		el[vDraggableCallbackKey] = value
	},
	// It is okay to leave events bound on a detached element.
	// They will still be garbage collected without issues.
	// https://jakearchibald.com/2020/events-and-gc/
	// Anyway, there is no place to store the handlers or AbortControllers in a Vue custom directive.
}

//----------------------------------------------------------------------------
// Drop zone

/**
 * Determine whether something dragged over can be dropped, and if so, which operations are available.
 * Perform the drop if effect is not `none`.
 */
export type VDropZoneCallback = (items: Items, effect: 'none' | 'copy' | 'link' | 'move') => DropEffectMask

const vDropZoneCallbackKey = Symbol('v-drop-zone')
type VDropZoneElement = HTMLElement & { [vDropZoneCallbackKey]: VDropZoneCallback }

/**
 * Make the element accept drops.
 * The element will get .dragover class if it is possible to drop here.
 *
 * Drop zones can be nested.
 * A drop will bubble up till the closest drop zone that accepts the drop.
 */
export const vDropZone: ObjectDirective<VDropZoneElement, VDropZoneCallback> = {
	created(el, { value }) {
		el[vDropZoneCallbackKey] = value
		el.addEventListener('dragenter', event => {
			// While preventing `dragenter` sets the current target element to the event target in the browser, the real element willing to accept the drop may be higher up in the DOM.
			// `dragenter` events bubble, and are fired before `dragleave`, during which the dragover class is removed.
			// It is therefore not appropriate to add dragover class here.
			event.preventDefault()
		})
		el.addEventListener('dragleave', event => {
			(event.currentTarget as VDropZoneElement).classList.remove('dragover')
		})
		el.addEventListener('dragover', dragoverAndDrop)
		el.addEventListener('drop', dragoverAndDrop)
	},
	updated(el, { value }) {
		el[vDropZoneCallbackKey] = value
	},
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

// `drop` event on Chrome is buggy and always has a dropEffect of `none`.
// But it is possible to recompute the dropEffect from the event.
// `dragover` and `drop` events therefore share a large portion of code.
const dragoverAndDrop = (event: DragEvent): void => {
	// Stop if a descendant element has already claimed the drop.
	if (
		event.defaultPrevented
		&& (event.type === 'drop' || event.dataTransfer!.dropEffect !== 'none')
	) return
	// A new DataTransfer is created for every DragEvent, so caching is impossible.
	// dropEffect is reset on every `dragover` event, so it is insufficient to set it once (either on `dragenter` or on the first `dragover`).
	let sameWindow = false
	const items: Items = {}
	for (const item of event.dataTransfer!.items) if (item.kind === 'string') {
		if (item.type === windowID) {
			sameWindow = true
		} else if (item.type.startsWith(metadataTypePrefix)) {
			items.Metadata = JSON.parse(item.type.slice(metadataTypePrefix.length))
		} else {
			items[item.type] = undefined
		}
	}
	const el = event.currentTarget as VDropZoneElement
	// While a default dropEffect is provided by the browser, it lacks customizability.
	// There is no way to priortize move over copy, for example.
	// It is also extremely buggy on Chrome, so it is better to be explicit and careful.
	const allowed = DropEffectMask[event.dataTransfer!.effectAllowed] & el[vDropZoneCallbackKey](items, 'none')
	let preferred = mouseEventToPreferredDropEffect(event)
	if (!(allowed & preferred)) preferred = sameWindow ? DropEffectMask.move : DropEffectMask.copy
	if (!(allowed & preferred)) preferred = allowed
	preferred &= allowed
	preferred &= -preferred
	if (preferred) {
		event.preventDefault()
		const dropEffect = DropEffectMask[preferred] as 'copy' | 'link' | 'move'
		event.dataTransfer!.dropEffect = dropEffect
		if (event.type === 'drop') {
			el.classList.remove('dragover')
			for (const item of event.dataTransfer!.items) if (item.kind === 'string') {
				if (Object.hasOwn(items, item.type)) {
					items[item.type] = event.dataTransfer!.getData(item.type)
				}
			}
			el[vDropZoneCallbackKey](items, dropEffect)
		} else {
			el.classList.add('dragover')
		}
	}
}
