<script setup lang="ts">
import TheWelcome from "./components/TheWelcome.vue"
import DeluxeLabel from "./components/basic-controls/DeluxeLabel.vue"
import Checkerboard from "./components/basic-controls/Checkerboard.vue"
</script>

<template>
  <header>
    <fieldset></fieldset>
    <fieldset disabled>
      <button>确定</button>
      <DeluxeLabel>标题</DeluxeLabel>
      <div class="hint-area">Actors</div>
      <button>取消</button>
      <Checkerboard>内容图像</Checkerboard>
    </fieldset>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style>
:root {
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
  --focus-frame: #648cb4;

  --normal-text: #000000;
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
  --button: linear-gradient(var(--button1), var(--button2));
  --pressed-button1: var(--button2);
  --pressed-button2: var(--button1);
  --pressed-button: linear-gradient(var(--pressed-button1), var(--pressed-button2));
  --pressed-button-text: var(--normal-text);
  --hot-button1: #ffffff;
  --hot-button2: #c0e0ff;
  --hot-button: linear-gradient(var(--hot-button1), var(--hot-button2));
  --hot-button-text: var(--normal-text);
  /* twinklingBtn1 and twinklingBtn2 are only applied to the default button, where the opacity of the Rectangle is 0.5. Hence we include the alpha component here. */
  /* Qt.lighter("#38d", 1.8) */
  --twinkling-btn1: #cae4ff80;
  /* Qt.lighter("#38d", 1.5) */
  --twinkling-btn2: #87c3ff80;
  --twinkling-btn: linear-gradient(var(--twinkling-btn1), var(--twinkling-btn2));
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

  --arrow: black;

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
    --window1: #474b4d;
    --window2: #2f3335;
    --outside-area: #181819;
    --inactive-tab1: #373b3d;
    --inactive-tab2: #1f2325;
    --control-frame: #111618;
    --scrollbar1: #515658;
    --scrollbar2: #616668;
    --focus-frame: #4e78a1;

    --normal-text: #cccccc;
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
    --progress-bar: #4499dd;

    --arrow: white;

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
    --window1: #000000;
    --window2: #000000;
    --outside-area: #000000;
    --inactive-tab1: #000000;
    --inactive-tab2: #000000;
    --control-frame: #ffffff;
    --scrollbar1: #000000;
    --scrollbar2: #000000;
    --focus-frame: #ffff00;

    --normal-text: #ffffff;
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

    --arrow: white;

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
    --window1: #FFFFFF;
    --window2: #FFFFFF;
    --outside-area: #FFFFFF;
    --inactive-tab1: #FFFFFF;
    --inactive-tab2: #FFFFFF;
    --control-frame: #000000;
    --scrollbar1: #FFFFFF;
    --scrollbar2: #FFFFFF;
    --focus-frame: #00009F;

    --normal-text: #000000;
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
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  border: 0;
  padding: 0;
  position: relative;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--normal-text);
  background: linear-gradient(var(--window1), var(--window2));
  transition: color 0.5s, background-color 0.5s;
  line-height: 1.6;
  font-family: system-ui;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: subpixel-antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button {
  width: 90px;
  height: var(--control-height);
  font-family: var(--medium-font);
  font-size: var(--font-size);
  border: 2px solid transparent;
  outline: 1px solid var(--control-frame);
  outline-offset: -2px;
  background-clip: padding-box;
  background-image: var(--button);
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
  background-image: var(--twinkling-btn), var(--button);
  /* Subtlety. Only the focus ring should get a radius of 2px, not the button itself. Does not make much difference, though. */
  /* To compensate for the button border, which should still be (barely) visible under the focus ring, another pixel of rounded corners is added. */
  border-radius: 3px;
}

button:enabled:hover {
  background-image: var(--hot-button);
  color: var(--hot-button-text);
}

button:enabled:active {
  background-image: var(--pressed-button);
  color: var(--pressed-button-text);
}

button:focus:hover {
  background-image: var(--twinkling-btn), var(--hot-button);
}

button:focus:active {
  background-image: var(--twinkling-btn), var(--pressed-button);
}

button:disabled {
  background-color: var(--window2);
  background-image: none;
  color: var(--disabled-button-text);
}

:focus {
  outline: 2px solid var(--focus-frame);
  outline-offset: -2px;
}
</style>
