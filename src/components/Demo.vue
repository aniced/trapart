<script setup lang="ts">
import { ref } from 'vue'
import DeluxeLabel from './basic-controls/DeluxeLabel.vue'
import Checkerboard from './basic-controls/Checkerboard.vue'
import GroupBox from './basic-controls/GroupBox.vue'
import RoundFrame from './basic-controls/RoundFrame.vue'
import ThickFrame from './basic-controls/ThickFrame.vue'
import SpinBox from './basic-controls/SpinBox.vue'
import ProgressBar from './basic-controls/ProgressBar.vue'
import TabView from './basic-controls/TabView.vue'
import HintArea from './basic-controls/HintArea.vue'
import TextEditControl from './basic-controls/TextEditControl.vue'
import StatusBar from './basic-controls/StatusBar.vue'
import LabeledCheckBox from './basic-layouts/LabeledCheckBox.vue'
import LabeledRadioButton from './basic-layouts/LabeledRadioButton.vue'
import Labeler from './basic-layouts/Labeler.vue'
import Chameleon from './Chameleon.vue'
import CustomListView from './basic-controls/CustomListView.vue'

const disabled = ref(false)
const number = ref(114514)
const currentIndex = ref(0)
const string = ref('Hello, world!')
const array = ref(new Array(11).fill(65).map((x, i) => ({
  text: 'Item ' + String.fromCodePoint(x + i),
})))
</script>

<template>
  <LabeledCheckBox v-model="disabled">Disable everything</LabeledCheckBox>
  <fieldset :disabled="disabled">
    <GroupBox>
      <template #title>Actions</template>
      <button class="ellipsis">0001 Select</button>
      <button>Cancel</button>
    </GroupBox>
    <GroupBox>
      <template #title>Primitives</template>
      {{ string }}
      <TextEditControl v-model="string" />
      <TextEditControl :maximum-line-count="3" v-model="string" />
      <LabeledRadioButton v-model="string" value="data">The first</LabeledRadioButton>
      <LabeledRadioButton v-model="string" value="changed">The second</LabeledRadioButton>
      <LabeledCheckBox v-model="disabled">Start disabled inside</LabeledCheckBox>
      <SpinBox prefix="$[" v-model="number" suffix="]%" :minimum-value="-9" :maximum-value="500" />
      <Labeler>
        <template #title>Labeled text field</template>
        <TextEditControl :maximum-line-count="1" v-model="string" />
      </Labeler>
      <ProgressBar :value="42" :max="100" />
    </GroupBox>
    <GroupBox>
      <template #title>Lists</template>
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
    </GroupBox>
    <GroupBox>
      <template #title>Complex components</template>
      <button>&lt;dialog&gt;</button>
      <dialog>
        <form method="dialog">
          What is this?
          <button>Close?</button>
        </form>
      </dialog>
    </GroupBox>
    <GroupBox>
      <template #title>Static components</template>
      <HintArea title="哼哼">
        <DeluxeLabel>标题</DeluxeLabel>
        <template #hint>
          这是关于标题的说明。
          <hr>
          这在分割线以下。
        </template>
      </HintArea>
      <Checkerboard :red="0" :green="0" :blue="128">内容图像</Checkerboard>
      <div style="width:164px;height:100px;overflow:scroll;border:1px solid green">
        Ea aliqua amet nostrud occaecat tempor est. Dolor excepteur commodo do sunt do non nulla nisi nisi fugiat. Aute ipsum velit nostrud fugiat esse ipsum ut elit. Ex reprehenderit ea amet incididunt dolore occaecat est cupidatat. Consequat eu cupidatat et esse proident incididunt qui cillum ex fugiat in consectetur commodo. Sint et ipsum anim esse veniam mollit tempor tempor nostrud quis quis nulla occaecat.
      </div>
      <RoundFrame>
        <ThickFrame></ThickFrame>
      </RoundFrame>
      <StatusBar>
        <div>114514</div>
        <hr>
        <div>1919810</div>
      </StatusBar>
    </GroupBox>
  </fieldset>
</template>
