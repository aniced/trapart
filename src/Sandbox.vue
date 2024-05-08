<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { inferSchema, type Schema } from './infer'
const gamedataURL = ref('https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/%s')
//const gamedataURL = ref('https://raw.gitmirror.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/%s')
//const gamedataURL = ref('https://cdn.jsdelivr.net/gh/Kengxxiao/ArknightsGameData@master/zh_CN/gamedata/%s')
const gamedata = ref({ 'excel/chapter_table.json': {} })
const gamedataType = ref<{ [filename: string]: Schema }>({ 'excel/chapter_table.json': { type: 'any' } })

watchEffect(async () => {
	const chapterTable = await (await fetch(gamedataURL.value.replace(/%s/g, 'excel/chapter_table.json'), { referrerPolicy: 'no-referrer' })).json()
	gamedataType.value['excel/chapter_table.json'] = inferSchema(chapterTable, [])
	gamedata.value['excel/chapter_table.json'] = chapterTable
})
</script>

<template>
	<pre>{{ gamedata["excel/chapter_table.json"] }}</pre>
</template>
