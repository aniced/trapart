import { Demo } from './components/Demo'
// import Sandbox from './Sandbox.tsx'
import './App.scss'

export function App() {
	return <>
		<div class="vbox" style="width: 200px;">
			<menu class="menu-bar">menu bar</menu>
			<div class="fill">
				A list?
			</div>
			<ul class="status-bar">
				<li>Ready.</li>
				<hr />
				<li>Hi!</li>
			</ul>
		</div>
		<div id="workingArea" class="fill scroll">
			<Demo />
		</div>
	</>
}
