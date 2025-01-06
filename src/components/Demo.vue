<script setup lang="ts">
import { ref } from 'vue'
import SpinBox from './basic-controls/SpinBox.vue'
import ProgressBar from './basic-controls/ProgressBar.vue'
import TabView from './basic-controls/TabView.vue'
import ToolTip from './basic-controls/ToolTip.vue'
import TextBox from './basic-controls/TextBox.vue'
import ListView from './basic-controls/ListView.vue'
import Enable from './Enable.vue'

const disabled = ref(false)
const number = ref(114514)
const currentIndex = ref(0)
const string = ref('Hello, world!')
const array = ref(new Array(11).fill(65).map((x, i) => ({
  text: 'Item ' + String.fromCodePoint(x + i),
})))
</script>

<template>
  <label>
    <input type="checkbox" v-model="disabled">
    Disable everything
  </label>
  <Enable :if="!disabled">
    <fieldset>
      <legend>Actions</legend>
      <button class="ellipsis">0001 Select</button>
      <button>Cancel</button>
    </fieldset>
    <fieldset>
      <legend>Primitives</legend>{{ string }}<TextBox v-model="string" />
      <TextBox v-model="string" />
      <label>
        <input type="radio" v-model="string" value="data">
        The first
      </label>
      <label>
        <input type="radio" v-model="string" value="changed">
        The second
      </label>
      <label>
        <input type="checkbox" v-model="disabled">
        Start disabled inside
      </label>
      <SpinBox prefix="$[" v-model="number" suffix="]%" :minimum-value="-9" :maximum-value="500" />
      <label>
        Labeled text field
        <TextBox single-line v-model="string" />
      </label>
      <ProgressBar :value="42 / 100" />
    </fieldset>
    <fieldset>
      <legend>Lists</legend>
      <ListView style="width: 320px; height: 240px;" :items="array" v-model="currentIndex" line-number :item-height="40">
        <template #thead>
          <th>Original case</th>
          <th>Index</th>
          <th>Upper case</th>
        </template>
        <template #tbody="{ item, index }: { item: { text: string }, index: number }">
          <td>{{ item.text }}</td>
          <td>{{ index }}</td>
          <td>{{ item.text.toUpperCase() }}</td>
        </template>
      </ListView>
      <ListView style="width: 120px; height: 240px;" :items="array" v-model="currentIndex">
        <template #tbody="{ item }">
          <td>{{ item.text }}</td>
          <td>{{ item.text.toLowerCase() }}</td>
        </template>
      </ListView>
      <TabView :pages="['Pa', 'Pb', 'Pc']" v-model="currentIndex" tab-position="left">
        <div style="height: 514px;">
          114514
        </div>
      </TabView>
    </fieldset>
    <fieldset>
      <legend>Complex components</legend>
      <button>&lt;dialog&gt;</button>
      <dialog>
        <form method="dialog">
          What is this?
          <button>Close?</button>
        </form>
      </dialog>
    </fieldset>
    <fieldset>
      <legend>Static components</legend>
      <ToolTip>
        <div class="deluxe-label">标题</div>
        <template #hint>
          <h1>哼哼</h1>
          这是关于标题的说明。
          <hr>
          这在分割线以下。
        </template>
      </ToolTip>
      <div style="width:164px;height:100px;overflow:scroll;border:1px solid green">
        Ea aliqua amet nostrud occaecat tempor est. Dolor excepteur commodo do sunt do non nulla nisi nisi fugiat. Aute ipsum velit nostrud fugiat esse ipsum ut elit. Ex reprehenderit ea amet incididunt dolore occaecat est cupidatat. Consequat eu cupidatat et esse proident incididunt qui cillum ex fugiat in consectetur commodo. Sint et ipsum anim esse veniam mollit tempor tempor nostrud quis quis nulla occaecat.
      </div>
    </fieldset>
  </Enable>
</template>
