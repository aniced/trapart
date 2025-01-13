<!--
	This is a versatile component that covers controls ranging from list boxes to tree views.
	The internal data structure is heavily inspired by TanStack Table.
	https://tanstack.com/table/v8
	Grouping is omitted because it is incompatible with a tree.
-->

<script lang="ts" setup generic="T, ColumnID extends string">
import { computed, ref, type Component } from 'vue'
import TextBox from './TextBox.vue'

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
		render: Component<{item: T}>,
		name: string,
		/** If the compare key is not passed in, the column is not sortable. */
		compareKey?: (item: T) => number | string,
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

//----------------------------------------------------------------------------
// Flat out expanded rows

const expanded = ref(new Set<PropertyKey>)
const expandedInverted = ref(false)
const isExpanded = (row: Row<T>) => expanded.value.has(row.key) !== expandedInverted.value
const expandedRows = computed(() => {
	if (!sortedRows.value.length || !expanded.value.size && !expandedInverted.value) return sortedRows.value
	const result: Row<T>[] = []
	;(function traverse(rows: Row<T>[]) {
		for (const row of rows) {
			result.push(row)
			if (isExpanded(row)) traverse(row.children)
		}
	})(sortedRows.value)
	return result
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
// Selection

const modelValue = defineModel<number>({ default: 0 }) // currentIndex
const selectionStart = ref(2)
const selectionEnd = ref(4)
</script>

<template>
	<div class="list-view">
		<TextBox v-model="filter" />
		<table :style="{
			gridTemplateColumns: '',
		}">
			<thead>
				<tr>
					<th @click=""></th>
					<th v-for="columnID in visibleColumns" :key="columnID" @click="">
						{{ view.columns[columnID].name }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, i) in truncatedRows" :key="row.key" :class="{
					current: i === modelValue,
					selected: i >= selectionStart && i < selectionEnd,
					expanded: isExpanded(row),
				}">
					<td :style="{
						paddingLeft: row.indent + 'em',
					}" @click="" />
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
		display: block;
		flex: 1;
		overflow: auto;
		grid-auto-flow: column;

		>thead,
		>tbody {
			display: block;
			grid: inherit;

			>tr {
				display: grid;
				grid: inherit;
				contain: strict;
				contain-intrinsic-size: none 1lh;
				content-visibility: auto;
			}
		}

		>thead {
			position: sticky;
			top: 0;
			z-index: 1;
		}

		>thead>tr>th,
		>tbody>tr>td {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
}
</style>
