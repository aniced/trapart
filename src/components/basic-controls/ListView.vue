<!--
	This is a versatile component that covers controls ranging from list boxes to tree views.
	The internal data structure is heavily inspired by TanStack Table.
	https://tanstack.com/table/v8
-->

<script lang="ts" setup generic="T, ColumnID extends string">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
	items: T[],
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
		get: (item: T) => any,
		name: string,
	} },
	multipleSelection?: boolean,
	dragDrop?: boolean,
}>(), {
	getChildren: () => [],
})

const modelValue = defineModel<number>({ default: 0 }) // currentIndex
const filter = ref('')
const sortBy = defineModel<ColumnID>('sortBy')
const sortDescending = defineModel<boolean>('sortDescending', { default: false })
const visibleColumnsProp = defineModel<ColumnID[]>('visibleColumns')
const visibleColumns = computed<ColumnID[]>(() =>
	visibleColumnsProp.value ?? Object.keys(props.columns) as ColumnID[])
const expanded = defineModel<true | Record<PropertyKey, boolean>>('expanded', { default: true })
defineSlots<{
	[id in ColumnID]?: (props: { value: any }) => any
}>()

interface Row<T> {
	key: PropertyKey,
	/** The original data passed in for this row. */
	item: T,
	/** The depth of the row (if nested or grouped) relative to the root row array. */
	indent: number,
	parent?: PropertyKey,
	children: Row<T>[],
	/** The index of the row within its parent array (or the root data array). */
	// index: number;
}

/** Care must be taken to update the three representations in sync. */
interface Rows<T> {
	tree: Row<T>[],
	array: Row<T>[],
	map: { [key: PropertyKey]: Row<T> },
}

const allRows = computed(() => {
	const result: Rows<T> = {
		tree: [],
		array: [],
		map: {},
	}
	result.tree = function traverse(items: T[], depth:number, parent?: Row<T>): Row<T>[] {
		return items.map(item => {
			const row: Row<T> = {
				key: props.getKey(item),
				item,
				indent: depth,
				parent: parent?.key,
				children: [],
			}
			result.array.push(row)
			result.map[row.key] = row
			row.children = traverse(props.getChildren(item), depth + 1, row)
			return row
		})
	}(props.items, 0)
	return result
})

const filterRow = (row: Row<T>): boolean => (props.getPlainText ?? props.getKey)(row.item)
	.toString().includes(filter.value)

const filteredRows = computed(() => {
	if (!allRows.value.array.length || !filter.value) return allRows.value
	const result: Rows<T> = {
		tree: [],
		array: [],
		map: {},
	}
	result.tree = function traverse(rows: Row<T>[]): Row<T>[] {
		return rows.flatMap(row => {
			const children = traverse(row.children)
			if  (children.length || filterRow(row)) {
				row = { ...row, children }
				// Not in order ...??
				// getPreGroupRowModel in filterFromLeafRows tables
				result.array.push(row)
				result.map[row.key] = row
				return [row]
			}
			return []
		})
	}(allRows.value.tree)
	return result
})
const groupedRows = computed(() => {
	return filteredRows.value
})
const sortedRows = computed(() => {
	return groupedRows.value
})
const expandedRows = computed(() => {
	return sortedRows.value
})
const truncatedRows = computed(() => {
	return expandedRows.value
})


const selectionStart = ref(2)
const selectionEnd = ref(4)
</script>

<template>
	<div class="list-view">
		<input type="text" v-model="filter">
		<table :style="{
			gridTemplateColumns: '',
		}">
			<thead>
				<tr>
					<th v-for="columnID in visibleColumns" :key="columnID">
						{{ columns[columnID].name }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(row, i) in truncatedRows.array" :key="row.key" :class="{
					current: i === modelValue,
					selected: i >= selectionStart && i < selectionEnd,
				}">
					<td v-for="columnID in visibleColumns" :key="columnID">
						<slot :name="columnID" :value="columns[columnID].get(row.item)">
							{{ columns[columnID].get(row.item) }}
						</slot>
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
