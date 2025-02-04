export function ProgressBar(props: { value: number }) {
	return <div class="progress-bar" classList={{
		indeterminate: !Number.isFinite(props.value),
	}}>
		&ZeroWidthSpace;
		<div style={{ flex: Number.isFinite(props.value) ? props.value : undefined }} />
	</div>
}
