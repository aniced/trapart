<script setup lang="ts">
import { ref } from 'vue'
import SpinBox from './basic-controls/SpinBox.vue'
import ProgressBar from './basic-controls/ProgressBar.vue'
import TabView from './basic-controls/TabView.vue'
import HintArea from './basic-controls/HintArea.vue'
import TextEditControl from './basic-controls/TextEditControl.vue'
import Chameleon from './Chameleon.vue'
import CustomListView from './basic-controls/CustomListView.vue'
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
      <legend>Primitives</legend>
      {{ string }}
      <TextEditControl v-model="string" />
      <TextEditControl :maximum-line-count="3" v-model="string" />
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
        <TextEditControl :maximum-line-count="1" v-model="string" />
      </label>
      <ProgressBar :value="42" :max="100" />
    </fieldset>
    <fieldset>
      <legend>Lists</legend>
      <CustomListView style="width: 320px; height: 240px;" :items="array" v-model="currentIndex" line-number :item-height="40">
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
      </CustomListView>
      <CustomListView style="width: 120px; height: 240px;" :items="array" v-model="currentIndex">
        <template #tbody="{ item }">
          <td>{{ item.text }}</td>
          <td>{{ item.text.toLowerCase() }}</td>
        </template>
      </CustomListView>
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
      <HintArea>
        <div class="deluxe-label">标题</div>
        <template #hint>
          <h1>哼哼</h1>
          这是关于标题的说明。
          <hr>
          这在分割线以下。
        </template>
      </HintArea>
      <div style="width:164px;height:100px;overflow:scroll;border:1px solid green">
        Ea aliqua amet nostrud occaecat tempor est. Dolor excepteur commodo do sunt do non nulla nisi nisi fugiat. Aute ipsum velit nostrud fugiat esse ipsum ut elit. Ex reprehenderit ea amet incididunt dolore occaecat est cupidatat. Consequat eu cupidatat et esse proident incididunt qui cillum ex fugiat in consectetur commodo. Sint et ipsum anim esse veniam mollit tempor tempor nostrud quis quis nulla occaecat.
      </div>
    </fieldset>
  </Enable>
</template>
