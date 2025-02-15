import { Grip } from './Grip'
import { useEnabled } from '../Enable'
import { Component, createMemo, createSignal, For } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { createStore2 } from '../../composables'
import { TextBox } from './TextBox'
import './ListView.scss'
import { isEmpty } from '../../utilities'

export interface ListViewDescriptor<T, ColumnID extends string = string> {
	getKey: (item: T) => PropertyKey,
	/**
	 * If getChildren returns non-empty arrays, ListView acts as a tree view.
	 */
	getChildren?: (item: T) => T[],
	/**
	 * Get the text for filtering.
	 * Usually, not all fields should be used for filtering.
	 * It is recommended that multiple fields are joined with newlines.
	 * Filtering is required for consistency; also because the <input> is what possesses the focus all the time.
	 */
	getPlainText: (item: T) => string,
	columns: { [id in ColumnID]: {
		render: Component<{ item: T }>,
		title: string,
		/** If the compare key is not passed in, the column is not sortable. */
		compareKey?: (item: T) => number | string,
		initialWidth: number,
	} },
}

interface Row<T> {
	key: PropertyKey,
	/** The original data passed in for this row. */
	item: T,
	/** The depth of the row (if nested or grouped) relative to the root row array. */
	indent: number,
	children: Row<T>[],
}

/**
 * This is a versatile component that covers controls ranging from list boxes to tree views.
 */
// The internal data structure is heavily inspired by TanStack Table.
// https://tanstack.com/table/v8/docs/guide/row-models
// Grouping is omitted because it is incompatible with a tree.
export function ListView<T, ColumnID extends string>(props: {
	items: T[],
	view: ListViewDescriptor<T, ColumnID>,
	multipleSelection?: boolean,
	dragDrop?: boolean,
}) {
	//============================================================================
	// Convert data into internal representation
	//============================================================================

	//----------------------------------------------------------------------------
	// From items to rows

	const allRows = createMemo(() => {
		return function traverse(items: T[], depth: number): Row<T>[] {
			return items.map(item => ({
				key: props.view.getKey(item),
				item,
				indent: depth,
				children: traverse(props.view.getChildren?.(item) ?? [], depth + 1),
			}))
		}(props.items, 0)
	})

	//----------------------------------------------------------------------------
	// Apply text filter

	const [filter, setFilter] = createSignal('')
	let filterInput!: HTMLInputElement

	const filterRow = (row: Row<T>): boolean => (props.view.getPlainText ?? props.view.getKey)(row.item)
		.toString().includes(filter())

	const filteredRows = createMemo(() => {
		if (!allRows().length || !filter()) return allRows()
		return function traverse(rows: Row<T>[]): Row<T>[] {
			return rows.flatMap(row => {
				const children = traverse(row.children)
				return children.length || filterRow(row)
					? [{ ...row, children }]
					: []
			})
		}(allRows())
	})

	//----------------------------------------------------------------------------
	// Apply sorting

	const [sorting, setSorting] = createStore2<{ by: ColumnID, descending: boolean }[]>([])
	const sortingMap = createMemo(() => {
		const result: { [id in ColumnID]?: { order: number, clause: { descending: boolean } } } = {}
		for (const [order, clause] of sorting.entries()) {
			result[clause.by as ColumnID] = { order, clause }
		}
		return result
	})

	const compareRows = (a: Row<T>, b: Row<T>): number => {
		for (const { by, descending } of sorting) {
			const { compareKey } = props.view.columns[by as ColumnID]
			if (!compareKey) continue
			const ka = compareKey(a.item)
			const kb = compareKey(b.item)
			if (ka === kb) continue
			if (typeof ka === typeof kb) return (ka < kb) !== descending ? -1 : 1
			// Syntax highlight breaks if the following line is uncommented.
			// return (typeof ka < typeof kb) !== descending ? -1 : 1
		}
		return 0
	}

	const sortedRows = createMemo(() => {
		if (!filteredRows().length || !sorting.length) return filteredRows()
		return function traverse(rows: Row<T>[]): Row<T>[] {
			return rows.map(row => ({
				...row,
				children: traverse(row.children),
			})).sort(compareRows)
		}(filteredRows())
	})

	function clickHeader(columnID: ColumnID, multipleSelection: boolean) {
		if (!props.view.columns[columnID].compareKey) return
		setSorting(sorting => {
			if (multipleSelection) {
				const clause = sortingMap()[columnID]?.clause
				if (clause) {
					clause.descending = !clause.descending
				} else {
					sorting.push({
						by: columnID,
						descending: false,
					})
				}
			} else {
				if (sorting.length === 1 && sorting[0].by === columnID) {
					const clause = sorting[0]
					if (clause.descending) {
						sorting.pop()
					} else {
						clause.descending = true
					}
				} else {
					sorting.splice(0, Infinity, {
						by: columnID,
						descending: false,
					})
				}
			}
		})
	}

	//----------------------------------------------------------------------------
	// Flat out expanded rows

	const [expanded, setExpanded] = createStore2<Record<PropertyKey, true>>({})
	const [expandedInverted, setExpandedInverted] = createSignal(false)
	const isExpanded = (key: PropertyKey) => !!expanded[key] !== expandedInverted()
	const toggleExpanded = (key: PropertyKey, newValue?: boolean) => {
		if (newValue === undefined ? expanded[key] : newValue === expandedInverted()) {
			setExpanded(expanded => delete expanded[key])
		} else {
			setExpanded(expanded => expanded[key] = true)
		}
	}
	const expandedRows = createMemo(() => {
		if (
			!sortedRows().length
			|| isEmpty(expanded) && !expandedInverted()
			|| !props.view.getChildren
		) return sortedRows()
		const result: Row<T>[] = []
		return (function traverse(rows: Row<T>[]) {
			for (const row of rows) {
				result.push(row)
				if (isExpanded(row.key)) traverse(row.children)
			}
			return result
		})(sortedRows())
	})

	//----------------------------------------------------------------------------
	// Hide data too big
	// This is the final data source for display.

	const visibleRows = createMemo(() => {
		if (expandedRows().length <= 1000) return expandedRows()
		return expandedRows().slice(0, 1000)
	})

	//============================================================================
	// Miscellaneous processing not directly related to data
	//============================================================================

	//----------------------------------------------------------------------------
	// Enabled

	const enabled = useEnabled()

	//----------------------------------------------------------------------------
	// Column reordering

	const [visibleColumns, setVisibleColumns] = createStore2(Object.keys(props.view.columns) as ColumnID[])

	//----------------------------------------------------------------------------
	// Column resizing

	const [columnWidth, setColumnWidth] = createStore2<{ [id in ColumnID]?: number }>({})
	const gridTemplateColumns = createMemo(() => visibleColumns.map(id =>
		(columnWidth[id] ?? props.view.columns[id].initialWidth) + 'px'
	).join(' '))

	//----------------------------------------------------------------------------
	// Selection

	// const modelValue = defineModel<number>({ default: 0 }) // currentIndex
	// const selectionStart = ref(2)
	// const selectionEnd = ref(4)

	return <div class="list-view vbox" classList={{
		tree: !!props.view.getChildren,
	}} onMouseDown={event => {
		if (!enabled()) return
		if (event.target !== filterInput) {
			event.preventDefault()
			filterInput.focus()
		}
	}}>
		<TextBox ref={filterInput} value={filter()} onUpdate={setFilter} />
		<table class="vbox fill scroll" style={{
			'grid-template-columns': gridTemplateColumns(),
		}} inert={!enabled}>
			<thead>
				<tr classList={{
					expanded: expandedInverted(),
				}}>
					<For each={visibleColumns}>{columnID => <th class="hbox" classList={{
						ascending: sortingMap()[columnID]?.clause.descending === false,
						descending: sortingMap()[columnID]?.clause.descending === true,
					}} data-sort-order={sortingMap()[columnID]?.order} onClick={event =>
						(event.target as HTMLElement).classList.contains('grip')
						|| clickHeader(columnID, event.ctrlKey || event.metaKey)}>
						<span class="fill ellipsis">{props.view.columns[columnID].title}</span>
						<Grip x={columnWidth[columnID] ?? props.view.columns[columnID].initialWidth} minX={0} onUpdate={x => setColumnWidth(columnWidth => columnWidth[columnID] = x)} />
					</th>}</For>
				</tr>
			</thead>
			<tbody>
				<For each={visibleRows()}>{row => <tr classList={{
					// current: i === modelValue,
					// selected: i >= selectionStart && i < selectionEnd,
					expandable: !!row.children.length,
					expanded: !!row.children.length && isExpanded(row.key),
				}} style={{
					'--indent': row.indent,
				}} onClick={() => toggleExpanded(row.key)}>
					<For each={visibleColumns}>{columnID => <td class="ellipsis">
						<Dynamic component={props.view.columns[columnID].render} item={row.item} />
					</td>}</For>
				</tr>}</For>
			</tbody>
		</table>
	</div>
}
