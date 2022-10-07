<script setup lang="ts">
import TheWelcome from "./components/TheWelcome.vue"
import DeluxeLabel from "./components/basic-controls/DeluxeLabel.vue"
import Checkerboard from "./components/basic-controls/Checkerboard.vue"
import GroupBox from "./components/basic-controls/GroupBox.vue";
import RoundFrame from "./components/basic-controls/RoundFrame.vue";
import ThickFrame from "./components/basic-controls/ThickFrame.vue";
import SpinBox from "./components/basic-controls/SpinBox.vue";
import ProgressBar from "./components/basic-controls/ProgressBar.vue";
import TabView from "./components/basic-controls/TabView.vue";
import { ref, watchEffect } from 'vue'
import HintArea from './components/basic-controls/HintArea.vue'
const x = ref(114)
const y = ref(0)
</script>

<template>
  <header>
    <fieldset></fieldset>
    <button class="ellipsis">确定哼哼啊啊啊啊啊</button>
    <fieldset disabled>
      <HintArea title="哼哼">
      <DeluxeLabel>标题</DeluxeLabel>
        <template v-slot:hint>
          这是关于标题的说明。
          <hr>
          这在分割线以下。
        </template>
      </HintArea>
      <button>取消</button>
      <Checkerboard :red="0" :green="0" :blue="128">内容图像</Checkerboard>
      <GroupBox>
        <template #title>标题</template>
        内容
      </GroupBox>
      <div style="width:164px;height:100px;overflow:scroll;border:1px solid green">
        longllllllllllllllllllllllllllllllllll long Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates
        aut perferendis dolores ab facere mollitia modi aliquid ipsa autem sed laborum illo repudiandae sit, id maxime
        possimus eos laboriosam. Eius?</div>
      <TabView :pages="['a', 'bb','c','d','e','gg','f','we','f..','i','j','mm','z']" style="height:514px" v-model="y"
        tab-position="left"></TabView>
    </fieldset>
  </header>

  <main>
    <RoundFrame>
      <ThickFrame></ThickFrame>
    </RoundFrame>

    <SpinBox prefix="$[" v-model="x" suffix="]%" :minimum-value="-9" :maximum-value="500"></SpinBox>
    <ProgressBar :value="37" :max="100"></ProgressBar>

    <TheWelcome />
  </main>
</template>

<style>
:root {
  color-scheme: light;

  --window2: #d0dbe8;
  /* Qt.lighter(data.window2, 1.1) */
  --window1: #e5f1ff;
  /* Qt.darker(data.window2, 1.2) */
  --outside-area: #adb6c1;
  /* Qt.darker(data.window2, 1.1) */
  --inactive-tab1: #bdc7d3;
  /* Qt.darker(data.window2, 1.2) */
  --inactive-tab2: #adb6c1;
  /* Qt.darker(data.window2, 1.7) */
  --control-frame: #7a8088;
  /* Qt.darker(data.window2, 1.1) */
  --scrollbar1: #bdc7d3;
  --scrollbar2: var(--window2);
  /* Annoying: this value should be rgb(from var(--scrollbar1) r g b / 70%) but that's way in the future (CSS Color 5). */
  --pressed-scrollbar1: #bdc7d3b3;
  /* This is var(--control-frame) / 70% blended on var(--scrollbar2). */
  --pressed-scrollbar-control-frame: #949ba5;
  --focus-frame: #648cb4;

  --normal-text: #000000;
  --normal-text-70: #000000b3;
  --normal-text-50: #00000080;
  --normal-back1: #ffffff;
  --normal-back2: #e4ecf2;
  --selected-text: #ffffff;
  --selected-back: #0064c8;
  --selected-ed-text: var(--normal-text);
  --selected-ed-back: #bbddff;
  --disabled-text: #00000080;
  /* data.disabledOpacity is solely for double dimming of button labels. Hence we multiply the alpha components here. */
  --disabled-button-text: #00000040;
  --hyperlink-text: #0000ff;

  --button1: #eef6fc;
  --button2: #aeb6bc;
  --button: padding-box linear-gradient(var(--button1), var(--button2));
  --pressed-button1: var(--button2);
  --pressed-button2: var(--button1);
  --pressed-button: padding-box linear-gradient(var(--pressed-button1), var(--pressed-button2));
  --pressed-button-text: var(--normal-text);
  --hot-button1: #ffffff;
  --hot-button2: #c0e0ff;
  --hot-button: padding-box linear-gradient(var(--hot-button1), var(--hot-button2));
  --hot-button-text: var(--normal-text);
  /* twinklingBtn1 and twinklingBtn2 are only applied to the default button, where the opacity of the Rectangle is 0.5. Hence we include the alpha component here. */
  /* Qt.lighter("#38d", 1.8) */
  --twinkling-btn1: #cae4ff80;
  /* Qt.lighter("#38d", 1.5) */
  --twinkling-btn2: #87c3ff80;
  --twinkling-btn: padding-box linear-gradient(var(--twinkling-btn1), var(--twinkling-btn2));
  --group-box1: #90b0d060;
  --group-box2: #7090b060;
  --group-box-frame: #ffffff;
  --deluxe-label1: #0050a0;
  /* Qt.lighter(data.deluxeLabel1, 1.2) */
  --deluxe-label2: #0060c0;
  --deluxe-label-text: #ffffff;

  --highlight: #ffffff80;
  --work-area: #224488;
  --check-mark: #4466aa;
  --drop-target: #ffee60;
  --progress-bar: #4499dd;
  /* GradientStop {color: Qt.lighter(root.color, 1.3); position: 0} */
  --progress-bar1: #6fbfff;
  /* border.color: Qt.darker(root.color, 1.2) */
  --progress-bar-frame: #387fb8;

  /* The PNG resources are solid. To mitigate difficulties in scrollbar styling, the opacity is baked into the following SVG data. An opacity: 0.7 multiplied with fill-opacity='0.7' will approximately give the desired opacity of 0.5 in disabled cases. */
  --arrow-left-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 3.5 l 3.5 -3.5 v 7 z' fill='black' fill-opacity='0.7' /%3E%3C/svg%3E");
  --arrow-right-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 0 l 3.5 3.5 l -3.5 3.5 z' fill='black' fill-opacity='0.7' /%3E%3C/svg%3E");
  --arrow-up-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 3.5 0 l 3.5 3.5 h -7 z' fill='black' fill-opacity='0.7' /%3E%3C/svg%3E");
  --arrow-down-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 0 0 h 7 l -3.5 3.5 z' fill='black' fill-opacity='0.7' /%3E%3C/svg%3E");

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

  --fixed-font: "M+ 1m regular";
  --normal-font: "M+ 1c regular";
  --medium-font: "M+ 1p medium";
  --heavy-font: "M+ 1p heavy";
  /* for CheckBox */
  --symbol-font: "M+ 1p heavy";
  --font-size: 14px;
  --label-font-size: 13px;
  --control-height: 27px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;

    --window1: #474b4d;
    --window2: #2f3335;
    --outside-area: #181819;
    --inactive-tab1: #373b3d;
    --inactive-tab2: #1f2325;
    --control-frame: #111618;
    --scrollbar1: #515658;
    --scrollbar2: #616668;
    --pressed-scrollbar1: #515658b3;
    --pressed-scrollbar-control-frame: #292e30;
    --focus-frame: #4e78a1;

    --normal-text: #cccccc;
    --normal-text-70: #ccccccb3;
    --normal-text-50: #cccccc80;
    --normal-back1: #25282a;
    --normal-back2: #2c2f31;
    --selected-text: #cccccc;
    --selected-back: #4b6eaf;
    --selected-ed-text: var(--normal-text);
    --selected-ed-back: #4b6eaf;
    --disabled-text: #777777;
    --disabled-button-text: #77777780;
    --hyperlink-text: #0099ff;

    --button1: #616668;
    --button2: #54595b;
    --pressed-button1: var(--button2);
    --pressed-button2: var(--button1);
    --pressed-button-text: var(--normal-text);
    --hot-button1: #717678;
    --hot-button2: #64696b;
    --hot-button-text: var(--normal-text);
    --twinkling-btn1: #173e7080;
    --twinkling-btn2: #08214780;
    --group-box1: #ffffff18;
    --group-box2: #ffffff10;
    --group-box-frame: #202020;
    --deluxe-label1: #272b2d;
    --deluxe-label2: #0f1315;
    --deluxe-label-text: #dddddd;

    --highlight: #51555780;
    --work-area: #224488;
    --check-mark: #aaaaaa;
    --drop-target: #456ea6;

    --arrow-left-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 3.5 l 3.5 -3.5 v 7 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");
    --arrow-right-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 0 l 3.5 3.5 l -3.5 3.5 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");
    --arrow-up-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 3.5 0 l 3.5 3.5 h -7 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");
    --arrow-down-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 0 0 h 7 l -3.5 3.5 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");

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
}

@media screen and (-ms-high-contrast: white-on-black) {
  :root {
    color-scheme: light;

    --window1: #000000;
    --window2: #000000;
    --outside-area: #000000;
    --inactive-tab1: #000000;
    --inactive-tab2: #000000;
    --control-frame: #ffffff;
    --scrollbar1: #000000;
    --scrollbar2: #000000;
    --pressed-scrollbar1: #000000b3;
    --pressed-scrollbar-control-frame: #ffffffb3;
    --focus-frame: #ffff00;

    --normal-text: #ffffff;
    --normal-text-70: #ffffffb3;
    --normal-text-50: #ffffff80;
    --normal-back1: #000000;
    --normal-back2: #000000;
    --selected-text: #000000;
    --selected-back: #1AEBFF;
    --selected-ed-text: #000000;
    --selected-ed-back: #1AEBFF;
    --disabled-text: #00FF00;
    --disabled-button-text: var(--disabled-text);
    --hyperlink-text: #00ffff;

    --button1: #000000;
    --button2: #000000;
    --pressed-button1: var(--button2);
    --pressed-button2: var(--button1);
    --pressed-button-text: #000000;
    --hot-button1: #1AEBFF;
    --hot-button2: #1AEBFF;
    --hot-button-text: #000000;
    --twinkling-btn1: #1AEBFF80;
    --twinkling-btn2: #1AEBFF80;
    --group-box1: #000000;
    --group-box2: #000000;
    --group-box-frame: #ffffff;
    --deluxe-label1: #000000;
    --deluxe-label2: #000000;
    --deluxe-label-text: #ffffff;

    --highlight: #ffffff80;
    --work-area: #224488;
    --check-mark: #FFFFFF;
    --drop-target: #1AEBFF;
    --progress-bar: #1AEBFF;
    --progress-bar1: #66F1FF;
    --progress-bar-frame: #15C3D4;

    --arrow-left-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 3.5 l 3.5 -3.5 v 7 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");
    --arrow-right-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='7'%3E%3Cpath d='M 0 0 l 3.5 3.5 l -3.5 3.5 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");
    --arrow-up-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 3.5 0 l 3.5 3.5 h -7 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");
    --arrow-down-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M 0 0 h 7 l -3.5 3.5 z' fill='white' fill-opacity='0.7' /%3E%3C/svg%3E");

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
}

@media screen and (-ms-high-contrast: black-on-white) {
  :root {
    color-scheme: dark;

    --window1: #FFFFFF;
    --window2: #FFFFFF;
    --outside-area: #FFFFFF;
    --inactive-tab1: #FFFFFF;
    --inactive-tab2: #FFFFFF;
    --control-frame: #000000;
    --scrollbar1: #FFFFFF;
    --scrollbar2: #FFFFFF;
    --pressed-scrollbar1: #FFFFFFB3;
    --pressed-scrollbar-control-frame: #000000B3;
    --focus-frame: #00009F;

    --normal-text: #000000;
    --normal-text-70: #000000b3;
    --normal-text-50: #00000080;
    --normal-back1: #FFFFFF;
    --normal-back2: #FFFFFF;
    --selected-text: #FFFFFF;
    --selected-back: #37006E;
    --selected-ed-text: #FFFFFF;
    --selected-ed-back: #37006E;
    --disabled-text: #800000;
    --disabled-button-text: var(--disabled-text);
    --hyperlink-text: #0000ff;

    --button1: #FFFFFF;
    --button2: #FFFFFF;
    --pressed-button1: var(--button2);
    --pressed-button2: var(--button1);
    --pressed-button-text: #FFFFFF;
    --hot-button1: #37006E;
    --hot-button2: #37006E;
    --hot-button-text: #FFFFFF;
    --twinkling-btn1: #37006E80;
    --twinkling-btn2: #37006E80;
    --group-box1: #FFFFFF;
    --group-box2: #FFFFFF;
    --group-box-frame: #000000;
    --deluxe-label1: #FFFFFF;
    --deluxe-label2: #FFFFFF;
    --deluxe-label-text: #000000;

    --highlight: #00000080;
    --work-area: #224488;
    --check-mark: #000000;
    --drop-target: #37006E;
    --progress-bar: #37006E;
    --progress-bar1: #47008F;
    --progress-bar-frame: #2D005B;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  border: 0;
  padding: 0;
  font-weight: normal;
  cursor: default;
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
}

/* <hr> models the separator between the text and the component in a ToolTip, seen in e.g., the damage formula input in the database (atk, def, …) and help for message control characters (\V[n], \N[n], …). */
hr {
  height: 1px;
  margin: 6px auto;
  background-color: var(--control-frame);
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


/* The transparent border is for correct sizing, which in turn gives correct hit test areas. */
/* Non-interactive components, on the other hand, may find having a container element being a more natural approach. */
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
  /* anchors.verticalCenter: parent.verticalCenter */
  line-height: calc(var(--control-height) - 4px);
  color: var(--normal-text);
  /* anchors.margins: 1; radius: 2.5 */
  border-radius: 3.5px;
  box-shadow: inset 0 0 0 1px var(--highlight);
}

button>img:first-child {
  margin-right: 2px;
  vertical-align: middle;
}

button:focus {
  background: var(--arrow-image), var(--twinkling-btn), var(--button);
  /* Subtlety. Only the focus ring should get a radius of 2px, not the button itself. Does not make much difference, though. */
  /* To compensate for the button border, which should still be (barely) visible under the focus ring, another pixel of rounded corners is added. */
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
  color: var(--disabled-button-text);
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

/* EllipsisBox and LabeledEllipsisBox emit mouse wheel events but no code actually handles them. */

:focus {
  outline: 2px solid var(--focus-frame);
}
</style>
