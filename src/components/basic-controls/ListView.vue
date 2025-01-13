<!--
	This is a versatile component that covers controls ranging from list boxes to tree views.
	The internal data structure is heavily inspired by TanStack Table.
	https://tanstack.com/table/v8/docs/guide/row-models
	Grouping is omitted because it is incompatible with a tree.
-->

<script lang="ts" setup generic="T, ColumnID extends string">
import { computed, ref, type Component } from 'vue'

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
		name: string,
		/** If the compare key is not passed in, the column is not sortable. */
		compareKey?: (item: T) => number | string,
		initialWidth: number,
	} },
}

const props = defineProps<{
	items: T[],
	view: ListViewDescriptor<T, ColumnID>,
	multipleSelection?: boolean,
	dragDrop?: boolean,
}>()

//============================================================================
// Convert data into internal representation
//============================================================================

interface Row<T> {
	key: PropertyKey,
	/** The original data passed in for this row. */
	item: T,
	/** The depth of the row (if nested or grouped) relative to the root row array. */
	indent: number,
	children: Row<T>[],
}

//----------------------------------------------------------------------------
// From items to rows

const allRows = computed(() => {
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

const filter = ref('')
const filterInput = ref<HTMLInputElement>()

const filterRow = (row: Row<T>): boolean => (props.view.getPlainText ?? props.view.getKey)(row.item)
	.toString().includes(filter.value)

const filteredRows = computed(() => {
	if (!allRows.value.length || !filter.value) return allRows.value
	return function traverse(rows: Row<T>[]): Row<T>[] {
		return rows.flatMap(row => {
			const children = traverse(row.children)
			return children.length || filterRow(row)
				? [{ ...row, children }]
				: []
		})
	}(allRows.value)
})

//----------------------------------------------------------------------------
// Apply sorting

const sorting = ref<{ by: ColumnID, descending: boolean }[]>([])
const sortingMap = computed(() => {
	const result: { [id in ColumnID]?: { order: number, clause: { descending: boolean } } } = {}
	for (const [order, clause] of sorting.value.entries()) {
		result[clause.by as ColumnID] = { order, clause }
	}
	return result
})

const compareRows = (a: Row<T>, b: Row<T>): number => {
	for (const { by, descending } of sorting.value) {
		const { compareKey } = props.view.columns[by as ColumnID]
		if (!compareKey) continue
		const ka = compareKey(a.item)
		const kb = compareKey(b.item)
		if (ka === kb) continue
		if (typeof ka === typeof kb) return (ka < kb) !== descending ? -1 : 1
		// return (typeof ka < typeof kb) !== descending ? -1 : 1
	}
	return 0
}

const sortedRows = computed(() => {
	if (!filteredRows.value.length || !sorting.value.length) return filteredRows.value
	return function traverse(rows: Row<T>[]): Row<T>[] {
		return rows.map(row => ({
			...row,
			children: traverse(row.children),
		})).sort(compareRows)
	}(filteredRows.value)
})

function clickHeader(columnID: ColumnID, multipleSelection: boolean) {
	if (multipleSelection) {
		const clause = sortingMap.value[columnID]?.clause
		if (clause) {
			clause.descending = !clause.descending
		} else {
			sorting.value.push({
				// @ts-expect-error UnwrapRef<ColumnID> does not understand generic…?
				by: columnID,
				descending: false,
			})
		}
	} else {
		if (sorting.value.length === 1 && sorting.value[0].by === columnID) {
			const clause = sorting.value[0]
			if (clause.descending) {
				sorting.value.pop()
			} else {
				clause.descending = true
			}
		} else {
			sorting.value.splice(0, Infinity, {
				// @ts-expect-error Ditto.
				by: columnID,
				descending: false,
			})
		}
	}
}

//----------------------------------------------------------------------------
// Flat out expanded rows

const expanded = ref(new Set<PropertyKey>)
const expandedInverted = ref(false)
const isExpanded = (key: PropertyKey) => expanded.value.has(key) !== expandedInverted.value
const toggleExpanded = (key: PropertyKey, newValue?: boolean) => {
	if (newValue === undefined ? expanded.value.has(key) : newValue === expandedInverted.value) {
		expanded.value.delete(key)
	} else {
		expanded.value.add(key)
	}
}
const expandedRows = computed(() => {
	if (!sortedRows.value.length || !expanded.value.size && !expandedInverted.value) return sortedRows.value
	const result: Row<T>[] = []
	return (function traverse(rows: Row<T>[]) {
		for (const row of rows) {
			result.push(row)
			if (isExpanded(row.key)) traverse(row.children)
		}
		return result
	})(sortedRows.value)
})

//----------------------------------------------------------------------------
// Hide data too big
// This is the final data source for display.

const truncatedRows = computed(() => {
	if (expandedRows.value.length <= 1000) return expandedRows.value
	return expandedRows.value.slice(0, 1000)
})

//============================================================================
// Miscellaneous processing not directly related to data
//============================================================================

//----------------------------------------------------------------------------
// Column reordering

const visibleColumnsProp = defineModel<ColumnID[]>('visibleColumns')
const visibleColumns = computed<ColumnID[]>(() =>
	visibleColumnsProp.value ?? Object.keys(props.view.columns) as ColumnID[])

//----------------------------------------------------------------------------
// Column resizing

const columnWidthDelta = ref<{ [id in ColumnID]?: number }>({})
const gridTemplateColumns = computed(() => visibleColumns.value.map(id =>
	props.view.columns[id].initialWidth + (columnWidthDelta.value[id] ?? 0) + 'px'
).join(' '))

//----------------------------------------------------------------------------
// Selection

const modelValue = defineModel<number>({ default: 0 }) // currentIndex
const selectionStart = ref(2)
const selectionEnd = ref(4)
</script>

<template>
	<div class="list-view">
		<input type="text" ref="filterInput" v-model="filter" />
		<table :style="{
			gridTemplateColumns,
		}" @mousedown.left.prevent="filterInput?.focus()">
			<thead>
				<tr :class="{
					expanded: expandedInverted,
				}">
					<th v-for="columnID in visibleColumns" :key="columnID" :class="{
						ascending: sortingMap[columnID]?.clause.descending === false,
						descending: sortingMap[columnID]?.clause.descending === true,
					}" :data-sort-order="sortingMap[columnID]?.order"
						@click="clickHeader(columnID, $event.ctrlKey || $event.metaKey)">
						<span>{{ view.columns[columnID].name }}</span>
						<div class="grip"></div>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, i) in truncatedRows" :key="row.key" :class="{
					current: i === modelValue,
					selected: i >= selectionStart && i < selectionEnd,
					expandable: row.children.length,
					expanded: row.children.length && isExpanded(row.key),
				}" :style="{
					'--indent': row.indent,
				}" @click="toggleExpanded(row.key)">
					<td v-for="columnID in visibleColumns" :key="columnID">
						<component :is="view.columns[columnID].render" :item="row.item" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss">
.list-view {
	flex-direction: column;

	>table {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		flex: 1;
		overflow: auto;
		grid: 1lh / auto-flow;

		>thead,
		>tbody {
			display: block;
			grid: inherit;

			>tr {
				display: grid;
				grid: inherit;
				contain: strict;
				content-visibility: auto;
			}
		}

		>thead {
			position: sticky;
			top: 0;
			z-index: 1;
		}

		>thead>tr>th {
			display: flex;

			>span {
				flex: 1;
			}

			>.grip {
				cursor: col-resize;
			}
		}

		>thead>tr>th>span,
		>tbody>tr>td {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
