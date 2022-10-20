<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import DeluxeLabel from "./components/basic-controls/DeluxeLabel.vue"
import Checkerboard from "./components/basic-controls/Checkerboard.vue"
import GroupBox from "./components/basic-controls/GroupBox.vue"
import RoundFrame from "./components/basic-controls/RoundFrame.vue"
import ThickFrame from "./components/basic-controls/ThickFrame.vue"
import SpinBox from "./components/basic-controls/SpinBox.vue"
import ProgressBar from "./components/basic-controls/ProgressBar.vue"
import TabView from "./components/basic-controls/TabView.vue"
import HintArea from './components/basic-controls/HintArea.vue'
import TextEditControl from './components/basic-controls/TextEditControl.vue'
import StatusBar from './components/basic-controls/StatusBar.vue'
import { inferType, type SchemaType } from "./infer"
import { replacer } from "./json-map-set"
import LabeledCheckBox from "./components/basic-layouts/LabeledCheckBox.vue"
import LabeledRadioButton from "./components/basic-layouts/LabeledRadioButton.vue"
import Labeler from "./components/basic-layouts/Labeler.vue"
import Chameleon from "./components/Chameleon.vue"
import CustomListView from "./components/basic-controls/CustomListView.vue"
import DataBlackBox from "./components/DataBlackBox.vue"
const d = ref(false)
const g = ref<HTMLDialogElement | null>(null)
const m = ref(new Array(11).fill(1).map((v, i) => ({
  text: 'Item ' + i,
})))
const n = ref(0)
const x = ref(114)
const y = ref(0)
const z = ref("data")
//const gamedataURL = ref("https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/%s")
const gamedataURL = ref("https://raw.fastgit.org/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/%s")
//const gamedataURL = ref("https://raw.githubusercontents.com/Kengxxiao/ArknightsGameData/master/zh_CN/gamedata/%s")
//const gamedataURL = ref("https://cdn.jsdelivr.net/gh/Kengxxiao/ArknightsGameData@master/zh_CN/gamedata/%s")
const gamedata = ref({ "excel/chapter_table.json": {} })
const gamedataType = ref<{ [filename: string]: SchemaType }>({ "excel/chapter_table.json": { type: "any" } })

watchEffect(async () => {
  return
  const chapterTable = await (await fetch(gamedataURL.value.replace(/%s/g, "excel/chapter_table.json"), { referrerPolicy: "no-referrer" })).json()
  const stageTable = await (await fetch(gamedataURL.value.replace(/%s/g, "excel/stage_table.json"), { referrerPolicy: "no-referrer" })).json()
  gamedataType.value["excel/chapter_table.json"] = inferType(chapterTable, '/')
  gamedata.value["excel/chapter_table.json"] = chapterTable
  console.log(JSON.stringify(inferType(stageTable, '/'), replacer, 2))
})
</script>

<template>
  <header>
    <fieldset></fieldset>
    <button class="ellipsis">确定哼哼啊啊啊啊啊</button>
    <LabeledCheckBox v-model="d">disable</LabeledCheckBox>
    {{ z }}
    <TextEditControl v-model="z"></TextEditControl>
    <TextEditControl :maximum-line-count="y" v-model="z"></TextEditControl>
    <fieldset :disabled="d">
      <LabeledRadioButton v-model="z" value="data">The first</LabeledRadioButton>
      <LabeledRadioButton v-model="z" value="changed">The second</LabeledRadioButton>
      <LabeledCheckBox v-model="d">Start disabled inside</LabeledCheckBox>
      <SpinBox prefix="$[" v-model="x" suffix="]%" :minimum-value="-9" :maximum-value="500"></SpinBox>
      <CustomListView style="width: 320px; height: 240px;" :items="m" v-model="n" line-number :item-height="40">
        <template #thead>
          <th>Original case</th>
          <th>Upper case</th>
        </template>
        <template #tbody="{ item }">
          <td>{{ item.text }}</td>
          <td>{{ item.text.toUpperCase() }}</td>
        </template>
      </CustomListView>
      <CustomListView style="width: 120px; height: 240px;" :items="m" v-model="n">
        <template #tbody="{ item }">
          <td>{{ item.text }}</td>
          <td>{{ item.text.toLowerCase() }}</td>
        </template>
      </CustomListView>
      <HintArea title="哼哼">
        <DeluxeLabel>标题</DeluxeLabel>
        <template #hint>
          这是关于标题的说明。
          <hr>
          这在分割线以下。
        </template>
      </HintArea>
      <Labeler>
        <template #title>Labeled text field</template>
        <TextEditControl :maximum-line-count="1" v-model="z" />
      </Labeler>
      <button>取消</button>
      <Chameleon title="超级编辑器" :type="gamedataType['excel/chapter_table.json']" :value="gamedata"
        key-name="excel/chapter_table.json" />
      <Checkerboard :red="0" :green="0" :blue="128">内容图像</Checkerboard>
      <GroupBox>
        <template #title>标题</template>
        内容
        <hr>
      </GroupBox>
      <div style="width:164px;height:100px;overflow:scroll;border:1px solid green">
        longllllllllllllllllllllllllllllllllll long Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
        aut perferendis dolores ab facere mollitia modi aliquid ipsa autem sed laborum illo repudiandae sit, id maxime
        possimus eos laboriosam. Eius?</div>
      <TabView :pages="['a', 'bb','c','d','e','gg','f','we','f..','i','j','mm','z']" v-model="y" tab-position="left">
        <div style="height: 514px;">
          {{ gamedata["excel/chapter_table.json"] }}
        </div>
      </TabView>
    </fieldset>
  </header>

  <main>
    <RoundFrame>
      <ThickFrame></ThickFrame>
    </RoundFrame>

    <ProgressBar :value="37" :max="100"></ProgressBar>

    <button @click="g?.showModal()">&lt;dialog&gt;</button>
    <dialog ref="g">
      <form method="dialog">
        What is this?
        <button>Close?</button>
      </form>
    </dialog>

    <DataBlackBox />
  </main>

  <StatusBar>
    <div>114514</div>
    <hr>
    <div>1919810</div>
  </StatusBar>
</template>

<style lang="scss">
@use "sass:color";
@use "sass:string";
@use "qt";

@font-face {
  font-family: "M+mini 1c regular";
  src: url("assets/mplusmini-1c-regular-webfont.woff2") format("woff2");
  font-weight: normal;
}

@font-face {
  font-family: "M+mini 1p medium";
  src: url("assets/mplusmini-1p-medium-webfont.woff2") format("woff2");
  font-weight: 500;
}

@font-face {
  font-family: "M+mini 1p heavy";
  src: url("assets/mplusmini-1p-heavy-webfont.woff2") format("woff2");
  font-weight: 800;
}

@font-face {
  font-family: "M+mini 1m regular";
  src: url("assets/mplusmini-1m-regular-webfont.woff2") format("woff2");
  font-weight: normal;
}

@function encode-color($color) {
  @return "%23"+string.unquote(string.slice(color.ie-hex-str($color), 4));
}

@mixin theme($window1,
  $window2,
  $outside-area,
  $inactive-tab1,
  $inactive-tab2,
  $control-frame,
  $scrollbar1,
  $scrollbar2,
  $focus-frame,

  $normal-text,
  $normal-back1,
  $normal-back2,
  $selected-text,
  $selected-back,
  $selected-ed-text,
  $selected-ed-back,
  $disabled-text,
  $hyperlink-text,

  $button1,
  $button2,
  $pressed-button-text,
  $hot-button1,
  $hot-button2,
  $hot-button-text,
  $twinkling-btn1,
  $twinkling-btn2,
  $group-box1,
  $group-box2,
  $group-box-frame,
  $deluxe-label1,
  $deluxe-label2,
  $deluxe-label-text,

  $highlight,
  $work-area,
  $check-mark,
  $drop-target,
  $progress-bar,

  $arrow-color,

  $is-dark-mode,
) {
  --window1: #{$window1};
  --window2: #{$window2};
  --outside-area: #{$outside-area};
  --inactive-tab1: #{$inactive-tab1};
  --inactive-tab2: #{$inactive-tab2};
  --control-frame: #{$control-frame};
  --toolbar1-150: #{qt.lighter($window1, 1.5)};
  --toolbar2-150: #{qt.darker($window2, 1.5)};
  --scrollbar1: #{$scrollbar1};
  --scrollbar2: #{$scrollbar2};
  --pressed-scrollbar1: #{color.scale($scrollbar1, $alpha: -30%)};
  --pressed-scrollbar-control-frame: #{color.mix($scrollbar2, $control-frame, 30%)};
  --focus-frame: 2px solid #{$focus-frame};

  --normal-text: #{$normal-text};
  --normal-text-70: #{color.scale($normal-text, $alpha: -30%)};
  --normal-text-50: #{color.scale($normal-text, $alpha: -50%)};
  --normal-back1: #{$normal-back1};
  --normal-back2: #{$normal-back2};
  // visible: PaletteSingleton.normalBack1 == PaletteSingleton.normalBack2
  --list-box-row-underline: #{if($normal-back1 == $normal-back2, $normal-text, transparent)};
  --selected-text: #{$selected-text};
  --selected-back: #{$selected-back};
  --selected-back-130: #{qt.lighter($selected-back, 1.3)};
  --selected-ed-text: var(--normal-text);
  --selected-ed-back: #{$selected-ed-back};
  --disabled-text: #{$disabled-text};
  // data.disabledOpacity is solely for double dimming of button labels. Hence we multiply the alpha components here.
  --disabled-text-50: #{color.scale($disabled-text, $alpha: -50%)};
  --disabled-text-38: #{color.scale($disabled-text, $alpha: -62.5%)};
  --hyperlink-text: #{$hyperlink-text};

  --button1: #{$button1};
  --button2: #{$button2};
  --button: padding-box linear-gradient(var(--button1), var(--button2));
  --pressed-button1: var(--button2);
  --pressed-button2: var(--button1);
  --pressed-button: padding-box linear-gradient(var(--pressed-button1), var(--pressed-button2));
  --pressed-button-text: var(--normal-text);
  --hot-button1: #{$hot-button1};
  --hot-button2: #{$hot-button2};
  --hot-button: padding-box linear-gradient(var(--hot-button1), var(--hot-button2));
  --hot-button-text: var(--normal-text);
  // twinklingBtn1 and twinklingBtn2 are only applied to the default button, where the opacity of the Rectangle is 0.5. Hence we include the alpha component here.
  --twinkling-btn1: #{color.scale($twinkling-btn1, $alpha: -50%)};
  --twinkling-btn2: #{color.scale($twinkling-btn2, $alpha: -50%)};
  --twinkling-btn: padding-box linear-gradient(var(--twinkling-btn1), var(--twinkling-btn2));
  --group-box1: #{$group-box1};
  --group-box2: #{$group-box2};
  --group-box-frame: #{$group-box-frame};
  --deluxe-label1: #{$deluxe-label1};
  --deluxe-label2: #{$deluxe-label2};
  --deluxe-label-text: #{$deluxe-label-text};

  --highlight: #{$highlight};
  --work-area: #{$work-area};
  --check-mark: #{$check-mark};
  --drop-target: #{$drop-target};
  --progress-bar: #{$progress-bar};
  // GradientStop { color: Qt.lighter(root.color, 1.3); position: 0 }
  --progress-bar1: #{qt.lighter($progress-bar, 1.3)};
  // border.color: Qt.darker(root.color, 1.2)
  --progress-bar-frame: #{qt.darker($progress-bar, 1.2)};

  // The PNG resources are solid. To mitigate difficulties in scrollbar styling, the opacity is baked into the following SVG data. An opacity: 0.7 multiplied with fill-opacity='0.7' will approximately give the desired opacity of 0.5 in disabled cases.
  --arrow-left-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 3.5 l 3.5 -3.5 v 7 z' fill='#{encode-color($arrow-color)}' fill-opacity='0.7' /%3E%3C/svg%3E");
  --arrow-right-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 0 l 3.5 3.5 l -3.5 3.5 z' fill='#{encode-color($arrow-color)}' fill-opacity='0.7' /%3E%3C/svg%3E");
  --arrow-up-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 3.5 0 l 3.5 3.5 h -7 z' fill='#{encode-color($arrow-color)}' fill-opacity='0.7' /%3E%3C/svg%3E");
  --arrow-down-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 0 0 h 7 l -3.5 3.5 z' fill='#{encode-color($arrow-color)}' fill-opacity='0.7' /%3E%3C/svg%3E");

  color-scheme: if($is-dark-mode, dark, light);
}

@mixin themed-root($class, $media) {
  body.#{$class} {
    @content;
  }

  @media #{$media} {
    body {
      @content;
    }
  }
}

@include themed-root(light, "all") {
  $window2: #d0dbe8;
  $control-frame: qt.darker($window2, 1.7);
  $deluxe-label1: #0050a0;
  @include theme($is-dark-mode: false,

    $window1: qt.lighter($window2, 1.1),
    $window2: $window2,
    $outside-area: qt.darker($window2, 1.2),
    $inactive-tab1: qt.darker($window2, 1.1),
    $inactive-tab2: qt.darker($window2, 1.2),
    $control-frame: $control-frame,
    $scrollbar1: qt.darker($window2, 1.1),
    $scrollbar2: $window2,
    $focus-frame: #648cb4,

    $normal-text: #000000,
    $normal-back1: #ffffff,
    $normal-back2: #e4ecf2,
    $selected-text: #ffffff,
    $selected-back: #0064c8,
    $selected-ed-text: var(--normal-text),
    $selected-ed-back: #bbddff,
    $hyperlink-text: #0000ff,
    $disabled-text: #00000080,
    $button1: #eef6fc,
    $button2: #aeb6bc,
    $pressed-button-text: var(--normal-text),
    $hot-button1: #ffffff,
    $hot-button2: #c0e0ff,
    $hot-button-text: var(--normal-text),
    $twinkling-btn1: qt.lighter(#38d, 1.8),
    $twinkling-btn2: qt.lighter(#38d, 1.5),
    $group-box1: #90b0d060,
    $group-box2: #7090b060,
    $group-box-frame: #ffffff,
    $deluxe-label1: #{$deluxe-label1},
    $deluxe-label2: #{qt.lighter($deluxe-label1, 1.2)},
    $deluxe-label-text: #ffffff,

    $highlight: #ffffff80,
    $work-area: #224488,
    $check-mark: #4466aa,
    $drop-target: #ffee60,
    $progress-bar: #4499dd,

    $arrow-color: black,
  );

  --exp-curve-color1: #13920D;
  --exp-curve-color2: #DE5C2F;

  --event-indigo: indigo;
  --event-green: green;
  --event-blue: blue;
  --event-red: red;
  --event-darkorange: darkorange;
  --event-magenta: magenta;
  --event-maroon: maroon;
  --event-olive: olive;
  --event-crimson: crimson;
  --event-purple: purple;
  --event-teal: teal;
  --event-deeppink: deeppink;
  --event-dodgerblue: dodgerblue;
  --event-darkviolet: darkviolet;
  --event-gray: gray;
  --event-navy: navy;
  --event-slategray: slategray;

  --local-font: sans-serif;
  --fixed-font: "M+mini 1m regular", "M+ 1m regular", var(--local-font);
  --normal-font: "M+mini 1c regular", "M+ 1c regular", var(--local-font);
  --medium-font: "M+mini 1p medium", "M+ 1p medium", var(--local-font);
  --heavy-font: "M+mini 1p heavy", "M+ 1p heavy", var(--local-font);
  --symbol-font: "M+mini 1p heavy"; // for CheckBox
  --font-size: 14px;
  --label-font-size: 13px;
  --control-height: 27px;
}

@include themed-root(dark, "(prefers-color-scheme: dark)") {
  @include theme($is-dark-mode: true,

    $window1: #474b4d,
    $window2: #2f3335,
    $outside-area: #181819,
    $inactive-tab1: #373b3d,
    $inactive-tab2: #1f2325,
    $control-frame: #111618,
    $scrollbar1: #515658,
    $scrollbar2: #616668,
    $focus-frame: #4e78a1,

    $normal-text: #cccccc,
    $normal-back1: #25282a,
    $normal-back2: #2c2f31,
    $selected-text: #cccccc,
    $selected-back: #4b6eaf,
    $selected-ed-text: var(--normal-text),
    $selected-ed-back: #4b6eaf,
    $disabled-text: #777777,
    $hyperlink-text: #0099ff,

    $button1: #616668,
    $button2: #54595b,
    $pressed-button-text: var(--normal-text),
    $hot-button1: #717678,
    $hot-button2: #64696b,
    $hot-button-text: var(--normal-text),
    $twinkling-btn1: #173e70,
    $twinkling-btn2: #082147,
    $group-box1: #ffffff18,
    $group-box2: #ffffff10,
    $group-box-frame: #202020,
    $deluxe-label1: #272b2d,
    $deluxe-label2: #0f1315,
    $deluxe-label-text: #dddddd,

    $highlight: #51555780,
    $work-area: #224488,
    $check-mark: #aaaaaa,
    $drop-target: #456ea6,
    $progress-bar: #4499dd,

    $arrow-color: white,
  );

  --exp-curve-color1: #1AC011;
  --exp-curve-color2: #ECA188;

  --event-indigo: #DFBFFF;
  --event-green: #00DF00;
  --event-blue: #5394EC;
  --event-red: #FF8785;
  --event-darkorange: #FF8C00;
  --event-magenta: #FFBFFF;
  --event-maroon: #BF7070;
  --event-olive: #D6BF55;
  --event-crimson: #FF6B68;
  --event-purple: #DC56DF;
  --event-teal: #BFFFFF;
  --event-deeppink: #FFBFE2;
  --event-dodgerblue: #B0C9EB;
  --event-darkviolet: #C19DD1;
  --event-gray: #AAAAAA;
  --event-navy: #BFBFFF;
  --event-slategray: #9BB6CF;
}

@include themed-root(high-contrast-dark, "(prefers-contrast: more)") {
  @include theme($is-dark-mode: true,

    $window1: #000000,
    $window2: #000000,
    $outside-area: #000000,
    $inactive-tab1: #000000,
    $inactive-tab2: #000000,
    $control-frame: #ffffff,
    $scrollbar1: #000000,
    $scrollbar2: #000000,
    $focus-frame: #ffff00,

    $normal-text: #ffffff,
    $normal-back1: #000000,
    $normal-back2: #000000,
    $selected-text: #000000,
    $selected-back: #1AEBFF,
    $selected-ed-text: #000000,
    $selected-ed-back: #1AEBFF,
    $disabled-text: #00FF00,
    $hyperlink-text: #00ffff,

    $button1: #000000,
    $button2: #000000,
    $pressed-button-text: #000000,
    $hot-button1: #1AEBFF,
    $hot-button2: #1AEBFF,
    $hot-button-text: #000000,
    $twinkling-btn1: #1AEBFF80,
    $twinkling-btn2: #1AEBFF80,
    $group-box1: #000000,
    $group-box2: #000000,
    $group-box-frame: #ffffff,
    $deluxe-label1: #000000,
    $deluxe-label2: #000000,
    $deluxe-label-text: #ffffff,

    $highlight: #ffffff80,
    $work-area: #224488,
    $check-mark: #FFFFFF,
    $drop-target: #1AEBFF,
    $progress-bar: #1AEBFF,

    $arrow-color: white,
  );

  --exp-curve-color1: #00FF00;
  --exp-curve-color2: #FF8000;

  --event-indigo: #FF58FF;
  --event-green: #00FF00;
  --event-blue: #00CFFF;
  --event-red: #FF8080;
  --event-darkorange: #FF8000;
  --event-magenta: #FF58FF;
  --event-maroon: #FF8080;
  --event-olive: #FFFF00;
  --event-crimson: #E78386;
  --event-purple: #FF58FF;
  --event-teal: #00FFFF;
  --event-deeppink: #FF80C0;
  --event-dodgerblue: #00FFFF;
  --event-darkviolet: #D935FF;
  --event-gray: #AAAAAA;
  --event-navy: #00FFFF;
  --event-slategray: #FFFFFF;
}

@include themed-root(high-contrast-light, "(prefers-contrast: more) and (prefers-color-scheme: light)") {
  @include theme($is-dark-mode: false,

    $window1: #FFFFFF,
    $window2: #FFFFFF,
    $outside-area: #FFFFFF,
    $inactive-tab1: #FFFFFF,
    $inactive-tab2: #FFFFFF,
    $control-frame: #000000,
    $scrollbar1: #FFFFFF,
    $scrollbar2: #FFFFFF,
    $focus-frame: #00009F,

    $normal-text: #000000,
    $normal-back1: #FFFFFF,
    $normal-back2: #FFFFFF,
    $selected-text: #FFFFFF,
    $selected-back: #37006E,
    $selected-ed-text: #FFFFFF,
    $selected-ed-back: #37006E,
    $disabled-text: #800000,
    $hyperlink-text: #0000ff,

    $button1: #FFFFFF,
    $button2: #FFFFFF,
    $pressed-button-text: #FFFFFF,
    $hot-button1: #37006E,
    $hot-button2: #37006E,
    $hot-button-text: #FFFFFF,
    $twinkling-btn1: #37006E80,
    $twinkling-btn2: #37006E80,
    $group-box1: #FFFFFF,
    $group-box2: #FFFFFF,
    $group-box-frame: #000000,
    $deluxe-label1: #FFFFFF,
    $deluxe-label2: #FFFFFF,
    $deluxe-label-text: #000000,

    $highlight: #00000080,
    $work-area: #224488,
    $check-mark: #000000,
    $drop-target: #37006E,
    $progress-bar: #37006E,

    $arrow-color: black,
  );
}

*,
::before,
::after {
  box-sizing: border-box;
  margin: 0;
  border: 0;
  padding: 0;
  font-weight: normal;
  cursor: inherit;
}

body {
  min-height: 100vh;
  background: linear-gradient(var(--window1), var(--window2));
  line-height: 1.2;
  color: var(--normal-text);
  font-family: var(--normal-font);
  font-size: var(--font-size);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
  cursor: default;
}

// <hr> models DialogSeparator.
hr {
  margin: 8px auto;
  border-top: 1px solid #00000040;
  border-bottom: 1px solid var(--highlight);
}

label,
// We don't want labels on buttons to delegate :hover, so here's a less semantic version of <label>.
.label {
  color: var(--normal-text);
  font-family: var(--medium-font);
  font-size: var(--label-font-size);
  line-height: calc(var(--label-font-size) + 6px);
  display: block;

  :disabled & {
    color: var(--normal-text-50);
  }
}


::selection {
  background-color: var(--selected-ed-back);
  color: var(--selected-ed-text);
}

::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}

::-webkit-scrollbar-track:horizontal {
  border-top: 1px solid var(--control-frame);
}

::-webkit-scrollbar-track:vertical {
  border-left: 1px solid var(--control-frame);
}

::-webkit-scrollbar-track {
  background-color: var(--scrollbar2);
}

::-webkit-scrollbar-thumb:horizontal {
  border-width: 2px 1px 1px 1px;
}

::-webkit-scrollbar-thumb:vertical {
  border-width: 1px 1px 1px 2px;
}

::-webkit-scrollbar-thumb {
  border-style: solid;
  border-color: transparent;
  box-shadow:
    inset 0 0 0 1px var(--control-frame),
    inset 0 0 0 8px var(--scrollbar1);
}

::-webkit-scrollbar-thumb:active {
  box-shadow:
    inset 0 0 0 1px var(--pressed-scrollbar-control-frame),
    inset 0 0 0 8px var(--pressed-scrollbar1);
}

::-webkit-scrollbar-button:horizontal:start {
  border-left-width: 0;
}

::-webkit-scrollbar-button:vertical:start {
  border-top-width: 0;
}

::-webkit-scrollbar-button:horizontal,
::-webkit-scrollbar-button:vertical:end {
  border-bottom-width: 0;
}

::-webkit-scrollbar-button:vertical,
::-webkit-scrollbar-button:horizontal:end {
  border-right-width: 0;
}

::-webkit-scrollbar-button {
  width: 16px;
  height: 16px;
  border: 1px solid var(--control-frame);
  box-shadow: inset 0 0 0 1px var(--highlight);
}

::-webkit-scrollbar-button:horizontal:decrement {
  background:
    var(--arrow-left-image) center no-repeat,
    linear-gradient(var(--button1), var(--button2));
}

::-webkit-scrollbar-button:horizontal:decrement:active {
  background:
    var(--arrow-left-image) center no-repeat,
    linear-gradient(var(--pressed-button1), var(--pressed-button2));
}

::-webkit-scrollbar-button:horizontal:increment {
  background:
    var(--arrow-right-image) center no-repeat,
    linear-gradient(var(--button1), var(--button2));
}

::-webkit-scrollbar-button:horizontal:increment:active {
  background:
    var(--arrow-right-image) center no-repeat,
    linear-gradient(var(--pressed-button1), var(--pressed-button2));
}

::-webkit-scrollbar-button:vertical:decrement {
  background:
    var(--arrow-up-image) center no-repeat,
    linear-gradient(var(--button1), var(--button2));
}

::-webkit-scrollbar-button:vertical:decrement:active {
  background:
    var(--arrow-up-image) center no-repeat,
    linear-gradient(var(--pressed-button1), var(--pressed-button2));
}

::-webkit-scrollbar-button:vertical:increment {
  background:
    var(--arrow-down-image) center no-repeat,
    linear-gradient(var(--button1), var(--button2));
}

::-webkit-scrollbar-button:vertical:increment:active {
  background:
    var(--arrow-down-image) center no-repeat,
    linear-gradient(var(--pressed-button1), var(--pressed-button2));
}

::-webkit-scrollbar-button:active {
  background-image: linear-gradient(var(--pressed-button1), var(--pressed-button2));
}

::-webkit-scrollbar-corner {
  border: solid var(--control-frame);
  border-width: 1px 0 0 1px;
  background-color: var(--outside-area);
}


// The transparent border is for correct sizing, which in turn gives correct hit test areas.
// Non-interactive components, on the other hand, may find having a container element being a more natural approach.
button {
  width: 90px;
  height: var(--control-height);
  font-family: var(--medium-font);
  font-size: var(--font-size);
  border: 2px solid transparent;
  outline: 1px solid var(--control-frame);
  outline-offset: -2px;
  background: var(--arrow-image), var(--button);
  --arrow-image: none;
  --arrow-image-color: var(--normal-text-70);
  text-align: center;
  // anchors.verticalCenter: parent.verticalCenter
  line-height: calc(var(--control-height) - 4px);
  color: var(--normal-text);
  // anchors.margins: 1; radius: 2.5
  border-radius: 3.5px;
  box-shadow: inset 0 0 0 1px var(--highlight);
}

button>img:first-child {
  margin-right: 2px;
  vertical-align: middle;
}

button:focus {
  background: var(--arrow-image), var(--twinkling-btn), var(--button);
  // Subtlety. Only the focus ring should get a radius of 2px, not the button itself. Does not make much difference, though.
  // To compensate for the button border, which should still be (barely) visible under the focus ring, another pixel of rounded corners is added.
  border-radius: 3px;
}

button:enabled:hover {
  background: var(--arrow-image), var(--hot-button);
  color: var(--hot-button-text);
}

button:enabled:active {
  background: var(--arrow-image), var(--pressed-button);
  color: var(--pressed-button-text);
}

button:focus:hover {
  background: var(--arrow-image), var(--twinkling-btn), var(--hot-button);
}

button:focus:active {
  background: var(--arrow-image), var(--twinkling-btn), var(--pressed-button);
}

button:disabled {
  background: var(--arrow-image), padding-box var(--window2);
  color: var(--disabled-text-50);
  --arrow-image-color: var(--normal-text-50);
}

button.ellipsis {
  --arrow-image: right 6px center / 10px 2px no-repeat repeating-linear-gradient(to right, var(--arrow-image-color) 0 2px, transparent 0 4px);
  text-align: left;
  padding-left: 4px;
  padding-right: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-family: var(--fixed-font);
}

button.ellipsis:disabled {
  color: transparent;
}

input[type="radio" i],
input[type="checkbox" i] {
  appearance: none;
  vertical-align: middle;
  box-shadow: inset 0 0 0 1px var(--normal-back1);
  border: 1px solid var(--control-frame);
  outline-offset: -2px;
  background: linear-gradient(var(--normal-back2), var(--normal-back1));

  &:checked::after {
    opacity: 1;
  }

  &:disabled:checked::after,
  &:enabled:active::after {
    opacity: .5;
  }

  &:disabled {
    background: var(--window2);
  }

  label:active>&:enabled {
    outline: var(--focus-frame);

    // [Workaround] While the HTML spec says that :active <label> should trigger :active <input>, Chrome sometimes has problems with checkboxes and radios.
    &::after {
      opacity: .5;
    }
  }
}

input[type="radio" i] {
  width: 18px;
  height: 18px;
  transform: translate(-.5px, -.5px);
  border-radius: 50%;

  &::after {
    content: "";
    display: block;
    margin: 3px;
    background-color: var(--check-mark);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    opacity: 0;
  }
}

input[type="checkbox" i] {
  width: 17px;
  height: 17px;
  margin: 0 1px 1px 0;
  border-radius: 2px;

  &::after {
    display: block;
    // anchors.centerIn: parent
    text-align: center;
    // anchors.verticalCenterOffset: 1
    line-height: 17px;
    // text: "\u2714"  // HEAVY CHECK MARK
    content: "\2714";
    font-family: var(--symbol-font);
    font-size: 15px;
    font-weight: bold;
    color: var(--check-mark);
    opacity: 0;
  }
}

dialog {
  background: linear-gradient(var(--window1), var(--window2));
  border: 1px solid var(--control-frame);
  color: var(--normal-text);
  margin: auto;
  user-select: auto;
}

:focus {
  outline: var(--focus-frame);
}
</style>
